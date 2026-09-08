# Expense Tracker

**Premium Personal Finance & Portfolio Management Platform**
Spring Boot REST API × React 19 + Vite

`Live Demo` `Java` `Spring Boot` `React` `Vite` `PostgreSQL` `TailwindCSS` `Recharts`

🌐 **Live Application:** https://personal-expense-tracker-liart-five.vercel.app

🎥 Demo Video • 🌐 Live Site • 📸 Screenshots • 📘 API Endpoints

---

## 📌 Overview

A premium Personal Finance and Expense Tracker application designed to help users track and organize their portfolios efficiently. The stack comprises a robust, multi-user Spring Boot REST API backend paired with a modern, fully-responsive React + Vite frontend interface.

### The Problem
- **Data Cross-Contamination:** Many basic expense tracking applications mix data across user accounts or rely only on temporary client-side state.
- **Static Insights:** Lack of dynamic month-over-month trend visualization and category distributions.
- **Fragmented Scope:** Standard tools track expenses but ignore debts (money owed to me vs. owed to others), recurring utility bills, and brand subscriptions.

### The Solution
- **Multi-Tenant User Isolation:** Every REST API call is verified against an `X-User-Id` request context header.
- **5-Layer Tracking System:** Unifies Expenses, Savings, Debts, Scheduled Utility Bills, and Brand Subscriptions under one interface.
- **Rupee (Rs) Localization:** Full currency localization with responsive Recharts visual graphs.

---

## ✨ Key Features

### Multi-User Security & Auth
- Instant user registration, sign-in, and sign-out capabilities.
- Secure profile modifications (username changes and password resets).
- Robust backend resource filtering: all options, categories, expenses, savings, and debts are isolated to each user.

### Premium Interactive Dashboard
- Unified summary cards tracking Total Spent, This Month's Spending, Active Categories, Total Savings, and Current Month's Savings.
- Dynamic monthly trend bar charts and category allocation donut charts rendered via Recharts.
- Direct display of recent expenses for fast tracking.

### Core Tracking Layers
- **Expenses:** CRUD individual entries with name, value, date, and custom category mappings.
- **Savings:** Dedicated savings logs detailing descriptions, dates, and amounts (no income tab required).
- **Debts:** Manage money given or borrowed using the dedicated Debt tracker separated by status (Owed to Me vs Owed to Others).

### Advanced Bills & Subscriptions Planning
- **Scheduled Bills:** Stay on top of utilities (Water, Electricity, Wireless Wifi, Mobile, etc.) with custom options and payment toggles.
- **Subscriptions Tracker:** Track recurring streaming and utility packages (Netflix, Spotify, YouTube Premium, LinkedIn, Amazon Prime) showing billing cycle, cost, payment due date, and automatically displaying brand icons.

### Rupee (Rs) Support
- The UI is fully localized to display amounts in Rupees (Rs).

---

## ⚡ Key Challenges & Engineering Outcomes

| Technical Challenge | Engineering Solution & Outcome |
|---|---|
| 🔐 Multi-Tenant Data Leaks | Implemented request header context validation (`X-User-Id`) across all Spring Boot REST controllers, enforcing 100% resource isolation per user session. |
| 🔗 Foreign Key Violations on Delete | Engineered audit-safe soft-disassociation unlinking in JPA service layers, preventing deletion of categories or options from breaking historical records. |
| 📊 Complex Multi-Category Financial Logs | Structured dedicated JPA domain models for Expenses, Savings, Debts (Owed to Me vs Owed to Others), Scheduled Utility Bills, and Brand Subscriptions. |
| ⚡ Real-Time Data Aggregation | Designed optimized JPA aggregation queries for monthly trend calculations and category allocations, rendered seamlessly with dynamic Recharts graphs. |

---

## 🏗️ System Architecture

The application follows a classic layered (n-tier) architecture on the backend, cleanly separated from a component-driven frontend, with all communication happening over a stateless REST API.

```
┌─────────────────────────────────────────────────────────────┐
│                     React 19 + Vite Frontend                 │
│  Pages (Dashboard, Expenses, Savings, Debts, Scheduled...)   │
│  Components (cards, charts, forms, modals, tables)            │
│  Axios API Clients ── attaches X-User-Id header per request  │
└───────────────────────────┬────────────────────────────────┘
                             │ HTTPS / JSON (REST)
┌───────────────────────────▼────────────────────────────────┐
│                    Spring Boot REST API                      │
│                                                               │
│  Controller Layer                                            │
│    • Exposes REST endpoints                                  │
│    • Validates X-User-Id header on every request              │
│    • Delegates to Service layer, maps exceptions to HTTP codes│
│                          │                                    │
│  Service Layer                                                │
│    • Business logic & validation                              │
│    • Transactional boundaries (@Transactional)                │
│    • Aggregation logic (monthly totals, category breakdowns)  │
│                          │                                    │
│  DTO / Mapper Layer                                            │
│    • ModelMapper decouples JPA entities from JSON payloads     │
│                          │                                    │
│  Repository Layer                                              │
│    • Spring Data JPA repositories                              │
│    • Query derivation & custom JPQL for aggregation             │
└───────────────────────────┬────────────────────────────────┘
                             │ JDBC
┌───────────────────────────▼────────────────────────────────┐
│                      PostgreSQL Database                      │
│  Users • Categories • Expenses • Savings • Debts               │
│  Scheduled Bills • Scheduled Options • Subscriptions           │
└─────────────────────────────────────────────────────────────┘
```

**Layer responsibilities:**
- **Controller Layer** → validates request headers (`X-User-Id`), processes HTTP payloads, returns standardized responses.
- **Service Layer** → handles business calculations and transactional boundaries (`@Transactional`).
- **Repository Layer** → Spring Data JPA repository abstractions over PostgreSQL.
- **DTO Layer** → ModelMapper decouples JPA database entities from JSON client payloads.

---

## 🔄 Control Flow

A typical write request (e.g. adding an expense) flows through the system as follows:

1. **Client Request** — The React frontend collects form input (amount, category, date, description) and sends a `POST /expense/add/expense` request via Axios, attaching the authenticated user's `X-User-Id` in the request header.
2. **Controller Validation** — `ExpenseController` receives the request, extracts and validates the `X-User-Id` header, and deserializes the JSON body into a request DTO.
3. **Service Layer Processing** — The service layer validates business rules (e.g. category exists and belongs to the user, amount is valid), begins a transactional boundary, and constructs the JPA entity.
4. **Persistence** — The repository layer persists the entity via Spring Data JPA, scoped to the authenticated user's ID so no cross-user data leakage is possible.
5. **Aggregation Refresh** — Downstream aggregation queries (monthly totals, category breakdowns) recompute lazily on the next dashboard fetch rather than being pre-materialized, keeping writes fast.
6. **DTO Mapping & Response** — ModelMapper converts the persisted entity back into a response DTO, stripping internal fields, and the controller returns a JSON response with the appropriate HTTP status.
7. **Frontend Update** — The React frontend receives the response, updates local state, and re-renders the affected dashboard cards and charts (Recharts) to reflect the new data immediately.

Read requests (e.g. loading the dashboard) follow a simplified version of this flow: the controller validates `X-User-Id`, the service layer runs aggregation queries scoped to that user, and the response is mapped and returned for the frontend to render.

---

## 🗂️ Entity Relationship (Overview)

```
User (1) ───< Category (many)
User (1) ───< Expense (many) >─── Category (1)
User (1) ───< Saving (many)
User (1) ───< Debt (many)
User (1) ───< ScheduledBill (many) >─── ScheduledOption (1)
User (1) ───< Subscription (many)
```

- A **User** owns all other records; every entity carries a foreign key back to its owning user, enforced at both the JPA and controller levels.
- **Expense** and **ScheduledBill** reference a **Category** / **ScheduledOption** respectively, but deleting a category performs a soft disassociation rather than a hard delete, preserving historical records.
- **Debt** entries carry a `direction` field (Owed to Me / Owed to Others) rather than being modeled as two separate tables.

---

## 📸 User Interface Screenshots

**Modern Compact Dashboard**
**Scheduled Bills Utility**
**Brand Subscriptions Tracker**

## 🎥 Demo Video

Watch the complete application walkthrough showcasing multi-user authentication, financial dashboard analytics, scheduled utility bills, and brand subscriptions.

Watch Demo Video

---

## 📁 File Structure

```
Expense-Tracker/
├── application/                     # Spring Boot Backend
│   ├── src/main/java/com/expensetracker/application/
│   │   ├── controller/              # REST Endpoints
│   │   │   ├── AuthController.java
│   │   │   ├── CategoryController.java
│   │   │   ├── DebtController.java
│   │   │   ├── ExpenseController.java
│   │   │   ├── SavingController.java
│   │   │   ├── SavingsController.java
│   │   │   ├── ScheduledController.java
│   │   │   └── SubscriptionController.java
│   │   ├── model/                   # Database Entities (JPA)
│   │   ├── repository/              # Spring Data JPA repositories
│   │   ├── payload/                 # DTO transfer payloads
│   │   └── exceptions/              # Global Error handlers
│   └── src/main/resources/
│       └── application.properties   # Connection configurations
│
└── frontend/                        # React + Vite Frontend
    ├── src/
    │   ├── api/                     # Axios API Clients
    │   ├── components/              # Shared UI components
    │   ├── pages/                   # Application Screen Layouts
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Expenses.jsx
    │   │   ├── Savings.jsx
    │   │   ├── Debts.jsx
    │   │   ├── Scheduled.jsx
    │   │   └── Account.jsx
    │   ├── utils/                   # Formatter helper tools
    │   ├── App.jsx
    │   └── main.jsx
    └── tailwind.config.js
```

---

## 📡 API Endpoints

### Authentication APIs
| Endpoint | Method | Description |
|---|---|---|
| `/auth/register` | POST | Sign up a new user |
| `/auth/login` | POST | Sign in an existing user |
| `/auth/update-profile` | PUT | Edit username and password |

### Expense APIs
| Endpoint | Method | Description |
|---|---|---|
| `/expense/add/expense` | POST | Create a new expense entry |
| `/expense/get/expenses` | GET | Retrieve all user expenses |
| `/expense/update/{expenseId}` | PUT | Modify a specific expense |
| `/expense/delete/expenseid/{expenseId}` | DELETE | Remove an expense |
| `/expense/delete/allexpenses` | DELETE | Remove all user expenses |
| `/expense/expenses/total` | GET | Retrieve total sum of expenses |
| `/expense/monthwise` | GET | Retrieve monthly breakdown |

### Category APIs
| Endpoint | Method | Description |
|---|---|---|
| `/category/get/categories` | GET | View all user categories |
| `/category/add/category` | POST | Create a custom category |
| `/category/update/category/{categoryId}` | PUT | Edit a category |
| `/category/delete/id/{categoryId}` | DELETE | Delete a category |

### Savings APIs
| Endpoint | Method | Description |
|---|---|---|
| `/savings/get/all` | GET | View all savings entries |
| `/savings/add` | POST | Add a savings log |
| `/savings/update/{savingId}` | PUT | Update a savings entry |
| `/savings/delete/{savingId}` | DELETE | Delete a savings log |
| `/savings/summary` | GET | Get total and monthly savings sums |

### Debt APIs
| Endpoint | Method | Description |
|---|---|---|
| `/debts/get/all` | GET | View all debt logs |
| `/debts/add` | POST | Create a new debt log |
| `/debts/update/{debtId}` | PUT | Update a debt entry |
| `/debts/delete/{debtId}` | DELETE | Delete a debt log |

### Scheduled Transactions & Subscriptions APIs
| Endpoint | Method | Description |
|---|---|---|
| `/scheduled/get/all` | GET | View scheduled transactions |
| `/scheduled/add` | POST | Create scheduled bill |
| `/scheduled/update/{scheduledId}` | PUT | Modify scheduled bill |
| `/scheduled/options` | GET | View scheduled utility categories |
| `/scheduled/options/add` | POST | Add scheduled utility option |
| `/subscriptions/get/all` | GET | View active subscriptions |
| `/subscriptions/add` | POST | Add subscription package |
| `/subscriptions/update/{subscriptionId}` | PUT | Edit subscription package |
| `/subscriptions/delete/{subscriptionId}` | DELETE | Remove subscription package |

---

## 🚀 How to Run

### 1. Prerequisites
- Java Development Kit (JDK 17)
- Maven
- Node.js (v18+)
- PostgreSQL Database

### 2. Configure Database Backend
Create a database in your local PostgreSQL cluster (e.g. `expense_tracker`).

Open `application/src/main/resources/application.properties` and update the datasource credentials:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/expense_tracker
spring.datasource.username=your_postgres_username
spring.datasource.password=your_postgres_password
spring.jpa.hibernate.ddl-auto=update
```

### 3. Run the Backend Server
```bash
cd application
mvn spring-boot:run
```
The server starts listening on `http://localhost:8080`.

### 4. Run the React Frontend
Change into the frontend folder:
```bash
cd ../frontend
```
Install server dependencies:
```bash
npm install
```
Boot the Vite development environment:
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your web browser.

---

## 🧰 Technologies Used
- JDK 17 & Spring Boot (REST Web Services)
- Spring Data JPA & PostgreSQL (Data Persistence)
- ModelMapper (Entity-DTO conversions)
- Vite & React (User Interface Layer)
- TailwindCSS (Vanilla Styling base framework)
- Recharts (Visual graphs and charts rendering)
- Axios (API Server communication)
