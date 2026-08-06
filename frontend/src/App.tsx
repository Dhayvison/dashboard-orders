import { useState } from 'react';
import { ErrorBanner } from './components/ErrorBanner';
import { NewOrderModal } from './components/NewOrderModal';
import { OrderTable } from './components/OrderTable';
import { StatusFilter } from './components/StatusFilter';
import { useOrders } from './hooks/useOrders';

export default function App() {
  const {
    orders,
    statusFilter,
    setStatusFilter,
    isLoading,
    error,
    dismissError,
    isSubmitting,
    updatingOrderId,
    submitNewOrder,
    changeStatus,
  } = useOrders();

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="shell">
      <header className="masthead">
        <div>
          <span className="masthead__eyebrow">OPERAÇÕES · VENDAS</span>
          <h1 className="masthead__title">Pedidos</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span className="masthead__count">
            {orders.length} {orders.length === 1 ? 'pedido' : 'pedidos'}
          </span>
          <button
            type="button"
            className="btn btn--primary"
            onClick={() => setIsModalOpen(true)}
          >
            + Novo pedido
          </button>
        </div>
      </header>

      {error && <ErrorBanner message={error} onDismiss={dismissError} />}

      <StatusFilter value={statusFilter} onChange={setStatusFilter} />

      {isLoading ? (
        <div className="card state-panel">
          <p className="state-panel__title">Carregando pedidos…</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="card state-panel">
          <p className="state-panel__title">Nenhum pedido encontrado</p>
          <p>Crie um novo pedido ou troque o filtro de status.</p>
        </div>
      ) : (
        <OrderTable
          orders={orders}
          updatingOrderId={updatingOrderId}
          onChangeStatus={changeStatus}
        />
      )}

      {isModalOpen && (
        <NewOrderModal
          isSubmitting={isSubmitting}
          onCancel={() => setIsModalOpen(false)}
          onSubmit={submitNewOrder}
        />
      )}
    </div>
  );
}
