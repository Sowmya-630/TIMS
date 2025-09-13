// Test Guna's subscription data
const API_BASE = 'http://localhost:5000/api';

async function testGunaSubscription() {
  console.log('🧪 Testing Guna\'s Subscription Data...\n');

  try {
    // Login as Guna
    console.log('1. Logging in as Guna...');
    const loginResponse = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'guna@email.com',
        password: 'password123'
      })
    });

    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Guna login successful');
      console.log(`   User: ${loginData.user.fullName} (${loginData.user.role})`);

      // Get Guna's subscriptions
      console.log('\n2. Getting Guna\'s subscriptions...');
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
          console.log(`   ${index + 1}. Plan: ${sub.plan?.name || 'Unknown'}`);
          console.log(`      Price: $${sub.plan?.price || 0}/month`);
          console.log(`      Status: ${sub.status}`);
          console.log(`      Data Quota: ${sub.plan?.dataQuota || 0}GB`);
          console.log(`      Product Type: ${sub.plan?.productType || 'Unknown'}`);
        });

        if (subscriptions.length > 0 && subscriptions[0].plan?.name === 'Luxury Fibernet') {
          console.log('\n✅ SUCCESS: Guna has Luxury Fibernet plan with correct price!');
        } else {
          console.log('\n❌ ISSUE: Plan details not loaded correctly');
        }
      } else {
        const errorData = await subsResponse.json();
        console.log('❌ Failed to load subscriptions:', errorData.message);
      }

    } else {
      const errorData = await loginResponse.json();
      console.log('❌ Login failed:', errorData.message);
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
    console.log('   Make sure backend server is running and database is seeded');
  }
}

testGunaSubscription();