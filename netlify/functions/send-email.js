const axios = require('axios');
require('dotenv').config();

// Security headers
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Access-Control-Allow-Origin': '*', // Allow CORS for all origins
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type'
};

// Rate limiting setup
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 10; // 10 requests per minute

const isRateLimited = (ip) => {
  const now = Date.now();
  const userRequests = rateLimit.get(ip) || [];
  const recentRequests = userRequests.filter(time => now - time < RATE_LIMIT_WINDOW);
  
  if (recentRequests.length >= MAX_REQUESTS) {
    return true;
  }
  
  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);
  return false;
};

exports.handler = async (event, context) => {
  // Add security headers to all responses
  const headers = {
    ...securityHeaders,
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS requests for CORS
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
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

  // Rate limiting
  const clientIP = event.headers['client-ip'] || event.headers['x-forwarded-for'] || 'unknown';
  if (isRateLimited(clientIP)) {
    return {
      statusCode: 429,
      headers: {
        ...headers,
        'Retry-After': '60'
      },
      body: JSON.stringify({ error: 'Too many requests. Please try again later.' })
    };
  }

  try {
    // Log request details for debugging
    console.log('Received email request:', {
      method: event.httpMethod,
      path: event.path,
      headers: event.headers,
      body: event.body ? JSON.parse(event.body) : null
    });

    const { to, subject, htmlContent, pdfBase64, pdfFileName } = JSON.parse(event.body);

    // Validate required fields
    if (!to || !subject || !htmlContent) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Get API key from environment variables
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.error('BREVO_API_KEY is not set in environment variables');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Server configuration error' })
      };
    }

    // Construct email payload
    const emailData = {
      sender: {
        email: process.env.SENDER_EMAIL || 'your-verified-sender@example.com',
        name: process.env.SENDER_NAME || 'Your Company Name'
      },
      to: [{ email: to }],
      subject,
      htmlContent,
      ...(pdfBase64 && pdfFileName && {
        attachment: [{
          content: pdfBase64,
          name: pdfFileName
        }]
      })
    };

    // Send email using Brevo API
    const response = await axios.post('https://api.brevo.com/v3/smtp/email', emailData, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey
      }
    });

    // Log success (without sensitive data)
    console.log('Email sent successfully to:', to);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Email sent successfully' })
    };

  } catch (error) {
    // Log error details (without sensitive data)
    console.error('Error sending email:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    // Return appropriate error response
    return {
      statusCode: error.response?.status || 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to send email',
        details: error.response?.data?.message || error.message
      })
    };
  }
}; 