import { apiService } from './api';
import { SubscriptionPlan, CreatePlanRequest, PaginatedResponse, PaginationParams } from '../types';

export class PlanService {
  async getActivePlans(): Promise<SubscriptionPlan[]> {
    return apiService.get<SubscriptionPlan[]>('/plans/active');
  }

  async getPlans(params?: PaginationParams & { productType?: string; isActive?: boolean }): Promise<{ plans: SubscriptionPlan[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.productType) queryParams.append('productType', params.productType);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/plans?${queryString}` : '/plans';
    
    return apiService.get<{ plans: SubscriptionPlan[]; pagination: any }>(endpoint);
  }

  async getPlanById(id: string): Promise<SubscriptionPlan> {
    return apiService.get<SubscriptionPlan>(`/plans/${id}`);
  }

  async createPlan(planData: CreatePlanRequest): Promise<SubscriptionPlan> {
    return apiService.post<SubscriptionPlan>('/plans', planData);
  }

  async updatePlan(id: string, updates: Partial<CreatePlanRequest>): Promise<SubscriptionPlan> {
    return apiService.put<SubscriptionPlan>(`/plans/${id}`, updates);
  }

  async deletePlan(id: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/plans/${id}`);
  }
}

export const planService = new PlanService();