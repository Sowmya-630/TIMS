import { apiService } from './api';
import { 
  Subscription, 
  CreateSubscriptionRequest, 
  UpdateSubscriptionRequest, 
  PaginatedResponse, 
  PaginationParams 
} from '../types';

export class SubscriptionService {
  async getSubscriptions(params?: PaginationParams & { userId?: string; status?: string }): Promise<{ subscriptions: Subscription[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.status) queryParams.append('status', params.status);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/subscriptions?${queryString}` : '/subscriptions';
    
    return apiService.get<{ subscriptions: Subscription[]; pagination: any }>(endpoint);
  }

  async getSubscriptionById(id: string): Promise<Subscription> {
    return apiService.get<Subscription>(`/subscriptions/${id}`);
  }

  async createSubscription(subscriptionData: CreateSubscriptionRequest): Promise<Subscription> {
    return apiService.post<Subscription>('/subscriptions', subscriptionData);
  }

  async updateSubscription(id: string, updates: UpdateSubscriptionRequest): Promise<Subscription> {
    return apiService.put<Subscription>(`/subscriptions/${id}`, updates);
  }

  async cancelSubscription(id: string, reason?: string): Promise<Subscription> {
    return apiService.post<Subscription>(`/subscriptions/${id}/cancel`, { reason });
  }

  async renewSubscription(id: string, newEndDate: string): Promise<Subscription> {
    return apiService.post<Subscription>(`/subscriptions/${id}/renew`, { newEndDate });
  }

  async recordUsage(id: string, dataAmount: number): Promise<Subscription> {
    return apiService.post<Subscription>(`/subscriptions/${id}/usage`, { dataAmount });
  }

  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    return apiService.get<Subscription[]>(`/users/${userId}/subscriptions`);
  }
}

export const subscriptionService = new SubscriptionService();