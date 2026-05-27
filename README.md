# Elegance | Haute Joaillerie & Fine Jewelry

An elegant, premium full-stack e-commerce application designed for a luxury jewelry brand. Built with a Django REST Framework backend and a React (Vite) frontend, this project delivers a high-end, responsive shopping experience styled with champagne gold accents, alabaster backgrounds, and smooth micro-interactions.

---

## 💎 Project Overview

Elegance is a digital jewelry atelier presenting bespoke precious designs. The system provides an end-to-end shopping experience, featuring a dynamic collections catalog, product reviews, a real-time synchronized shopping cart and wishlist, secure multi-channel payment integrations, and a user profile management dashboard.

---

## 🛠️ Technology Stack

### Backend
* **Framework**: Django & Django REST Framework (DRF)
* **Database**: SQLite3
* **Security & Authentication**: JSON Web Tokens (JWT), Django Password Validators
* **Integrations**: Stripe API & Paystack API for secure checkout workflows

### Frontend
* **Build System**: Vite (React)
* **State Management**: Zustand
* **Routing**: React Router DOM
* **Animations**: AOS (Animate On Scroll)
* **Styling**: Premium Light CSS system (Custom HSL gold variables, glassmorphism overlays, custom scrollbars, and fine typography using Playfair Display and Montserrat)
* **Notifications**: React-Toastify

---

## ✨ Features & Architecture

### 🛡️ Hardened Security Measures
* **Server-Side Price Validation**: Order totals and item prices are calculated strictly on the backend using the current database records. Any client-supplied rates or prices are ignored, preventing cart value tampering.
* **Automatic Cart Clearing**: Cart records are automatically cleared on the server as soon as a payment is verified, resolving persisting item state bugs.
* **Secrets Management**: SMTP credentials, API keys, and the Django secret key are loaded securely from a `.env` file using environment variables.

### 🛍️ Client Experience
* **Digital Atelier Catalog**: Search and filter options for sorting creations by category and price in a responsive grid.
* **Synchronized Cart & Wishlist**: Zustand stores communicate with unified `axios` instances, showing updated badges in the navigation header instantly.
* **Payment Gateways**: Users can pay securely via Credit Card, Apple Pay, Google Pay (Stripe), or Bank Transfer (Paystack).
* **Heritage & Storytelling**: An interactive "Heritage" page showing brand pillars and craftsmanship spotlights.
* **Interactive Profile Workspace**: Features custom avatar uploads with real-time square cropping integrations.

---

## 🚀 Local Installation & Setup

Ensure you have Python 3 and Node.js installed on your system.

### 1. Clone & Set Up the Repository
```bash
git clone https://github.com/richsam22/elegant-jewelry-store.git
cd elegant-jewelry-store
```

### 2. Backend Configuration
1. Navigate to the backend directory and set up a virtual environment:
   ```bash
   cd backend
   python3 -m venv .venv
   source .venv/bin/activate
   ```
2. Install the backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the root of the project using the configuration template:
   ```env
   SECRET_KEY=your_django_secret_key
   DEBUG=True
   STRIPE_SECRET_KEY=your_stripe_secret_key
   PAYSTACK_SECRET_KEY=your_paystack_secret_key
   EMAIL_HOST_USER=your_email@gmail.com
   EMAIL_HOST_PASSWORD=your_email_password
   ```
4. Run migrations and start the Django development server:
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```
   The backend will start at `http://127.0.0.1:8000/`.

### 3. Frontend Configuration
1. Open a new terminal session, navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the Node modules:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   The frontend will start at `http://localhost:5173/`.

---

## 🎨 Design System

The visual layout aligns with luxury brand principles:
* **Backgrounds**: Warm Alabaster White (`#faf8f5`), Cashmere Cream (`#f4f0ea`)
* **Accents**: Polished Champagne Gold (`#b89528`), Bronze Gold (`#9e7f1f`)
* **Typography**: Playfair Display (Serif headings), Montserrat (Sans-serif body copy)
* **Transitions**: Smooth scaling, fade-in animations, and underline expansion triggers

---

## 📄 License

MIT License
