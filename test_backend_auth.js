// Test script to verify backend authentication with correct credentials
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

async function testBackendAuth() {
  console.log('🧪 Testing Backend Authentication with Seeded Credentials...\n');

  try {
    // Test admin login with seeded credentials
    console.log('1. Testing admin login with: admin@subscription.com / admin123');
    const adminLoginResponse = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@subscription.com',
        password: 'admin123'
      })
    });

    if (adminLoginResponse.ok) {
      const adminData = await adminLoginResponse.json();
      console.log('✅ Admin login successful!');
      console.log(`   User: ${adminData.user.fullName} (${adminData.user.role})`);
      console.log(`   Email: ${adminData.user.email}`);
      console.log(`   Token: ${adminData.token.substring(0, 30)}...`);
    } else {
      const errorData = await adminLoginResponse.json().catch(() => ({}));
      console.log('❌ Admin login failed:', errorData.message || 'Unknown error');
    }

    // Test end user login
    console.log('\n2. Testing end user login with: john.doe@email.com / password123');
    const userLoginResponse = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john.doe@email.com',
        password: 'password123'
      })
    });

    if (userLoginResponse.ok) {
      const userData = await userLoginResponse.json();
      console.log('✅ End user login successful!');
      console.log(`   User: ${userData.user.fullName} (${userData.user.role})`);
      console.log(`   Email: ${userData.user.email}`);
    } else {
      const errorData = await userLoginResponse.json().catch(() => ({}));
      console.log('❌ End user login failed:', errorData.message || 'Unknown error');
    }

  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
    console.log('   Make sure:');
    console.log('   1. Backend server is running: npm start');
    console.log('   2. Database is seeded: npm run seed');
  }
}

testBackendAuth();