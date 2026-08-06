import { useState, type FormEvent } from 'react';
import type { CreateOrderPayload } from '../types/order';

interface ItemRow {
  key: string;
  productName: string;
  quantity: string;
  price: string;
}

function emptyRow(): ItemRow {
  return { key: crypto.randomUUID(), productName: '', quantity: '1', price: '' };
}

interface NewOrderModalProps {
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (payload: CreateOrderPayload) => Promise<boolean>;
}

export function NewOrderModal({
  isSubmitting,
  onCancel,
  onSubmit,
}: NewOrderModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [items, setItems] = useState<ItemRow[]>([emptyRow()]);
  const [formError, setFormError] = useState<string | null>(null);

  function updateItem(key: string, patch: Partial<ItemRow>) {
    setItems((current) =>
      current.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  }

  function addItem() {
    setItems((current) => [...current, emptyRow()]);
  }

  function removeItem(key: string) {
    setItems((current) => current.filter((row) => row.key !== key));
  }

  function validate(): CreateOrderPayload | null {
    if (!customerName.trim()) {
      setFormError('Informe o nome do cliente.');
      return null;
    }

    const parsedItems = [];
    for (const row of items) {
      const quantity = Number(row.quantity);
      const price = Number(row.price);

      if (!row.productName.trim()) {
        setFormError('Todo item precisa de um nome de produto.');
        return null;
      }
      if (!Number.isFinite(quantity) || quantity <= 0) {
        setFormError('Quantidade deve ser maior que zero.');
        return null;
      }
      if (!Number.isFinite(price) || price <= 0) {
        setFormError('Preço deve ser maior que zero.');
        return null;
      }

      parsedItems.push({
        productName: row.productName.trim(),
        quantity,
        price,
      });
    }

    if (parsedItems.length === 0) {
      setFormError('Adicione pelo menos um item.');
      return null;
    }

    return { customerName: customerName.trim(), items: parsedItems };
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);

    const payload = validate();
    if (!payload) return;

    const success = await onSubmit(payload);
    if (success) onCancel();
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-order-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal__header">
          <h2 className="modal__title" id="new-order-title">
            Novo pedido
          </h2>
          <button
            type="button"
            className="modal__close"
            onClick={onCancel}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="customerName">Nome do cliente</label>
            <input
              id="customerName"
              value={customerName}
              onChange={(event) => setCustomerName(event.target.value)}
              placeholder="Maria Silva"
              autoFocus
            />
          </div>

          <div className="field">
            <label>Itens</label>
            {items.map((row) => (
              <div className="item-row" key={row.key}>
                <input
                  aria-label="Nome do produto"
                  placeholder="Produto"
                  value={row.productName}
                  onChange={(event) =>
                    updateItem(row.key, { productName: event.target.value })
                  }
                />
                <input
                  aria-label="Quantidade"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Qtd"
                  value={row.quantity}
                  onChange={(event) =>
                    updateItem(row.key, { quantity: event.target.value })
                  }
                />
                <input
                  aria-label="Preço unitário"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Preço"
                  value={row.price}
                  onChange={(event) =>
                    updateItem(row.key, { price: event.target.value })
                  }
                />
                <button
                  type="button"
                  className="item-row__remove"
                  onClick={() => removeItem(row.key)}
                  disabled={items.length === 1}
                  aria-label="Remover item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <button type="button" className="add-item-btn" onClick={addItem}>
            + adicionar item
          </button>

          {formError && <p className="field-hint">{formError}</p>}

          <div className="modal__footer">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando…' : 'Criar pedido'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
