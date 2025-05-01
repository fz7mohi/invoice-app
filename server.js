const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const { collection, addDoc } = require('firebase/firestore');
const { db } = require('./firebase');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: [
    'https://fodox.netlify.app',
    'https://fordox.netlify.app',
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:8082'
  ],
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
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Add OPTIONS handling for preflight requests
app.options('*', cors(corsOptions));

// Add CORS headers middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (corsOptions.origin.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', corsOptions.methods.join(', '));
  res.setHeader('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(', '));
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', corsOptions.maxAge);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, htmlContent, pdfBase64, pdfFileName } = req.body;
    
    // Validate required fields
    if (!to || !subject || !htmlContent) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create email payload
    const emailData = {
      sender: {
        email: 'sales@fortunegiftz.com',
        name: 'Fortune Giftz',
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent,
    };

    // Add attachment if provided
    if (pdfBase64 && pdfFileName) {
      emailData.attachment = [{
        content: pdfBase64,
        name: pdfFileName,
      }];
    }

    // Send email using Brevo API
    const response = await axios({
      method: 'post',
      url: 'https://api.brevo.com/v3/smtp/email',
      data: emailData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error sending email:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Failed to send email'
    });
  }
});

// Image proxy endpoint
app.get('/api/image-proxy', async (req, res) => {
    try {
        const imageUrl = req.query.url;
        if (!imageUrl) {
            return res.status(400).send('Image URL is required');
        }

        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer'
        });

        // Set appropriate headers
        res.set('Content-Type', response.headers['content-type']);
        res.set('Content-Length', response.headers['content-length']);
        res.send(response.data);
    } catch (error) {
        console.error('Error proxying image:', error);
        res.status(500).send('Error fetching image');
    }
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
    const docRef = await addDoc(collection(db, 'clients'), newClient);

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

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
  app.get('*', (req, res) => {
    res.sendFile('index.html', { root: 'dist' });
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`CORS enabled for: ${corsOptions.origin.join(', ')}`);
}); 