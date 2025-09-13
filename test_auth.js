// Simple test script to verify auth APIs
const API_BASE = 'http://localhost:5000/api';

async function testAuth() {
  console.log('🧪 Testing Authentication APIs...\n');

  try {
    // Test 1: Login with admin credentials
    console.log('1. Testing admin login...');
    const loginResponse = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@example.com',
        password: 'admin123'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Admin login successful');
      console.log(`   User: ${loginData.user.fullName} (${loginData.user.role})`);
      console.log(`   Token: ${loginData.token.substring(0, 20)}...`);

      // Test 2: Get profile with token
      console.log('\n2. Testing profile retrieval...');
      const profileResponse = await fetch(`${API_BASE}/users/profile`, {
        headers: { 
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        console.log('✅ Profile retrieval successful');
        console.log(`   Profile: ${profileData.fullName} (${profileData.email})`);
      } else {
        console.log('❌ Profile retrieval failed');
      }

    } else {
      const errorData = await loginResponse.json();
      console.log('❌ Admin login failed:', errorData.message);
    }

    // Test 3: Register new user
    console.log('\n3. Testing user registration...');
    const registerResponse = await fetch(`${API_BASE}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: 'test123',
        role: 'EndUser'
      })
    });

    if (registerResponse.ok) {
      const registerData = await registerResponse.json();
      console.log('✅ User registration successful');
      console.log(`   User: ${registerData.user.fullName} (${registerData.user.role})`);
    } else {
      const errorData = await registerResponse.json();
      console.log('❌ User registration failed:', errorData.message);
    }

  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
    console.log('   Make sure the backend server is running on port 5000');
  }
}

testAuth();