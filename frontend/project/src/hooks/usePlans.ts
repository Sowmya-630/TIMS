import { useState, useEffect } from 'react';
import { planService } from '../services/planService';
import { SubscriptionPlan, PaginationParams } from '../types';

export const usePlans = (params?: PaginationParams) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await planService.getPlans(params);
      setPlans(response.plans || response.data || []);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [params?.page, params?.limit, params?.search]);

  return {
    plans,
    loading,
    error,
    pagination,
    refetch: fetchPlans
  };
};

export const useActivePlans = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivePlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const activePlans = await planService.getActivePlans();
      setPlans(activePlans);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch active plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivePlans();
  }, []);

  return {
    plans,
    loading,
    error,
    refetch: fetchActivePlans
  };
};