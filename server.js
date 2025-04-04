const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://fordox.netlify.app',
    // Add any other domains that need access
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, htmlContent, pdfBase64, pdfFileName } = req.body;
    
    // Create the email payload
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
      emailData.attachment = [
        {
          content: pdfBase64,
          name: pdfFileName,
        },
      ];
    }
    
    // Send the email using Brevo API
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
    
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error sending email:', error.response?.data || error.message);
    res.status(500).json({ 
      success: false, 
      error: error.response?.data?.message || 'Failed to send email' 
    });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 