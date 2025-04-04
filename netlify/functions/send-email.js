const axios = require('axios');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { to, subject, htmlContent, pdfBase64, pdfFileName } = JSON.parse(event.body);
    
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
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: response.data }),
    };
  } catch (error) {
    console.error('Error sending email:', error.response?.data || error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        success: false, 
        error: error.response?.data?.message || 'Failed to send email' 
      }),
    };
  }
}; 