# Deployment Instructions

## Fixing CORS Issues with Email Service

The application is experiencing CORS issues when trying to send emails from the Netlify deployment to the local development server. This document provides instructions on how to deploy the server to a hosting service and update the application to use the deployed server.

## Option 1: Deploy the Server to a Hosting Service

### Step 1: Prepare for Deployment

Run the following command to prepare the server for deployment:

```bash
npm run prepare-deploy
```

This will:
- Check if the required environment variables are set
- Create a Procfile for Heroku
- Create a server-package.json file

### Step 2: Deploy to Heroku or Render

1. Create an account on [Heroku](https://heroku.com) or [Render](https://render.com)
2. Create a new web service
3. Connect your GitHub repository
4. Set the following environment variables:
   - `BREVO_API_KEY`: Your Brevo API key
   - `ALLOWED_ORIGIN`: https://fordox.netlify.app
5. Deploy the service

### Step 3: Update the API URL

After deploying the server, update the `API_URL` in `src/services/emailService.js` with your server URL:

```javascript
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-deployed-server-url.com/api/send-email'  // Update this URL
  : 'http://localhost:3000/api/send-email';
```

### Step 4: Rebuild and Redeploy the Frontend

1. Rebuild the frontend:
   ```bash
   npm run build
   ```

2. Redeploy to Netlify

## Option 2: Use Netlify Functions (Serverless)

If you prefer not to deploy a separate server, you can use Netlify Functions to handle the email sending:

1. Create a `netlify/functions` directory in your project
2. Create a `send-email.js` file in that directory with the following content:

```javascript
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
```

3. Update the `API_URL` in `src/services/emailService.js`:

```javascript
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/.netlify/functions/send-email'  // Use Netlify Functions in production
  : 'http://localhost:3000/api/send-email';  // Use local server in development
```

4. Add the following to your `netlify.toml` file:

```toml
[build]
  functions = "netlify/functions"

[functions]
  node_bundler = "esbuild"
```

5. Set the `BREVO_API_KEY` environment variable in your Netlify dashboard

6. Redeploy to Netlify

## Troubleshooting

If you're still experiencing CORS issues after implementing one of the solutions above, check the following:

1. Make sure the `ALLOWED_ORIGIN` environment variable is set correctly
2. Check the browser console for any errors
3. Verify that the API endpoint is accessible from your Netlify deployment
4. Ensure that the Brevo API key is valid and has the necessary permissions 