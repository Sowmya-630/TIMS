// Type definitions matching backend models

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'Admin' | 'EndUser';
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  productType: 'Fibernet' | 'Broadband Copper';
  price: number;
  dataQuota: number; // in GB
  durationDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'Active' | 'Cancelled' | 'Expired';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  dataUsed: number; // in MB
  discountId?: string;
  createdAt: string;
  updatedAt: string;
  // Extended properties from backend
  plan?: SubscriptionPlan;
  user?: User;
  discount?: Discount;
}

export interface Discount {
  id: string;
  name: string;
  description: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  planId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
}

// API Request/Response types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role?: 'Admin' | 'EndUser';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CreateSubscriptionRequest {
  userId?: string;
  planId: string;
  startDate: string;
  endDate: string;
  autoRenew?: boolean;
  discountId?: string;
}

export interface UpdateSubscriptionRequest {
  status?: 'Active' | 'Cancelled' | 'Expired';
  endDate?: string;
  autoRenew?: boolean;
  dataUsed?: number;
  discountId?: string;
}

export interface CreatePlanRequest {
  name: string;
  description: string;
  productType: 'Fibernet' | 'Broadband Copper';
  price: number;
  dataQuota: number;
  durationDays: number;
  isActive?: boolean;
}

export interface CreateDiscountRequest {
  name: string;
  description: string;
  discountPercent: number;
  startDate: string;
  endDate: string;
  planId?: string;
  isActive?: boolean;
}

// Pagination
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}