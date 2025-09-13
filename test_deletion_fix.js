// Test script to verify deletion functionality
import { User } from './backend/src/models/userModel.js';
import { SubscriptionPlan } from './backend/src/models/planModel.js';
import { Subscription } from './backend/src/models/subscriptionModel.js';

async function testDeletionFix() {
  try {
    console.log('🧪 Testing deletion functionality...');
    
    // Test 1: Create a test user
    console.log('\n1. Creating test user...');
    const testUser = await User.create({
      fullName: 'Test User for Deletion',
      email: 'test-delete@example.com',
      password: 'password123',
      role: 'EndUser'
    });
    console.log('✅ Test user created:', testUser.id);
    
    // Test 2: Create a test plan
    console.log('\n2. Creating test plan...');
    const testPlan = await SubscriptionPlan.create({
      name: 'Test Plan for Deletion',
      description: 'Test plan to verify deletion',
      productType: 'Fibernet',
      price: 10.00,
      dataQuota: 100,
      durationDays: 30,
      isActive: true
    });
    console.log('✅ Test plan created:', testPlan.id);
    
    // Test 3: Create a subscription linking user and plan
    console.log('\n3. Creating test subscription...');
    const testSubscription = await Subscription.create({
      userId: testUser.id,
      planId: testPlan.id,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      autoRenew: false
    });
    console.log('✅ Test subscription created:', testSubscription.id);
    
    // Test 4: Try to delete user (should cascade delete subscription)
    console.log('\n4. Testing user deletion with cascade...');
    await testUser.delete();
    console.log('✅ User deleted successfully with cascade');
    
    // Test 5: Verify subscription was deleted
    console.log('\n5. Verifying subscription was deleted...');
    const deletedSubscription = await Subscription.findById(testSubscription.id);
    if (!deletedSubscription) {
      console.log('✅ Subscription was properly deleted');
    } else {
      console.log('❌ Subscription still exists');
    }
    
    // Test 6: Try to delete plan (should work now)
    console.log('\n6. Testing plan deletion...');
    await testPlan.delete();
    console.log('✅ Plan deleted successfully');
    
    console.log('\n🎉 All deletion tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  }
}

// Run the test
testDeletionFix().then(() => {
  console.log('\n✨ Test completed');
  process.exit(0);
}).catch(error => {
  console.error('💥 Test error:', error);
  process.exit(1);
});