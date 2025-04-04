const axios = require('axios');

// Load environment variables
require('dotenv').config();

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parse the request body
    const { to, subject, htmlContent, pdfBase64, pdfFileName } = JSON.parse(event.body);
    
    // Validate required fields
    if (!to || !subject || !htmlContent) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
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

    return {
      statusCode: 200,
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.error('Error sending email:', error.response?.data || error.message);
    return {
      statusCode: error.response?.status || 500,
      body: JSON.stringify({
        error: error.response?.data?.message || 'Failed to send email'
      })
    };
  }
}; 