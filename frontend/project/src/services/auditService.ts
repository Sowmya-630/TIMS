import { apiService } from './api';
import { AuditLog, PaginatedResponse, PaginationParams } from '../types';

export interface CreateAuditRequest {
  userId?: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
}

export interface AuditFilters extends PaginationParams {
  userId?: string;
  action?: string;
  entityType?: string;
}

export class AuditService {
  async getAudits(params?: AuditFilters): Promise<{ audits: AuditLog[]; pagination: any }> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.userId) queryParams.append('userId', params.userId);
    if (params?.action) queryParams.append('action', params.action);
    if (params?.entityType) queryParams.append('entityType', params.entityType);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/audits?${queryString}` : '/audits';
    
    return apiService.get<{ audits: AuditLog[]; pagination: any }>(endpoint);
  }

  async createAudit(auditData: CreateAuditRequest): Promise<AuditLog> {
    return apiService.post<AuditLog>('/audits', auditData);
  }
}

export const auditService = new AuditService();