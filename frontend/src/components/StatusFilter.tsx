import { OrderStatus } from '../types/order';

const OPTIONS: { value: OrderStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Todos' },
  { value: OrderStatus.PENDING, label: 'Pendentes' },
  { value: OrderStatus.DELIVERED, label: 'Entregues' },
  { value: OrderStatus.CANCELLED, label: 'Cancelados' },
];

interface StatusFilterProps {
  value: OrderStatus | 'ALL';
  onChange: (value: OrderStatus | 'ALL') => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="filter-row" role="group" aria-label="Filtrar por status">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`filter-pill ${value === option.value ? 'is-active' : ''}`}
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
