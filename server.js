const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');
const { db } = require('./src/firebase/firebase.js');
const { collection, addDoc } = require('firebase/firestore');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  credentials: true,
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));

// Add OPTIONS handling for preflight requests
app.options('*', cors(corsOptions));

// Add CORS headers middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (corsOptions.origin && typeof corsOptions.origin === 'function') {
    corsOptions.origin(origin, (err, allowed) => {
      if (allowed) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', corsOptions.methods.join(', '));
        res.setHeader('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(', '));
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Max-Age', corsOptions.maxAge);
      }
      next();
    });
  } else {
    next();
  }
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Client creation endpoint
app.post('/api/clients', async (req, res) => {
  try {
    const {
      companyName,
      email,
      phone,
      address,
      country,
      trnNumber,
      vatPercentage
    } = req.body;

    // Validate required fields
    if (!companyName || !email || !phone || !address || !country) {
      return res.status(400).json({
        error: 'Missing required fields',
        details: {
          companyName: !companyName ? 'Company name is required' : null,
          email: !email ? 'Email is required' : null,
          phone: !phone ? 'Phone is required' : null,
          address: !address ? 'Address is required' : null,
          country: !country ? 'Country is required' : null
        }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Validate UAE-specific fields
    if (country === 'United Arab Emirates') {
      if (!trnNumber) {
        return res.status(400).json({
          error: 'TRN Number is required for UAE clients'
        });
      }
      if (!vatPercentage) {
        return res.status(400).json({
          error: 'VAT Percentage is required for UAE clients'
        });
      }
      if (isNaN(parseFloat(vatPercentage))) {
        return res.status(400).json({
          error: 'VAT Percentage must be a number'
        });
      }
    }

    // Create client object
    const newClient = {
      companyName,
      email,
      phone,
      address,
      country,
      trnNumber: trnNumber || '',
      vatPercentage: vatPercentage || '5',
      createdAt: new Date()
    };

    // Add to Firestore
    const clientsCollection = collection(db, 'clients');
    const docRef = await addDoc(clientsCollection, newClient);

    // Return the created client with its ID
    res.status(201).json({
      id: docRef.id,
      ...newClient
    });

  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({
      error: 'Failed to create client',
      details: error.message
    });
  }
});

// Mount API routes
const apiRouter = express.Router();

// Mount API routes
app.use('/api', apiRouter);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something broke!',
    details: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('CORS enabled for all domains');
}); 