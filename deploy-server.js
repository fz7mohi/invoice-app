const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Preparing server for deployment...');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ Error: .env file not found!');
  console.log('Please create a .env file with the following variables:');
  console.log('BREVO_API_KEY=your_brevo_api_key');
  console.log('ALLOWED_ORIGIN=https://fordox.netlify.app');
  process.exit(1);
}

// Check if BREVO_API_KEY is set
const envContent = fs.readFileSync(envPath, 'utf8');
if (!envContent.includes('BREVO_API_KEY=')) {
  console.error('❌ Error: BREVO_API_KEY not found in .env file!');
  console.log('Please add BREVO_API_KEY=your_brevo_api_key to your .env file');
  process.exit(1);
}

// Check if ALLOWED_ORIGIN is set
if (!envContent.includes('ALLOWED_ORIGIN=')) {
  console.warn('⚠️ Warning: ALLOWED_ORIGIN not found in .env file!');
  console.log('Adding ALLOWED_ORIGIN=https://fordox.netlify.app to .env file...');
  fs.appendFileSync(envPath, '\nALLOWED_ORIGIN=https://fordox.netlify.app');
}

console.log('✅ Environment variables checked');

// Create a Procfile for Heroku
const procfileContent = 'web: node server.js';
fs.writeFileSync(path.join(__dirname, 'Procfile'), procfileContent);
console.log('✅ Created Procfile for Heroku');

// Create a package.json for the server if it doesn't exist
const serverPackageJson = {
  name: 'invoice-app-server',
  version: '1.0.0',
  description: 'Server for Invoice App',
  main: 'server.js',
  scripts: {
    start: 'node server.js'
  },
  dependencies: {
    axios: '^1.8.4',
    cors: '^2.8.5',
    dotenv: '^16.4.7',
    express: '^4.21.2'
  },
  engines: {
    node: '>=14.0.0'
  }
};

fs.writeFileSync(
  path.join(__dirname, 'server-package.json'),
  JSON.stringify(serverPackageJson, null, 2)
);
console.log('✅ Created server-package.json');

console.log('\n📋 Deployment Instructions:');
console.log('1. Create an account on Heroku (https://heroku.com) or Render (https://render.com)');
console.log('2. Create a new web service');
console.log('3. Connect your GitHub repository');
console.log('4. Set the following environment variables:');
console.log('   - BREVO_API_KEY: Your Brevo API key');
console.log('   - ALLOWED_ORIGIN: https://fordox.netlify.app');
console.log('5. Deploy the service');
console.log('\nAfter deployment, update the API_URL in src/services/emailService.js with your server URL'); 