// Test script to verify subscription data
const API_BASE = 'http://localhost:5000/api';

async function testSubscriptionData() {
  console.log('🧪 Testing Subscription Data Loading...\n');

  try {
    // Test with john.doe@email.com (should have subscriptions)
    console.log('1. Testing with john.doe@email.com...');
    const loginResponse = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john.doe@email.com',
        password: 'password123'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login successful');
      console.log(`   User: ${loginData.user.fullName} (${loginData.user.role})`);

      // Get user subscriptions
      const subsResponse = await fetch(`${API_BASE}/users/${loginData.user.id}/subscriptions`, {
        headers: { 
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (subsResponse.ok) {
        const subscriptions = await subsResponse.json();
        console.log('✅ Subscriptions loaded successfully');
        console.log(`   Found ${subscriptions.length} subscriptions`);
        
        subscriptions.forEach((sub, index) => {
          console.log(`   ${index + 1}. ${sub.plan?.name || 'Unknown'} - ${sub.status} - $${sub.plan?.price || 0}`);
        });
      } else {
        console.log('❌ Failed to load subscriptions');
      }

    } else {
      console.log('❌ Login failed');
    }

    // Test with admin (should have no subscriptions)
    console.log('\n2. Testing with admin@subscription.com...');
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
      console.log('✅ Admin login successful');

      const adminSubsResponse = await fetch(`${API_BASE}/users/${adminData.user.id}/subscriptions`, {
        headers: { 
          'Authorization': `Bearer ${adminData.token}`,
          'Content-Type': 'application/json'
        }
      });

      if (adminSubsResponse.ok) {
        const adminSubscriptions = await adminSubsResponse.json();
        console.log('✅ Admin subscriptions loaded');
        console.log(`   Admin has ${adminSubscriptions.length} subscriptions (expected: 0)`);
      }
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

testSubscriptionData();