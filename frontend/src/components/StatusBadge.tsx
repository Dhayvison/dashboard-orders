import type { OrderStatus } from '../types/order';

const LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pendente',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
};

const MODIFIER: Record<OrderStatus, string> = {
  PENDING: 'status-badge--pending',
  DELIVERED: 'status-badge--delivered',
  CANCELLED: 'status-badge--cancelled',
};

interface StatusBadgeProps {
  status: OrderStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`status-badge ${MODIFIER[status]}`}>
      <span className="status-badge__dot" aria-hidden="true" />
      {LABELS[status]}
    </span>
  );
}
