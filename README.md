# SpendWise

A minimalist personal finance tracker built on the MERN stack. SpendWise helps users record cash flow, categorize transactions, track monthly totals, and visualize spending habits through interactive charts.

---

## Live Links

- **Live Application:** [https://spend-wise-eight-zeta.vercel.app](https://spend-wise-eight-zeta.vercel.app)
- **API Server:** [https://spendwise-y9uh.onrender.com](https://spendwise-y9uh.onrender.com)

---

## Features

- **Authentication & Security:** JWT session management, bcrypt password hashing, HTTP security headers via Helmet, and brute-force rate limiting.
- **Transaction Management:** Complete CRUD functionality with user-isolated data storage and categorical classification.
- **Filtering & Pagination:** Server-side search across type (income/expense), category, month, and year with pagination controls.
- **Visual Analytics:** Metric KPI cards for Net Balance, Inflow, and Outflow, alongside custom slim bar charts and donut charts powered by Recharts.
- **Production Architecture:** Decoupled monorepo with an Express REST API on Render and a Vite SPA hosted on Vercel.

---

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS, Recharts, Lucide Icons, Axios, React Router
- **Backend:** Node.js, Express.js, Mongoose, JSON Web Tokens (JWT), Express Rate Limit, Helmet
- **Database:** MongoDB Atlas
- **Deployment:** Vercel (Client), Render (API)

---

## Project Structure

```text
spendwise/
├── client/                  # Vite + React client
│   ├── src/
│   │   ├── api/             # Axios instance & interceptors
│   │   ├── components/      # Reusable UI components & route guards
│   │   ├── context/         # AuthContext & session state
│   │   └── pages/           # Dashboard, Transactions, Auth views
│   └── vercel.json          # SPA 404 rewrite configuration
├── server/                  # Express REST API
│   ├── config/              # MongoDB connection setup
│   ├── controllers/         # Auth & Transaction business logic
│   ├── middleware/          # JWT protection & request sanitation
│   ├── models/              # User & Transaction Mongoose schemas
│   ├── routes/              # Express API endpoint declarations
│   └── index.js             # Server entry point
└── README.md
