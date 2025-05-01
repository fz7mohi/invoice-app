const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

exports.handler = async (event, context) => {
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',  // Allow all origins in development
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Credentials': true
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const clientData = JSON.parse(event.body);

    // Validate required fields
    const requiredFields = ['companyName', 'email', 'phone', 'address', 'country'];
    const missingFields = requiredFields.filter(field => !clientData[field]);

    if (missingFields.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required fields',
          details: missingFields
        })
      };
    }

    // Validate UAE-specific fields
    if (clientData.country === 'United Arab Emirates') {
      if (!clientData.trnNumber) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: 'TRN Number is required for UAE clients'
          })
        };
      }
      if (!clientData.vatPercentage) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            error: 'VAT Percentage is required for UAE clients'
          })
        };
      }
    }

    // Add to Firestore
    const docRef = await addDoc(collection(db, 'clients'), {
      ...clientData,
      createdAt: new Date().toISOString()
    });

    return {
      statusCode: 201,
      headers,
      body: JSON.stringify({
        id: docRef.id,
        ...clientData,
        createdAt: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error creating client:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to create client',
        details: error.message
      })
    };
  }
}; 