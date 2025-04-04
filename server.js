const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Email sending endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const { to, subject, htmlContent, pdfBase64, pdfFileName } = req.body;
    
    // Validate required fields
    if (!to || !subject || !htmlContent) {
      return res.status(400).json({ error: 'Missing required fields' });
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

    res.json(response.data);
  } catch (error) {
    console.error('Error sending email:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Failed to send email'
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
  app.get('*', (req, res) => {
    res.sendFile('index.html', { root: 'dist' });
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 