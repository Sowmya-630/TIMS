import { apiService } from './api';
import { LoginRequest, RegisterRequest, AuthResponse, User, Subscription } from '../types';

export class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/users/login', credentials);
    
    if (response.token) {
      apiService.setToken(response.token);
    }
    
    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>('/users/register', userData);
    
    if (response.token) {
      apiService.setToken(response.token);
    }
    
    return response;
  }

  async getProfile(): Promise<User> {
    return apiService.get<User>('/users/profile');
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    return apiService.put<User>('/users/profile', updates);
  }

  async updatePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return apiService.put<{ message: string }>('/users/password', {
      currentPassword,
      newPassword
    });
  }

  async getUsers(params?: { page?: number; limit?: number; search?: string }): Promise<{ users: User[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/users?${queryString}` : '/users';
    
    return apiService.get<{ users: User[]; pagination: any }>(endpoint);
  }

  async getUserById(id: string): Promise<User> {
    return apiService.get<User>(`/users/${id}`);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    return apiService.put<User>(`/users/${id}`, updates);
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    return apiService.delete<{ message: string }>(`/users/${id}`);
  }

  async getUserSubscriptions(userId: string): Promise<Subscription[]> {
    return apiService.get<Subscription[]>(`/users/${userId}/subscriptions`);
  }

  logout() {
    apiService.clearToken();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getStoredToken(): string | null {
    return localStorage.getItem('authToken');
  }
}

export const authService = new AuthService();