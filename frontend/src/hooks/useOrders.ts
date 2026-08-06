import { useCallback, useEffect, useState } from 'react';
import {
  ApiError,
  createOrder,
  getOrders,
  updateOrderStatus,
} from '../services/ordersApi';
import type { CreateOrderPayload, Order, OrderStatus } from '../types/order';

function toMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Erro inesperado. Tente novamente.';
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>(
    'ALL',
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getOrders(
        statusFilter === 'ALL' ? undefined : statusFilter,
      );
      setOrders(data);
    } catch (err) {
      setError(toMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  const submitNewOrder = useCallback(
    async (payload: CreateOrderPayload): Promise<boolean> => {
      setIsSubmitting(true);
      setError(null);
      try {
        const created = await createOrder(payload);
        setOrders((current) =>
          statusFilter === 'ALL' || statusFilter === created.status
            ? [created, ...current]
            : current,
        );
        return true;
      } catch (err) {
        setError(toMessage(err));
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [statusFilter],
  );

  const changeStatus = useCallback(
    async (id: string, status: OrderStatus) => {
      setUpdatingOrderId(id);
      setError(null);
      try {
        const updated = await updateOrderStatus(id, status);
        setOrders((current) =>
          current
            .map((order) => (order.id === id ? updated : order))
            .filter(
              (order) =>
                statusFilter === 'ALL' || order.status === statusFilter,
            ),
        );
      } catch (err) {
        setError(toMessage(err));
      } finally {
        setUpdatingOrderId(null);
      }
    },
    [statusFilter],
  );

  return {
    orders,
    statusFilter,
    setStatusFilter,
    isLoading,
    error,
    dismissError: () => setError(null),
    isSubmitting,
    updatingOrderId,
    submitNewOrder,
    changeStatus,
    refetch: fetchOrders,
  };
}
