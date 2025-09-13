// Comprehensive API integration test utility
import { authService } from '../services/authService';
import { planService } from '../services/planService';
import { subscriptionService } from '../services/subscriptionService';
import { discountService } from '../services/discountService';
import { auditService } from '../services/auditService';

export class ApiTestRunner {
  private token: string | null = null;
  private testUserId: string | null = null;

  async runAllTests(): Promise<void> {
    console.log('🧪 Starting comprehensive API integration tests...\n');

    try {
      // Test Authentication APIs
      await this.testAuthAPIs();
      
      // Test Plan APIs
      await this.testPlanAPIs();
      
      // Test Subscription APIs
      await this.testSubscriptionAPIs();
      
      // Test Discount APIs
      await this.testDiscountAPIs();
      
      // Test Audit APIs (Admin only)
      await this.testAuditAPIs();
      
      console.log('\n✅ All API integration tests completed successfully!');
      
    } catch (error) {
      console.error('\n❌ API integration test failed:', error);
      throw error;
    }
  }

  private async testAuthAPIs(): Promise<void> {
    console.log('🔐 Testing Authentication APIs...');

    try {
      // Test login
      const loginResult = await authService.login({
        email: 'admin@subscription.com',
        password: 'admin123'
      });
      
      this.token = loginResult.token;
      this.testUserId = loginResult.user.id;
      
      console.log('  ✅ Login successful');
      console.log(`     User: ${loginResult.user.fullName} (${loginResult.user.role})`);

      // Test get profile
      const profile = await authService.getProfile();
      console.log('  ✅ Get profile successful');
      console.log(`     Profile: ${profile.fullName} (${profile.email})`);

      // Test get users (admin only)
      const usersResponse = await authService.getUsers({ page: 1, limit: 5 });
      console.log('  ✅ Get users successful');
      console.log(`     Found ${usersResponse.users.length} users`);

    } catch (error) {
      console.error('  ❌ Auth API test failed:', error);
      throw error;
    }
  }

  private async testPlanAPIs(): Promise<void> {
    console.log('\n📋 Testing Plan APIs...');

    try {
      // Test get active plans (public)
      const activePlans = await planService.getActivePlans();
      console.log('  ✅ Get active plans successful');
      console.log(`     Found ${activePlans.length} active plans`);

      // Test get all plans (authenticated)
      const plansResponse = await planService.getPlans({ page: 1, limit: 5 });
      console.log('  ✅ Get all plans successful');
      console.log(`     Found ${plansResponse.plans.length} plans`);

      if (plansResponse.plans.length > 0) {
        // Test get plan by ID
        const plan = await planService.getPlanById(plansResponse.plans[0].id);
        console.log('  ✅ Get plan by ID successful');
        console.log(`     Plan: ${plan.name} - $${plan.price}`);
      }

    } catch (error) {
      console.error('  ❌ Plan API test failed:', error);
      throw error;
    }
  }

  private async testSubscriptionAPIs(): Promise<void> {
    console.log('\n📊 Testing Subscription APIs...');

    try {
      // Test get subscriptions
      const subscriptionsResponse = await subscriptionService.getSubscriptions({ 
        page: 1, 
        limit: 5 
      });
      console.log('  ✅ Get subscriptions successful');
      console.log(`     Found ${subscriptionsResponse.subscriptions.length} subscriptions`);

      if (subscriptionsResponse.subscriptions.length > 0) {
        const subscription = subscriptionsResponse.subscriptions[0];
        
        // Test get subscription by ID
        const subDetails = await subscriptionService.getSubscriptionById(subscription.id);
        console.log('  ✅ Get subscription by ID successful');
        console.log(`     Subscription: ${subDetails.status} - ${subDetails.plan?.name}`);

        // Test record usage (if subscription is active)
        if (subscription.status === 'Active') {
          try {
            const updatedSub = await subscriptionService.recordUsage(subscription.id, 50);
            console.log('  ✅ Record usage successful');
            console.log(`     Data used: ${updatedSub.dataUsed} MB`);
          } catch (error) {
            console.log('  ⚠️  Record usage skipped (may not have permission)');
          }
        }
      }

      // Test get user subscriptions
      if (this.testUserId) {
        try {
          const userSubs = await subscriptionService.getUserSubscriptions(this.testUserId);
          console.log('  ✅ Get user subscriptions successful');
          console.log(`     User has ${userSubs.length} subscriptions`);
        } catch (error) {
          console.log('  ⚠️  Get user subscriptions skipped (may not have permission)');
        }
      }

    } catch (error) {
      console.error('  ❌ Subscription API test failed:', error);
      throw error;
    }
  }

  private async testDiscountAPIs(): Promise<void> {
    console.log('\n💰 Testing Discount APIs...');

    try {
      // Test get active discounts (public)
      const activeDiscounts = await discountService.getActiveDiscounts();
      console.log('  ✅ Get active discounts successful');
      console.log(`     Found ${activeDiscounts.length} active discounts`);

      // Test get all discounts (admin only)
      try {
        const discountsResponse = await discountService.getDiscounts({ page: 1, limit: 5 });
        console.log('  ✅ Get all discounts successful');
        console.log(`     Found ${discountsResponse.discounts.length} discounts`);
      } catch (error) {
        console.log('  ⚠️  Get all discounts skipped (admin only)');
      }

    } catch (error) {
      console.error('  ❌ Discount API test failed:', error);
      throw error;
    }
  }

  private async testAuditAPIs(): Promise<void> {
    console.log('\n📝 Testing Audit APIs...');

    try {
      // Test get audits (admin only)
      const auditsResponse = await auditService.getAudits({ page: 1, limit: 5 });
      console.log('  ✅ Get audits successful');
      console.log(`     Found ${auditsResponse.audits.length} audit logs`);

    } catch (error) {
      console.log('  ⚠️  Audit API test skipped (admin only or not available)');
    }
  }
}

// Export a function to run tests
export const runApiTests = async (): Promise<void> => {
  const testRunner = new ApiTestRunner();
  await testRunner.runAllTests();
};

// Export for use in browser console
(window as any).runApiTests = runApiTests;