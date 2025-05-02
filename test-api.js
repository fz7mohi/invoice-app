const fetch = require('node-fetch');

const testData = {
  companyName: "Test Company",
  email: "test@example.com",
  phone: "+1234567890",
  address: "123 Test St",
  country: "Qatar"
};

async function testEndpoint(url, description) {
  console.log(`\nTesting ${description}...`);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': url.includes('localhost') ? 'http://localhost:8082' : 'https://fortunegiftz.com'
      },
      body: JSON.stringify(testData)
    });

    console.log('Status:', response.status);
    console.log('Headers:', response.headers.raw());
    
    const data = await response.json();
    console.log('Response:', JSON.stringify(data, null, 2));
    
    return response.ok;
  } catch (error) {
    console.error('Error:', error.message);
    return false;
  }
}

async function runTests() {
  const endpoints = [
    {
      url: 'https://fordox.netlify.app/.netlify/functions/create-client',
      description: 'Production Endpoint'
    },
    {
      url: 'http://localhost:8888/.netlify/functions/create-client',
      description: 'Local Development Endpoint'
    }
  ];

  for (const endpoint of endpoints) {
    const success = await testEndpoint(endpoint.url, endpoint.description);
    console.log(`${endpoint.description} test ${success ? 'PASSED' : 'FAILED'}\n`);
  }
}

runTests(); 