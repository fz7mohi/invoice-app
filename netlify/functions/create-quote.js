const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, doc, getDoc, initializeFirestore, memoryLocalCache } = require('firebase/firestore');

// Firebase configuration from environment variables
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

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
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
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
    // Parse request body
    const quoteData = JSON.parse(event.body);
    console.log('Received quote data:', quoteData);

    // Validate required fields
    const requiredFields = ['clientId', 'quoteNumber', 'quoteDate', 'validUntil', 'items', 'subtotal', 'total', 'status'];
    const missingFields = requiredFields.filter(field => !quoteData[field]);
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields);
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

    // Set default taxAmount if not provided
    if (!quoteData.taxAmount) {
      quoteData.taxAmount = 0;
    }

    // Validate items array
    if (!Array.isArray(quoteData.items) || quoteData.items.length === 0) {
      console.error('Invalid items array');
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'Invalid items array',
          details: 'Items must be a non-empty array'
        })
      };
    }

    // Validate each item
    const itemRequiredFields = ['productId', 'quantity', 'unitPrice'];
    for (const item of quoteData.items) {
      const missingItemFields = itemRequiredFields.filter(field => !item[field]);
      if (missingItemFields.length > 0) {
        console.error('Invalid item:', item, 'Missing fields:', missingItemFields);
        return {
          statusCode: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            error: 'Invalid item data',
            details: `Missing fields in item: ${missingItemFields.join(', ')}`
          })
        };
      }
    }

    // Check if client exists
    const clientRef = doc(db, 'clients', quoteData.clientId);
    const clientDoc = await getDoc(clientRef);
    
    if (!clientDoc.exists()) {
      console.error('Client not found:', quoteData.clientId);
      return {
        statusCode: 404,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'Client not found',
          details: `No client found with ID: ${quoteData.clientId}`
        })
      };
    }

    // Add timestamp
    const quoteWithTimestamp = {
      ...quoteData,
      createdAt: new Date().toISOString()
    };

    // Add quote to Firestore
    console.log('Adding quote to Firestore...');
    const quoteRef = await addDoc(collection(db, 'quotes'), quoteWithTimestamp);
    console.log('Quote added successfully with ID:', quoteRef.id);

    // Return success response
    return {
      statusCode: 201,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: quoteRef.id,
        ...quoteWithTimestamp
      })
    };
  } catch (error) {
    console.error('Error creating quote:', error);
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Failed to create quote',
        details: error.message
      })
    };
  }
}; 