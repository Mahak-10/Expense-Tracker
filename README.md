# Expense Tracker — Personal Finance & Portfolio Management Platform

![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-latest-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-Analytics-22C55E?style=for-the-badge&logo=chartdotjs&logoColor=white)

🌐 **Live Application:** [https://personal-expense-tracker-liart-five.vercel.app](https://personal-expense-tracker-liart-five.vercel.app)

---

## 📌 Overview

A premium Personal Finance and Expense Tracker application configured to help users track and organize their portfolios efficiently. The stack comprises a robust, multi-user **Spring Boot REST API** backend paired with a modern, fully-responsive **React 19 + Vite** frontend interface.

### ❓ The Problem
* **Data Cross-Contamination:** Many basic expense tracking applications mix data across user accounts or rely only on temporary client-side state.
* **Static Insights:** Lack of dynamic month-over-month trend visualization and category distributions.
* **Fragmented Scope:** Standard tools track expenses but ignore debts (money owed to me vs. owed to others), recurring utility bills, and brand subscriptions.

### 💡 The Solution
* **Multi-Tenant User Isolation:** Every REST API call is verified against an `X-User-Id` request context header, enforcing 100% data separation.
* **5-Layer Tracking System:** Unifies Expenses, Savings, Debts, Scheduled Utility Bills, and Brand Subscriptions under one interface.
* **Audit-Safe Category Disassociation:** Soft-unlinks categories upon deletion requests to protect historical transaction logs from foreign key errors.
* **Rupee (Rs) Localization:** Full currency localization with responsive Recharts visual graphs.

---

## ✨ Key Features

### 🔐 1. Multi-User Security & Data Isolation
* User registration, login authentication, and secure profile management (username updates & password resets).
* Robust backend resource filtering: all options, categories, expenses, savings, debts, and subscriptions are isolated to each user.

### 📊 2. Premium Interactive Dashboard
* Unified summary cards tracking **Total Spent**, **This Month's Spending**, **Active Categories**, **Total Savings**, and **Current Month's Savings**.
* Dynamic monthly trend bar charts and category allocation donut charts rendered via **Recharts**.
* Instant visibility into recent expense logs.

### 💰 3. Core 5-Layer Tracking System
1. **Expenses:** Record individual entries with description, category, date, and Rupee amount.
2. **Savings:** Dedicated savings logs detailing descriptions, dates, and cumulative totals.
3. **Debts Tracker:** Manage money given or borrowed, categorized into **Owed to Me** vs **Owed to Others**.
4. **Scheduled Utility Bills:** Track recurring bills (Water, Electricity, Wireless Wifi, Mobile, etc.) with due dates and payment toggles.
5. **Brand Subscriptions:** Track streaming and SaaS packages (Netflix, Spotify, YouTube Premium, LinkedIn, Amazon Prime) with automated brand icons, cost, and renewal cycles.

---

## ⚡ Key Challenges & Engineering Outcomes

| Technical Challenge | Engineering Solution & Outcome |
| :--- | :--- |
| 🔐 **Multi-Tenant Data Leaks** | Implemented request header context validation (`X-User-Id`) across all Spring Boot REST controllers, enforcing 100% resource isolation per user session. |
| 🔗 **Foreign Key Violations on Delete** | Engineered audit-safe soft-disassociation unlinking in JPA service layers, preventing deletion of categories or options from breaking historical records. |
| 📊 **Complex Multi-Category Logs** | Structured dedicated JPA domain models for Expenses, Savings, Debts (Owed to Me vs Owed to Others), Scheduled Utility Bills, and Brand Subscriptions. |
| ⚡ **Real-Time Data Aggregation** | Designed optimized JPA aggregation queries for monthly trend calculations and category allocations, rendered seamlessly with dynamic Recharts graphs. |

---

## 🏗️ System Architecture & Control Flow

### Backend Layered Architecture

