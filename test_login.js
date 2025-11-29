const fetch = require('node-fetch');

async function testLogin() {
  console.log('Testing login endpoint...');
  
  // Test with valid credentials (you'll need to create a test user first)
  // For now, let's just test if the endpoint exists
  try {
    // Test 1: Check if the endpoint returns the correct error for missing credentials
    const response = await fetch('https://n2034sm6-5000.inc1.devtunnels.ms/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}) // Empty body to test validation
    });
    
    const data = await response.json();
    console.log(`Status: ${response.status}`);
    console.log(`Response:`, data);
    
    if (response.status === 400) {
      console.log('✓ Login endpoint is working correctly (returning 400 for missing credentials)');
    } else {
      console.log('✗ Login endpoint might have an issue');
    }
  } catch (error) {
    console.error('Error testing login endpoint:', error.message);
    console.log('Make sure the backend server is running and accessible');
  }
  
  // Test 2: Check that GET request to login endpoint returns 404 (since it only accepts POST)
  try {
    const response2 = await fetch('https://n2034sm6-5000.inc1.devtunnels.ms/api/auth/login', {
      method: 'GET', // This should return 404 since the route only accepts POST
    });
    
    console.log(`GET request status: ${response2.status} (expected 404 since login only accepts POST)`);
  } catch (error) {
    console.error('Error testing GET request to login:', error.message);
  }
}

testLogin();