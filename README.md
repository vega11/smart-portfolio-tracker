
# 🌐 Smart Portfolio Tracker

Smart Portfolio Tracker is a full-stack web application that empowers users to manage their investment portfolios with ease. It supports tracking real-time asset prices, setting alerts, analyzing performance, and visualizing data through a modern React-based dashboard. This project is fully containerized using Docker and uses Celery for background tasks such as alert processing.

---

## 📌 Key Features

### 🔐 User Authentication
- Secure JWT-based authentication
- Passwords hashed using `bcrypt`
- Session-less and secure login mechanism

### 📊 Portfolio Management
- Add, update, and sell assets (e.g., stocks, cryptocurrencies)
- Detailed analytics and performance metrics per asset

### 📈 Real-Time Price Alerts
- Set thresholds for asset prices
- Background task execution with Celery + Redis
- Email or dashboard notifications (extensible)

### 🧑‍💻 Frontend Dashboard
- Built with **React.js** and styled using **Tailwind CSS** / **Material-UI**
- Responsive layout for web and mobile
- Interactive charts via **Chart.js** or **D3.js**

### 🧪 RESTful API
- Flask-powered API
- SQLite for development, PostgreSQL for production
- Swagger/OpenAPI support for documentation (optional)

### 🐳 Scalable Infrastructure
- Fully containerized with **Docker** and orchestrated via **Docker Compose**
- Multi-container setup: Backend, Frontend (React + Nginx), Redis, Celery Worker

---

## 🧰 Tech Stack

| Layer        | Tools/Frameworks |
|--------------|------------------|
| **Frontend** | React.js, Tailwind CSS, Chart.js |
| **Backend**  | Flask, SQLAlchemy, JWT, Celery, Redis |
| **Database** | SQLite (dev), PostgreSQL (prod) |
| **DevOps**   | Docker, Docker Compose, GitHub Actions |
| **Messaging**| Redis (as broker for Celery) |

---

## 📁 Project Structure

```plaintext
smart-portfolio-tracker/
├── backend/                          # Flask Backend
│   ├── app.py                        # App entry point
│   ├── config.py                     # Environment configurations
│   ├── extensions.py                 # Init Flask extensions (db, jwt, etc.)
│   ├── requirements.txt              # Python dependencies
│   ├── Dockerfile                    # Docker image config for backend
│   ├── models/                       # SQLAlchemy Models
│   │   ├── user.py                   # User model
│   │   ├── portfolio.py              # Portfolio model
│   │   └── transaction.py            # Transaction logs
│   ├── routes/                       # API route controllers
│   │   ├── auth_routes.py            # Register/login routes
│   │   ├── portfolio_routes.py       # CRUD portfolio routes
│   │   └── price_routes.py           # Price check & alert routes
│   ├── tasks/                        # Background tasks using Celery
│   │   └── alert_tasks.py            # Async alert checker
│   └── migrations/                   # Flask-Migrate version files
│
├── frontend/                         # React Frontend
│   ├── public/                       # Public static assets
│   │   ├── index.html                # HTML Template
│   │   ├── manifest.json             # PWA manifest
│   │   └── logos/*                   # App logos
│   ├── src/                          # Frontend source code
│   │   ├── assets/                   # Images & CSS
│   │   ├── components/               # Reusable components
│   │   │   ├── auth/                 # Auth UI
│   │   │   ├── charts/               # Data visualizations
│   │   │   └── portfolio/            # Portfolio UI logic
│   │   ├── pages/                    # Dashboard, Login, Alerts, etc.
│   │   ├── services/                 # API calls using axios/fetch
│   │   ├── context/                  # Context API or Redux stores
│   │   └── App.jsx                   # Main app shell
│   ├── tailwind.config.js            # Tailwind configuration
│   └── Dockerfile                    # Docker image config for frontend
│
├── docker-compose.yml                # Docker Compose for orchestration
├── .env                              # Environment variables
└── README.md                         # You are here ✅

## 🚀 Installation & Setup

### ✅ Prerequisites
- Docker & Docker Compose
- Node.js & npm (for standalone frontend work)

### 🛠 Setup Steps

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/smart-portfolio-tracker.git
cd smart-portfolio-tracker

# 2. Build and start the app
docker-compose up --build

# Services:
# - Frontend: http://localhost:3000
# - Backend API: http://localhost:5001
# - Redis: localhost:6379
```

### 🗃 Database Migrations

```bash
docker-compose exec web flask db upgrade
```

---

## 🔌 API Testing with cURL

### 🔐 Authentication

**Register**
```bash
curl -X POST http://localhost:5001/auth/register \
-H "Content-Type: application/json" \
-d '{"username": "testuser", "email": "test@example.com", "password": "secure123"}'
```

**Login**
```bash
curl -X POST http://localhost:5001/auth/login \
-H "Content-Type: application/json" \
-d '{"username": "testuser", "password": "secure123"}'
```

### 📊 Portfolio Endpoints

**Add an Asset**
```bash
curl -X POST http://localhost:5001/portfolio/add \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-H "Content-Type: application/json" \
-d '{"asset": "AAPL", "quantity": 10, "purchase_price": 150.0}'
```

**View Portfolio**
```bash
curl -X GET http://localhost:5001/portfolio \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Sell Asset**
```bash
curl -X POST http://localhost:5001/portfolio/sell \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-H "Content-Type: application/json" \
-d '{"asset": "AAPL", "quantity": 5, "sell_price": 160.0}'
```

### ⏰ Alerts

**Create Price Alert**
```bash
curl -X POST http://localhost:5001/alert/create \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-H "Content-Type: application/json" \
-d '{"asset": "BTC", "target_price": 30000}'
```

---

## 🖼️ Screenshots

| Dashboard | Alerts | Login |
|----------|--------|-------|
| ![Dashboard](https://via.placeholder.com/800x400?text=Dashboard) | ![Alerts](https://via.placeholder.com/800x400?text=Alerts) | ![Login](https://via.placeholder.com/800x400?text=Login) |

---

## 🧩 Troubleshooting

- **Port Already in Use**: Stop services running on `3000`, `5001`, or `6379`.
- **Database Errors**: Verify container is up and the DB URL is correct.
- **Celery Issues**: Ensure Redis and Celery are running.
- **JWT Issues**: Verify token in `Authorization: Bearer <token>` header.

---

## 🙌 Contributing

We welcome PRs! Steps to contribute:

1. Fork this repo
2. Create your branch `git checkout -b feature/your-feature`
3. Commit and push `git commit -m "Add cool feature"`
4. Submit a pull request!

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.

---

## 💬 Contact

For feedback or questions:
- Email: `abdelrahmanfouuad@gmail.com`
- GitHub: [@yourusername](https://github.com/yourusername)

---

Thanks for checking out **Smart Portfolio Tracker** — your all-in-one solution for personal investment insights and control. 📊🚀

