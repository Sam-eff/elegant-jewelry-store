Elegant Jewelry Store

An e-commerce web application for managing and selling jewelry products.
Built with Django REST Framework (backend) and React (frontend).
Supports Stripe and Paystack payments.

Features

- User authentication & orders

- Product listing & categories

- Shopping cart & wishlist

- Stripe + Paystack checkout

- Order history & payment tracking

- Admin order management

🛠️ Tech Stack

- Backend: Django, Django REST Framework

- Frontend: React + Axios + Zustand

- Payments: Stripe, Paystack

Auth: JWT

. Database: SQLite (default, can be swapped for Postgres/MySQL)

Payment Flow

- When checking out, user chooses Stripe or Paystack.

- Order + Payment entry created with pending status.

- On success redirect:

- Backend verifies via Stripe Session ID / Paystack reference.

- Updates Payment.status = success and Order.is_paid = True.

License

 . MIT License
