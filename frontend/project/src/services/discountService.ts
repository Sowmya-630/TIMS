import { apiService } from './api';
import { Discount, CreateDiscountRequest, PaginatedResponse, PaginationParams } from '../types';

export class DiscountService {
  async getActiveDiscounts(): Promise<Discount[]> {
    return apiService.get<Discount[]>('/discounts/active');
  }

  async getDiscounts(params?: PaginationParams & { isActive?: boolean; planId?: string }): Promise<{ discounts: Discount[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());
    if (params?.planId) queryParams.append('planId', params.planId);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/discounts?${queryString}` : '/discounts';
    
    return apiService.get<{ discounts: Discount[]; pagination: any }>(endpoint);
  }

  async createDiscount(discountData: CreateDiscountRequest): Promise<Discount> {
    return apiService.post<Discount>('/discounts', discountData);
  }
}

export const discountService = new DiscountService();