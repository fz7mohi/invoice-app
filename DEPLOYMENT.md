# Backend Deployment Guide

## Option 1: Deploy to Heroku

1. Create a Heroku account at https://signup.heroku.com/
2. Install the Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
3. Login to Heroku: `heroku login`
4. Create a new Heroku app: `heroku create your-app-name`
5. Add your environment variables: `heroku config:set BREVO_API_KEY=your_api_key`
6. Deploy your app: `git push heroku main`

## Option 2: Deploy to Render

1. Create a Render account at https://render.com/
2. Create a new Web Service
3. Connect your GitHub repository
4. Set the build command: `npm install`
5. Set the start command: `node server.js`
6. Add your environment variables in the Render dashboard
7. Deploy your app

## Option 3: Deploy to Railway

1. Create a Railway account at https://railway.app/
2. Create a new project
3. Connect your GitHub repository
4. Add your environment variables in the Railway dashboard
5. Deploy your app

## After Deployment

1. Update the `API_URL` in `src/services/emailService.js` with your deployed backend URL
2. Rebuild and redeploy your frontend to Netlify

## Testing

After deployment, test the email functionality to ensure it works correctly. 