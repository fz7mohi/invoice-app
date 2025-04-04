import axios from 'axios';

// API configuration from environment variables
// For Laravel Mix applications, we can use a global variable
const BREVO_API_KEY = window.BREVO_API_KEY || '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';
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const SENDER_EMAIL = 'sales@fortunegiftz.com';
const SENDER_NAME = 'Fortune Giftz';

// Debug: Log the API key (first 10 characters only for security)
console.log('API Key loaded:', BREVO_API_KEY ? `${BREVO_API_KEY.substring(0, 10)}...` : 'Not loaded');
console.log('API Key length:', BREVO_API_KEY ? BREVO_API_KEY.length : 0);

/**
 * Sends an email with a PDF attachment using Brevo API
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
    console.log('Using API key:', BREVO_API_KEY ? `${BREVO_API_KEY.substring(0, 10)}...` : 'Not loaded');
    console.log('API Key length in send function:', BREVO_API_KEY ? BREVO_API_KEY.length : 0);
    
    if (!BREVO_API_KEY) {
      throw new Error('Brevo API key is not configured. Please check your environment variables.');
    }
    
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
    
    // Add attachment if provided
    if (pdfBase64 && pdfFileName) {
      emailData.attachment = [
        {
          content: pdfBase64,
          name: pdfFileName,
        },
      ];
    }
    
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
    
    console.log('Email sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    // Log more detailed error information
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      
      // Provide more specific error messages based on the response
      if (error.response.status === 401) {
        if (error.response.data.message === 'API Key is not enabled') {
          console.error('API Key is valid but does not have the necessary permissions. Please check your Brevo account settings and ensure the API key has SMTP/Transactional Email permissions.');
        } else if (error.response.data.message === 'Key not found') {
          console.error('API Key is invalid or has been revoked. Please check your API key and update it if necessary.');
        } else if (error.response.data.message === 'authentication not found in headers') {
          console.error('API Key is not being properly passed in the request headers. Please check your environment variable configuration.');
        }
      }
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
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="color: #333; margin-bottom: 15px;">Dear ${clientName},</h2>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
          Thank you for choosing Fortune Gifts Trading W.L.L. for your corporate gifting needs. We are pleased to provide you with our ${documentType.toLowerCase()} for the services rendered.
        </p>
        
        <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
          About Fortune Gifts Trading W.L.L.:<br>
          Fortune Gifts Trading W.L.L. is a leading provider of corporate and promotional gifting solutions, with a presence across UAE, Qatar, India, and China. Established in 2008, we specialize in delivering custom-branded merchandise that helps businesses enhance visibility, strengthen relationships, and leave a lasting impression. From creative consultation to on-time delivery, we turn everyday products into powerful brand experiences — making us a trusted partner for companies looking to stand out.
        </p>
        
        <p style="color: #666; line-height: 1.6;">
          We value our partnership and are committed to delivering exceptional service. Your ${documentType.toLowerCase()} is attached for your records. If you have any questions or require any clarification regarding the ${documentType.toLowerCase()}, please don't hesitate to contact us.
        </p>
      </div>
      
      <div style="text-align: center; color: #999; font-size: 12px; margin-top: 30px;">
        <p>This is an automated message. Please do not reply to this email.</p>
        <p>© ${new Date().getFullYear()} Fortune Giftz. All rights reserved.</p>
      </div>
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