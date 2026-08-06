# Dashboard de Gestão de Pedidos

Desafio técnico full stack: API REST (NestJS + TypeScript + SQLite) e dashboard (React + TypeScript + Vite) para listar, criar e atualizar o status de pedidos.

## Stack

- **Backend:** NestJS, TypeScript, TypeORM, SQLite (`better-sqlite3`), `class-validator`
- **Frontend:** React, TypeScript, Vite

## Estrutura

```
backend/    API REST (controllers/services/módulos/entidades/DTOs)
frontend/   Dashboard React (componentes/hooks/services/types)
```

## Pré-requisitos

- Node.js 18+
- npm

## Como rodar

### 1. Backend

```bash
cd backend
npm install
npm run start:dev
```

API sobe em `http://localhost:3000`. Banco SQLite (`database.sqlite`) é criado automaticamente na primeira execução, na pasta `backend/`.

### 2. Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

App sobe em `http://localhost:5173`. A URL da API é lida de `frontend/.env` (`VITE_API_URL`, já configurada para `http://localhost:3000/api`).

## Endpoints da API

| Método | Rota                        | Descrição                                                    |
| ------ | --------------------------- | -------------------------------------------------------------- |
| GET    | `/api/orders`               | Lista pedidos. Filtro opcional: `?status=PENDING\|DELIVERED\|CANCELLED` |
| POST   | `/api/orders`                | Cria pedido. `totalValue` e `status` (inicial `PENDING`) são calculados no backend |
| PATCH  | `/api/orders/:id/status`     | Atualiza o status de um pedido                                  |

### Exemplo de payload do POST

```json
{
  "customerName": "Maria Silva",
  "items": [
    { "productName": "Teclado Mecânico", "quantity": 1, "price": 250.00 }
  ]
}
```

## Funcionalidades do dashboard

- Listagem de pedidos em tabela (cliente, quantidade de itens, valor total, status)
- Filtro por status
- Criação de pedido via modal, com múltiplos itens
- Ação de "Marcar como entregue" / "Cancelar" para pedidos pendentes
- Estados de loading e erro tratados na UI

## Decisões técnicas

- **SQLite via TypeORM (`better-sqlite3`)**: persistência real sem exigir um servidor de banco externo — roda local com `npm install` e nada mais.
- **Sem `any`**: DTOs e entidades tipados nas duas pontas; o frontend replica os tipos do backend em `frontend/src/types/order.ts`.
- **Separação de camadas**:
  - Backend: `controller` (HTTP) → `service` (regra de negócio) → `repository` (TypeORM)
  - Frontend: `components` (UI) → `hooks/useOrders` (estado) → `services/ordersApi` (HTTP)
