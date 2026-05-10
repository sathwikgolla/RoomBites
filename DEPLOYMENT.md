# RoomBites Deployment Guide

RoomBites is split into:

- Frontend: React/Vite app in `frontend/`
- Backend: Express/MongoDB API in `backend/`
- Database: MongoDB Atlas

## Environment Variables

Backend `backend/.env`:

```env
PORT=5001
MONGO_URI=mongodb+srv://USER:PASSWORD@CLUSTER/roombites
JWT_SECRET=use_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=https://your-frontend.vercel.app
CLIENT_URLS=https://your-frontend.vercel.app
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Frontend `frontend/.env`:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

Local development:

```env
VITE_API_URL=http://localhost:5001/api
CLIENT_URL=http://localhost:5173
CLIENT_URLS=http://localhost:5173,http://127.0.0.1:5173
```

## MongoDB Atlas

1. Create an Atlas cluster.
2. Create a database user.
3. Network Access: allow `0.0.0.0/0` for Render.
4. Copy the connection string to `MONGO_URI`.

## Backend on Render

Root directory:

```text
backend
```

Build command:

```bash
npm install
```

Start command:

```bash
npm start
```

After first deploy, seed food data if needed:

```bash
npm run seed:categories
npm run seed:foods
```

Useful cleanup scripts:

```bash
npm run clear-users
npm run clear-orders
npm run cleanup-pending
npm run fix-delivery-users
```

## Frontend on Vercel

Root directory:

```text
frontend
```

Build command:

```bash
npm run build
```

Output directory:

```text
dist
```

Set:

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

## Final Test Checklist

1. Register student with Gmail.
2. Verify email OTP.
3. Login student.
4. Register delivery with Gmail.
5. Verify email OTP.
6. Set delivery available.
7. Student places order.
8. Order assigns to delivery.
9. Delivery accepts.
10. Delivery marks out for delivery and near classroom.
11. Student sees status updates.
12. Delivery clicks success.
13. Student confirms.
14. Delivery completed order remains visible.
15. Admin `sathwikgolla06@gmail.com` can login after verification.
16. Refresh pages and verify auth persists.
17. Images load on menu and item pages.
18. Test mobile viewport.

## Common Deployment Fixes

- CORS error: set backend `CLIENT_URL` to the exact Vercel URL.
- OTP not sending: use a Gmail app password, not your normal Gmail password.
- API not reachable: set frontend `VITE_API_URL` to the Render `/api` URL.
- Orders not assigning: login as delivery, set status available, then run `npm run fix-delivery-users` if needed.
- Blank protected pages: clear browser localStorage and login again.
