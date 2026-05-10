# RoomBites Backend

Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Multer, Cloudinary backend for the RoomBites campus food delivery app.

## Install

```bash
cd backend
npm install
cp .env.example .env
```

Update `.env`, then run:

```bash
npm run dev
```

Seed food/categories/coupons:

```bash
npm run seed
```

Remove old demo users from an existing database:

```bash
npm run remove:demo-users
```

## Account Rules

- Students and delivery agents must use real `@gmail.com` addresses.
- Admin registration and login are restricted to `sathwikgolla06@gmail.com`.
- Demo accounts are not supported.

## API Quick Reference

Use `Authorization: Bearer <token>` for protected routes.

### Auth

```http
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
PUT /api/auth/profile
PUT /api/auth/change-password
PUT /api/auth/cancel-account
```

Login example:

```json
{
  "email": "studentname@gmail.com",
  "password": "your-password",
  "role": "student"
}
```

### Categories

```http
GET /api/categories
GET /api/categories/:slug
POST /api/categories              Admin
PUT /api/categories/:id           Admin
DELETE /api/categories/:id        Admin
```

### Foods

```http
GET /api/foods?category=chicken&search=biryani&minPrice=20&maxPrice=200&available=true
GET /api/foods/category/:categorySlug
GET /api/foods/:id
POST /api/foods                   Admin multipart image
PUT /api/foods/:id                Admin multipart image
DELETE /api/foods/:id             Admin
```

### Orders

```http
POST /api/orders                  Student
GET /api/orders/my-orders         Student
GET /api/orders/:id               Protected scoped
PUT /api/orders/:id/cancel        Student/Admin
PUT /api/orders/:id/student-success Student
```

Place order example:

```json
{
  "items": [{ "foodItemId": "FOOD_ITEM_OBJECT_ID", "quantity": 2 }],
  "speedOption": "10min",
  "floor": "2nd Floor",
  "roomNumber": "204",
  "department": "Computer Science",
  "phone": "9876543210",
  "deliveryNote": "Call before arrival"
}
```

### Delivery

```http
GET /api/delivery/available-orders
PUT /api/delivery/orders/:id/accept
PUT /api/delivery/orders/:id/out-for-delivery
PUT /api/delivery/orders/:id/success
GET /api/delivery/my-orders
PUT /api/delivery/status
```

### Admin

```http
GET /api/admin/dashboard
GET /api/admin/users?role=student
GET /api/admin/orders?status=pending&from=2026-05-01
PUT /api/admin/orders/:id/cancel
PUT /api/admin/orders/:id/mark-delivered
DELETE /api/admin/users/:id
```

### Notifications

```http
GET /api/notifications
PUT /api/notifications/:id/read
PUT /api/notifications/read-all
DELETE /api/notifications/:id
```

### Wallet

```http
GET /api/wallet/balance
GET /api/wallet/transactions
POST /api/wallet/demo-credit       Admin
```

Demo credit example:

```json
{
  "userId": "USER_OBJECT_ID",
  "amount": 5000,
  "description": "Wallet top-up"
}
```

## Postman Flow

1. Register/login as a Gmail student and save token.
2. `GET /api/foods/category/chicken`.
3. Place order with a food item id.
4. Login as a Gmail delivery agent and call `GET /api/delivery/my-orders`.
5. Accept order, mark out for delivery, mark success.
6. Login as student and call student success.
7. Login as admin and view dashboard/orders.

## Notes

- Wallets start at `100000`.
- Cancelled users cannot login.
- Student orders debit wallet and write wallet transaction.
- Pending student cancellation refunds wallet.
- Delivery and student must both confirm before final delivered status.
