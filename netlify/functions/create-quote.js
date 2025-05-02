const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, doc, getDoc, initializeFirestore, memoryLocalCache, Timestamp } = require('firebase/firestore');

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

    // Set default values
    const defaultValues = {
      currency: 'QAR',
      paymentTerms: '30',
      taxAmount: 0,
      status: 'draft'
    };

    // Apply default values
    const quoteWithDefaults = {
      ...defaultValues,
      ...quoteData
    };

    // Validate required fields
    const requiredFields = [
      'clientId',
      'quoteNumber',
      'quoteDate',
      'validUntil',
      'items',
      'subtotal',
      'total',
      'status',
      'clientName',
      'clientEmail',
      'clientAddress',
      'senderAddress'
    ];
    const missingFields = requiredFields.filter(field => !quoteWithDefaults[field]);
    
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

    // Validate address fields
    const requiredAddressFields = ['street', 'country'];
    const validateAddress = (address, type) => {
      const missingAddressFields = requiredAddressFields.filter(field => !address[field]);
      if (missingAddressFields.length > 0) {
        throw new Error(`Missing ${type} address fields: ${missingAddressFields.join(', ')}`);
      }
    };

    try {
      validateAddress(quoteWithDefaults.clientAddress, 'client');
      validateAddress(quoteWithDefaults.senderAddress, 'sender');
    } catch (error) {
      return {
        statusCode: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'Invalid address data',
          details: error.message
        })
      };
    }

    // Validate items array
    if (!Array.isArray(quoteWithDefaults.items) || quoteWithDefaults.items.length === 0) {
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
    const itemRequiredFields = ['productId', 'name', 'quantity', 'unitPrice', 'total'];
    for (const item of quoteWithDefaults.items) {
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
    const clientRef = doc(db, 'clients', quoteWithDefaults.clientId);
    const clientDoc = await getDoc(clientRef);
    
    if (!clientDoc.exists()) {
      console.error('Client not found:', quoteWithDefaults.clientId);
      return {
        statusCode: 404,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          error: 'Client not found',
          details: `No client found with ID: ${quoteWithDefaults.clientId}`
        })
      };
    }

    // Calculate VAT for UAE clients
    if (quoteWithDefaults.clientAddress?.country?.toLowerCase().includes('emirates') || 
        quoteWithDefaults.clientAddress?.country?.toLowerCase().includes('uae')) {
      const totalVat = quoteWithDefaults.items.reduce((sum, item) => {
        const itemTotal = parseFloat(item.total) || 0;
        const itemVat = itemTotal * 0.05; // 5% VAT for each product
        return sum + itemVat;
      }, 0);
      
      quoteWithDefaults.totalVat = totalVat;
    } else {
      quoteWithDefaults.totalVat = 0;
    }

    // Add timestamp
    const quoteWithTimestamp = {
      ...quoteWithDefaults,
      createdAt: Timestamp.now()
    };

    // Add quote to Firestore
    console.log('Adding quote to Firestore...');
    const quoteRef = await addDoc(collection(db, 'quotations'), quoteWithTimestamp);
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
        ...quoteWithTimestamp,
        createdAt: quoteWithTimestamp.createdAt.toDate().toISOString()
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