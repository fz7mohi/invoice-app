const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, initializeFirestore, memoryLocalCache } = require('firebase/firestore');

// Firebase configuration from environment variables
let firebaseConfig;
try {
  firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
  console.log('Firebase config loaded successfully');
} catch (error) {
  console.error('Failed to parse FIREBASE_CONFIG:', error);
  throw new Error('Invalid FIREBASE_CONFIG environment variable');
}

// Initialize Firebase outside the handler to reuse the connection
let db;
try {
  console.log('Initializing Firebase...');
  const firebaseApp = initializeApp(firebaseConfig);
  // Initialize Firestore with memory cache to avoid IndexedDB issues
  db = initializeFirestore(firebaseApp, {
    localCache: memoryLocalCache()
  });
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error; // Re-throw to ensure the error is not silently handled
}

exports.handler = async (event, context) => {
  // Set a timeout for the function
  context.callbackWaitsForEmptyEventLoop = false;

  // Determine allowed origin based on request origin
  const requestOrigin = event.headers.origin || event.headers.Origin;
  const allowedOrigins = ['https://fortunegiftz.com', 'http://localhost:8082', 'http://localhost:8888'];
  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigins.includes(requestOrigin) ? requestOrigin : 'https://fortunegiftz.com',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Max-Age': '86400' // 24 hours
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204, // No content for preflight
      headers: corsHeaders,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Check if Firebase is initialized
  if (!db) {
    console.error('Database not initialized');
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Database connection error',
        details: 'Firebase initialization failed'
      })
    };
  }

  try {
    console.log('Parsing request body...');
    const clientData = JSON.parse(event.body);
    console.log('Request body parsed successfully:', clientData);

    // Validate required fields
    const requiredFields = ['companyName', 'email', 'phone', 'address', 'country'];
    const missingFields = requiredFields.filter(field => !clientData[field]);

    if (missingFields.length > 0) {
      console.log('Missing required fields:', missingFields);
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'Missing required fields',
          details: missingFields
        })
      };
    }

    // Validate UAE-specific fields
    if (clientData.country === 'United Arab Emirates') {
      if (!clientData.trnNumber) {
        console.log('Missing TRN Number for UAE client');
        return {
          statusCode: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            error: 'TRN Number is required for UAE clients'
          })
        };
      }
      if (!clientData.vatPercentage) {
        console.log('Missing VAT Percentage for UAE client');
        return {
          statusCode: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            error: 'VAT Percentage is required for UAE clients'
          })
        };
      }
    }

    console.log('Adding document to Firestore...');
    // Add to Firestore with a timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Operation timed out')), 5000);
    });

    const addDocPromise = addDoc(collection(db, 'clients'), {
      ...clientData,
      createdAt: new Date().toISOString()
    });

    const docRef = await Promise.race([addDocPromise, timeoutPromise]);
    console.log('Document added successfully with ID:', docRef.id);

    return {
      statusCode: 201,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: docRef.id,
        ...clientData,
        createdAt: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error creating client:', error);
    // Log the full error stack trace
    console.error('Error stack:', error.stack);
    return {
      statusCode: error.message === 'Operation timed out' ? 504 : 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: error.message === 'Operation timed out' ? 'Request timed out' : 'Failed to create client',
        details: error.message,
        stack: error.stack // Include stack trace in development
      })
    };
  }
}; 