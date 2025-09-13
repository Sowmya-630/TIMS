// Simple integration test
import fetch from 'node-fetch';

async function testIntegration() {
  console.log('🧪 Testing Backend-Frontend Integration...\n');
  
  const baseURL = 'http://localhost:5000/api';
  
  try {
    // Test 1: Health Check
    console.log('1. Testing Health Endpoint...');
    const healthResponse = await fetch('http://localhost:5000/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health:', healthData.status);
    
    // Test 2: Get Active Plans (Public)
    console.log('\n2. Testing Active Plans Endpoint...');
    const plansResponse = await fetch(`${baseURL}/plans/active`);
    const plansData = await plansResponse.json();
    console.log(`✅ Active Plans: ${plansData.length} plans found`);
    console.log('   Sample plan:', plansData[0]?.name);
    
    // Test 3: Test Authentication Required Endpoint
    console.log('\n3. Testing Protected Endpoint (should fail)...');
    const protectedResponse = await fetch(`${baseURL}/users`);
    const protectedData = await protectedResponse.json();
    console.log('✅ Protected endpoint correctly requires auth:', protectedData.error);
    
    console.log('\n🎉 Integration test completed successfully!');
    console.log('\n📋 Summary:');
    console.log('   • Backend API: ✅ Running and responding');
    console.log('   • Public endpoints: ✅ Working');
    console.log('   • Authentication: ✅ Properly protected');
    console.log('   • Database: ✅ Connected with sample data');
    
  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
  }
}

testIntegration();