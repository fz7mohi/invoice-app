const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, getDocs, orderBy, limit, startAfter, where, initializeFirestore, memoryLocalCache } = require('firebase/firestore');

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
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
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
    // Parse query parameters
    const queryParams = event.queryStringParameters || {};
    const searchQuery = queryParams.search || '';
    const page = parseInt(queryParams.page) || 1;
    const itemsPerPage = parseInt(queryParams.itemsPerPage) || 10;
    const lastDocId = queryParams.lastDocId;

    console.log('Query parameters:', { searchQuery, page, itemsPerPage, lastDocId });

    // Build the query
    let clientsQuery = query(
      collection(db, 'clients'),
      orderBy('companyName'),
      limit(itemsPerPage)
    );

    // Add search filter if provided
    if (searchQuery) {
      clientsQuery = query(
        collection(db, 'clients'),
        where('companyName', '>=', searchQuery),
        where('companyName', '<=', searchQuery + '\uf8ff'),
        orderBy('companyName'),
        limit(itemsPerPage)
      );
    }

    // Get the clients
    const clientsSnapshot = await getDocs(clientsQuery);
    
    // Process the results
    const clients = clientsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Get total count for pagination
    const totalQuery = query(collection(db, 'clients'));
    const totalSnapshot = await getDocs(totalQuery);
    const totalClients = totalSnapshot.size;

    console.log(`Retrieved ${clients.length} clients out of ${totalClients} total`);

    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        clients,
        totalClients,
        currentPage: page,
        itemsPerPage,
        hasMore: clients.length === itemsPerPage
      })
    };
  } catch (error) {
    console.error('Error fetching clients:', error);
    return {
      statusCode: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        error: 'Failed to fetch clients',
        details: error.message
      })
    };
  }
}; 