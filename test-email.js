const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Test email function
async function testEmail() {
  try {
    console.log('Testing email functionality...');
    
    // Test data
    const emailData = {
      to: 'your-test-email@example.com', // Replace with your email
      subject: 'Test Email from Invoice App',
      htmlContent: `
        <html>
          <body>
            <h1>Test Email</h1>
            <p>This is a test email from your Invoice App.</p>
            <p>If you received this email, the email functionality is working correctly.</p>
          </body>
        </html>
      `
    };
    
    // Send the email through the local backend
    const response = await axios.post('http://localhost:3000/api/send-email', emailData);
    
    console.log('Email sent successfully:', response.data);
    console.log('Email functionality is working correctly!');
  } catch (error) {
    console.error('Error sending test email:', error.response?.data || error.message);
    console.error('Email functionality is not working correctly.');
  }
}

// Run the test
testEmail(); 