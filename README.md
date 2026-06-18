# ShopEZ

ShopEZ is a MERN-style e-commerce application with a React client and an Express/MongoDB backend organized with an MVC structure.

## Project Structure

- `Client` - React + Vite frontend
- `Server` - Express API with routes, controllers, Mongoose models and middleware

## Run Locally

1. Start MongoDB locally, or update `Server/.env` with your MongoDB Atlas connection string.
2. Seed sample data:

```bash
cd Server
npm run seed
```

3. Start the backend:

```bash
cd Server
npm run dev
```

The API runs at `http://localhost:8000`.

4. Start the frontend:

```bash
cd Client
npm run dev
```

The app runs at `http://localhost:5173`.

## Demo Admin

- Email: `admin@shopez.com`
- Password: `admin123`

## Main Features

- User registration and login with JWT authentication
- Product catalog with category filtering and search
- Product details with cart and direct checkout actions
- Cart management by logged-in user
- Order placement with address and payment details
- Profile page with user order history
- Admin dashboard for product creation and order status management
