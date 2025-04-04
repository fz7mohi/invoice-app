import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api/send-email'  // In production, use relative path
  : 'http://localhost:3000/api/send-email';  // In development, use full URL

const SENDER_EMAIL = 'sales@fortunegiftz.com';
const SENDER_NAME = 'Fortune Giftz';

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
    
    // Create the email payload
    const emailData = {
      to,
      subject,
      htmlContent,
      pdfBase64,
      pdfFileName
    };
    
    // Send the email through our backend
    const response = await axios.post(API_URL, emailData);
    
    console.log('Email sent successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    // Log more detailed error information
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
    }
    throw error;
  }
};

/**
 * Sends a test email using our backend API
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
    
    // Create the email payload
    const emailData = {
      to,
      subject,
      htmlContent
    };
    
    // Send the email through our backend
    const response = await axios.post(API_URL, emailData);
    
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
        <img src="${window.location.origin}/images/white-logo.png" alt="Fortune Gifts" style="max-width: 200px; height: auto;">
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