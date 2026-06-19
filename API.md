# API Documentation

Base URL (local): `http://localhost:8080`  
Base URL (production): `https://expense-tracker-api.onrender.com` (after Render deploy)

## Health

| Method | Path | Description | Response |
|--------|------|-------------|----------|
| GET | `/health` | Service health check | `{ "status": "UP" }` |

## Categories — `/category`

| Method | Path | Body | Response |
|--------|------|------|----------|
| GET | `/category/get/categories` | — | `{ "category": [CategoryDTO] }` |
| POST | `/category/add/category` | `{ "categoryName": "Food" }` | `CategoryDTO` (201) |
| PUT | `/category/update/category/{categoryId}` | `{ "categoryName": "Food" }` | `CategoryDTO` |
| DELETE | `/category/delete/id/{categoryId}` | — | `CategoryDTO` |
| DELETE | `/category/delete/all` | — | `"Categories deleted successfully"` |

**CategoryDTO:** `{ "categoryId": 1, "categoryName": "Food" }`

## Expenses — `/expense`

| Method | Path | Body | Response |
|--------|------|------|----------|
| POST | `/expense/add/expense` | ExpenseDTO | `ExpenseDTO` (201) |
| GET | `/expense/get/expenses` | — | `{ "expense": [ExpenseDTO] }` |
| PUT | `/expense/update/{expenseId}` | ExpenseDTO | `ExpenseDTO` |
| DELETE | `/expense/delete/expenseid/{expenseId}` | — | `ExpenseDTO` |
| DELETE | `/expense/delete/allexpenses` | — | `"Expense deleted successfully"` |
| GET | `/expense/expenses/total` | — | `Double` |
| GET | `/expense/monthwise` | — | `{ "JANUARY": 100.0, ... }` |
| GET | `/expense/{month}` | — | `{ "expense": [ExpenseDTO] }` |
| GET | `/expense/expense/{categoryName}` | — | `{ "expense": [ExpenseDTO] }` |
| GET | `/expense/category-expenses` | — | `{ "expense": [ExpenseDTO] }` |
| GET | `/expense/expense/category` | — | `{ "Food": [ExpenseDTO], ... }` |

**ExpenseDTO:** `{ "expenseId": 1, "description": "Lunch", "amount": 25.50, "categoryId": 1, "categoryName": "Food" }`

## Error responses

| Status | Cause |
|--------|-------|
| 400 | Validation failure, duplicate category, invalid amount/month |
| 404 | Resource not found |
| 500 | Unexpected server error |
