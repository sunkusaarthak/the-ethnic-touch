# 🌸 The Ethnic Touch

**The Ethnic Touch** is a premium, minimalist Indo-Western e-commerce platform designed for modern elegance. Featuring a curated collection of Kurthis and Anarkalis, the application provides a seamless shopping experience with a soft, pastel-themed aesthetic and a robust backend management system.

---

## 🚀 Features

### 🛍️ Storefront
- **Premium Catalog**: Browse high-quality Indo-Western wear with detailed descriptions and pricing.
- **Interactive Cart**: Smooth shopping experience with dynamic updates.
- **Coupon System**: Apply discount codes (e.g., `WELCOME10`) to save on purchases.
- **Order Gifting**: Integrated gift system that generates bonus rewards for high-value orders (over ₹5,000).

### 🛠️ Admin Portal
- **Inventory Management**: Add and monitor product stock levels.
- **Coupon Dashboard**: Create and manage discount codes with usage limits and expiry dates.
- **Order Tracking**: View and manage customer orders in real-time.

---

## 🛠️ Tech Stack

- **Backend**: [Go (Golang)](https://golang.org/) - High-performance API server.
- **Frontend**: Vanilla HTML5, CSS3, and JavaScript (ES6+) - Fast and responsive UI.
- **Database**: [SQLite](https://sqlite.org/) - Lightweight, serverless relational database.
- **Styling**: Custom CSS with a premium pastel design system.

---

## 🏁 Getting Started

### Prerequisites
- [Go](https://golang.org/dl/) installed on your machine.

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd "The Ethnic Touch"
   ```

2. **Install Dependencies**:
   The project uses Go modules. Dependencies will be downloaded automatically when you run the project for the first time.
   ```bash
   go mod download
   ```

3. **Database Initialization**:
   The system automatically creates and seeds the `ethnictouch.db` SQLite database on the first run.

---

## 🏗️ Building & Running

### Development Mode
To run the server directly without building:
```bash
go run main.go
```
The server will start at [http://localhost:8080](http://localhost:8080).

### Production Build
To create an executable binary:

**Windows**:
```bash
go build -o ethnictouch.exe main.go
```

**Linux/macOS**:
```bash
go build -o ethnictouch main.go
```

---

## 📂 Project Structure

```text
.
├── main.go            # Go API server & Static file handler
├── ethnictouch.db     # SQLite database
├── go.mod             # Go module definition
└── static/            # Frontend assets
    ├── index.html     # Storefront main page
    ├── app.js         # Storefront logic
    ├── style.css      # Main design system
    ├── admin/         # Admin portal
    │   ├── index.html # Admin dashboard
    │   └── admin.js   # Admin logic
    └── images/        # Product and UI images
```

---

## 🎨 Design System
The application follows a strict aesthetic guideline:
- **Primary Color**: Pastel Peach (`#FFE5D9`)
- **Accent Color**: Lavender and Mint accents
- **Typography**: Clean, modern sans-serif fonts

---

## 📝 License
This project is for demonstration purposes. All rights reserved.
