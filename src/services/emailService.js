import axios from 'axios';

// Use the correct API URL based on environment
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://fordox.netlify.app/api/send-email'  // Use the correct domain
  : 'https://fordox.netlify.app/api/send-email';

/**
 * Sends an email with a PDF attachment using our backend API
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} htmlContent - HTML content of the email
 * @param {string} pdfBase64 - Base64 encoded PDF content
 * @param {string} pdfFileName - Name of the PDF file
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendEmailWithAttachment = async (to, subject, htmlContent, pdfBase64, pdfFileName) => {
  try {
    // Debug: Log the request details (without sensitive data)
    console.log('Sending email to:', to);
    console.log('Subject:', subject);
    console.log('Using API URL:', API_URL);
    
    // Create the email payload
    const emailData = {
      to,
      subject,
      htmlContent,
      pdfBase64,
      pdfFileName
    };
    
    // Send the email through our backend
    const response = await axios.post(API_URL, emailData, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout and retry logic
      timeout: 30000,
      validateStatus: function (status) {
        return status >= 200 && status < 500; // Handle all responses
      }
    });
    
    console.log('Email sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    // Log more detailed error information
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received from server:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Error setting up request:', error.message);
    }
    throw error;
  }
};

/**
 * Sends a test email using Brevo API
 * @param {string} to - Recipient email address
 * @returns {Promise} - Promise that resolves when email is sent
 */
export const sendTestEmail = async (to) => {
  const subject = 'Test Email from Fortune Giftz';
  const htmlContent = `
    <html>
      <body>
        <h1>Test Email</h1>
        <p>This is a test email from Fortune Giftz.</p>
      </body>
    </html>
  `;

  try {
    // Debug: Log the request details (without sensitive data)
    console.log('Sending test email to:', to);
    console.log('Using API key:', BREVO_API_KEY ? `${BREVO_API_KEY.substring(0, 10)}...` : 'Not loaded');
    
    // Create the email payload
    const emailData = {
      sender: {
        email: SENDER_EMAIL,
        name: SENDER_NAME,
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent,
    };
    
    // Send the email
    const response = await axios({
      method: 'post',
      url: BREVO_API_URL,
      data: emailData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
    });
    
    console.log('Test email sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending test email:', error);
    // Log more detailed error information
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    throw error;
  }
};

/**
 * Generates an HTML email template for invoices and quotations
 * @param {Object} params - Template parameters
 * @param {string} params.clientName - Client name
 * @param {string} params.documentType - Type of document (invoice/quotation)
 * @param {string} params.documentId - Document ID
 * @param {number} params.amount - Document amount
 * @param {string} params.currency - Currency code
 * @param {string} params.dueDate - Due date
 * @returns {string} - HTML content for the email
 */
export const generateEmailTemplate = ({
  clientName,
  documentType,
  documentId,
  amount,
  currency,
  dueDate
}) => {
  const documentTypeCapitalized = documentType.charAt(0).toUpperCase() + documentType.slice(1);
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <img src="${window.location.origin}/assets/images/black-logo.png" alt="Fortune Gifts" style="max-width: 200px; height: auto;">
      </div>
      <h2 style="color: #004359; margin-bottom: 20px;">Dear ${clientName},</h2>
      <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
        Please find attached your ${documentType.toLowerCase()} ${documentId} for ${amount} ${currency}.
      </p>
      <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
        ${documentTypeCapitalized} Details:
        <br>- Document ID: ${documentId}
        <br>- Amount: ${amount} ${currency}
        <br>- Due Date: ${dueDate}
      </p>
      <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
        If you have any questions or concerns, please don't hesitate to contact us.
      </p>
      <p style="color: #333; line-height: 1.6; margin-bottom: 20px;">
        Best regards,<br>
        Fortune Gifts Team
      </p>
    </div>
  `;
};

/**
 * Tests if the Brevo API key is valid
 * @returns {Promise<boolean>} - Promise that resolves to true if the API key is valid
 */
export const testApiKey = async () => {
  try {
    console.log('Testing API key:', BREVO_API_KEY ? `${BREVO_API_KEY.substring(0, 10)}...` : 'Not loaded');
    console.log('API Key length in test function:', BREVO_API_KEY ? BREVO_API_KEY.length : 0);
    
    // Try a different endpoint that might be more reliable for testing
    const response = await axios({
      method: 'get',
      url: 'https://api.brevo.com/v3/senders',
      headers: {
        'Accept': 'application/json',
        'api-key': BREVO_API_KEY,
      },
    });
    
    console.log('API key is valid:', response.data);
    return true;
  } catch (error) {
    console.error('API key test failed:', error);
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    return false;
  }
}; 