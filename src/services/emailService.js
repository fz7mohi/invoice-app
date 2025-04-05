import axios from 'axios';

// Use the absolute URL for the Netlify function
const API_URL = 'https://fordox.netlify.app/.netlify/functions/send-email';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

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
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    try {
      // Debug: Log the request details (without sensitive data)
      console.log('Sending email to:', to);
      console.log('Subject:', subject);
      console.log('Using API URL:', API_URL);
      console.log('Retry attempt:', retries + 1);
      
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
        timeout: 30000, // 30 second timeout
      });
      
      console.log('Email sent successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error sending email:', error);
      
      // Handle rate limiting
      if (error.response?.status === 429) {
        const retryAfter = error.response.headers['retry-after'] || RETRY_DELAY;
        console.log(`Rate limited. Waiting ${retryAfter}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, retryAfter));
        retries++;
        continue;
      }
      
      // Handle server errors (5xx)
      if (error.response?.status >= 500) {
        retries++;
        if (retries < MAX_RETRIES) {
          console.log(`Server error. Retrying in ${RETRY_DELAY}ms...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
          continue;
        }
      }
      
      // Handle 404 errors specifically
      if (error.response?.status === 404) {
        console.error('API endpoint not found. Please check your Netlify function deployment.');
        throw new Error('Email service is currently unavailable. Please try again later or contact support.');
      }
      
      // Log detailed error information
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        throw new Error(error.response.data.details || error.response.data.error || 'Failed to send email');
      } else if (error.request) {
        console.error('No response received from server:', error.request);
        throw new Error('No response from server. Please check your connection.');
      } else {
        console.error('Error setting up request:', error.message);
        throw new Error('Failed to set up email request.');
      }
    }
  }
  
  throw new Error('Maximum retry attempts reached. Please try again later.');
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
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">Document ID:</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${documentId}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">Amount:</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${amount} ${currency}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">Due Date:</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${dueDate}</td>
        </tr>
      </table>
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

// Function to generate a quotation email template
export const generateQuotationEmailTemplate = ({ clientName }) => {
  return `
    <html>
      <body>
        <p>Hi ${clientName},</p>
        <p>Hope you're doing well!</p>
        <p>As discussed, I've attached the quotation for your requested products. It includes all branding and delivery charges — no hidden costs.</p>
        <p>Take your time to review it. If you'd like to adjust anything or need a custom sample, just let me know!</p>
        <p>Thanks again for considering Fortune Gifts.</p>
        <p>Warm regards,<br>
        Fayas<br>
        Sales Head - GCC<br>
        Fortune Gifts Trading W.L.L.<br>
        Old Salata - Doha<br>
        Qatar<br>
        📞 +974 7001 3984</p>
      </body>
    </html>
  `;
};

// Function to generate an invoice email template
export const generateInvoiceEmailTemplate = ({ clientName }) => {
  return `
    <html>
      <body>
        <p>Hello ${clientName},</p>
        <p>Thanks once again for your order!</p>
        <p>Please find attached the invoice for your recent purchase. It contains all the payment details you'll need. Feel free to get in touch if anything needs clarification.</p>
        <p>We truly appreciate your business and look forward to serving you again.</p>
        <p>Warm regards,<br>
        Fayas<br>
        Sales Head - GCC<br>
        Fortune Gifts Trading W.L.L.<br>
        Old Salata - Doha<br>
        Qatar<br>
        📞 +974 7001 3984</p>
      </body>
    </html>
  `;
};

// Function to generate a receipt email template
export const generateReceiptEmailTemplate = ({ clientName, invoiceNumber }) => {
  return `
    <html>
      <body>
        <p>Hi ${clientName},</p>
        <p>We're happy to confirm that we've received your payment for Invoice #${invoiceNumber}.</p>
        <p>Please find the attached payment receipt for your records.</p>
        <p>We appreciate your prompt payment and the opportunity to serve you.</p>
        <p>If you need anything else, we're just a message away!</p>
        <p>Warm regards,<br>
        Rajeev Kumar<br>
        Accounts & Finance<br>
        Fortune Gifts Trading W.L.L.<br>
        📞 +974 7001 3984</p>
      </body>
    </html>
  `;
}; 