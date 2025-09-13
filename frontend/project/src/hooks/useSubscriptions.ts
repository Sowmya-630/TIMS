import { useState, useEffect } from 'react';
import { subscriptionService } from '../services/subscriptionService';
import { Subscription, PaginationParams } from '../types';

export const useSubscriptions = (params?: PaginationParams & { userId?: string; status?: string }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await subscriptionService.getSubscriptions(params);
      setSubscriptions(response.subscriptions || response.data || []);
      if (response.pagination) {
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch subscriptions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [params?.page, params?.limit, params?.userId, params?.status]);

  const createSubscription = async (subscriptionData: any) => {
    try {
      await subscriptionService.createSubscription(subscriptionData);
      await fetchSubscriptions(); // Refresh the list
    } catch (err) {
      throw err;
    }
  };

  const cancelSubscription = async (id: string, reason?: string) => {
    try {
      await subscriptionService.cancelSubscription(id, reason);
      await fetchSubscriptions(); // Refresh the list
    } catch (err) {
      throw err;
    }
  };

  const renewSubscription = async (id: string, newEndDate: string) => {
    try {
      await subscriptionService.renewSubscription(id, newEndDate);
      await fetchSubscriptions(); // Refresh the list
    } catch (err) {
      throw err;
    }
  };

  return {
    subscriptions,
    loading,
    error,
    pagination,
    refetch: fetchSubscriptions,
    createSubscription,
    cancelSubscription,
    renewSubscription
  };
};