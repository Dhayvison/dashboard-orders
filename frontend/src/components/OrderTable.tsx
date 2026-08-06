import { OrderStatus, type Order } from '../types/order';
import { StatusBadge } from './StatusBadge';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

interface OrderTableProps {
  orders: Order[];
  updatingOrderId: string | null;
  onChangeStatus: (id: string, status: OrderStatus) => void;
}

export function OrderTable({
  orders,
  updatingOrderId,
  onChangeStatus,
}: OrderTableProps) {
  return (
    <div className="card">
      <table className="orders-table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Itens</th>
            <th>Valor total</th>
            <th>Status</th>
            <th aria-hidden="true" />
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => {
            const isUpdating = updatingOrderId === order.id;
            const itemCount = order.items.reduce(
              (sum, item) => sum + item.quantity,
              0,
            );

            return (
              <tr key={order.id}>
                <td className="customer-name">{order.customerName}</td>
                <td className="items-count">{itemCount}</td>
                <td className="total-value">
                  {currencyFormatter.format(order.totalValue)}
                </td>
                <td>
                  <StatusBadge status={order.status} />
                </td>
                <td>
                  {order.status === OrderStatus.PENDING && (
                    <div className="row-actions">
                      <button
                        type="button"
                        className="btn btn--success btn--sm"
                        disabled={isUpdating}
                        onClick={() =>
                          onChangeStatus(order.id, OrderStatus.DELIVERED)
                        }
                      >
                        {isUpdating ? 'Atualizando…' : 'Marcar como entregue'}
                      </button>
                      <button
                        type="button"
                        className="btn btn--danger btn--sm"
                        disabled={isUpdating}
                        onClick={() =>
                          onChangeStatus(order.id, OrderStatus.CANCELLED)
                        }
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
