// Test the profile endpoint fix
const API_BASE = 'http://localhost:5000/api';

async function testProfileEndpoint() {
  console.log('🧪 Testing Profile Endpoint Fix...\n');

  try {
    // First login to get a token
    console.log('1. Logging in to get token...');
    const loginResponse = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@subscription.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error('Login failed');
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful');
    console.log(`   User: ${loginData.user.fullName}`);

    // Test the profile endpoint
    console.log('\n2. Testing profile endpoint...');
    const profileResponse = await fetch(`${API_BASE}/users/profile`, {
      headers: { 
        'Authorization': `Bearer ${loginData.token}`,
        'Content-Type': 'application/json'
      }
    });

    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      console.log('✅ Profile endpoint working!');
      console.log(`   Profile: ${profileData.fullName} (${profileData.email})`);
      console.log(`   Role: ${profileData.role}`);
    } else {
      const errorData = await profileResponse.json();
      console.log('❌ Profile endpoint failed:', errorData.message);
      console.log(`   Status: ${profileResponse.status}`);
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testProfileEndpoint();