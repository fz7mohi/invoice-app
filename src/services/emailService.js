import axios from 'axios';

// API configuration from environment variables
const BREVO_API_KEY = process.env.REACT_APP_BREVO_API_KEY;
const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const SENDER_EMAIL = 'sales@fortunegiftz.com';
const SENDER_NAME = 'Fortune Giftz';

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
    const response = await axios.post(
      BREVO_API_URL,
      {
        sender: {
          email: SENDER_EMAIL,
          name: SENDER_NAME,
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent,
        attachment: [
          {
            content: pdfBase64,
            name: pdfFileName,
          },
        ],
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
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
    const response = await axios.post(
      BREVO_API_URL,
      {
        sender: {
          email: SENDER_EMAIL,
          name: SENDER_NAME,
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent,
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'api-key': BREVO_API_KEY,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending test email:', error);
    throw error;
  }
};

/**
 * Generates a default HTML email template for invoices and quotations
 * @param {Object} params - Template parameters
 * @param {string} params.clientName - Name of the client
 * @param {string} params.documentType - Type of document (invoice/quotation)
 * @param {string} params.documentId - ID of the document
 * @param {number} params.amount - Total amount
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