# 🍔 ROOMBITES – CAMPUS FOOD DELIVERY WEB APP

RoomBites is a modern full-stack campus food delivery platform that allows students to order food directly to their classroom, floor, hostel, or campus location. The platform provides separate dashboards for students, delivery agents, and admins with real-time order management and smart delivery assignment.

---

# 📌 Problem Statement

In many colleges, students face problems such as:

- Long canteen queues
- Walking long distances in summer
- Limited break time between classes
- Difficulty carrying food to upper floors/classrooms

RoomBites solves these problems by enabling fast campus food delivery inside the college premises.

---

# 🚀 Features

## 👨‍🎓 Student Features

- Secure Email OTP Authentication
- Role-Based Registration & Login
- Browse Food Categories
- View Food Items with Images
- Add to Cart
- Floating Checkout Panel
- Demo Wallet Payment System
- Select Floor & Room Number
- Delivery Speed Selection
- Live Order Tracking
- Notifications System
- Order History
- Responsive UI

---

## 🛵 Delivery Agent Features

- Delivery Agent Authentication
- Available / Busy Toggle
- View Assigned Orders Only
- Accept Orders
- Mark Out for Delivery
- Near Classroom Status
- Delivery Success Confirmation
- Completed Orders History
- Real-Time Order Updates

---

## 🛠️ Admin Features

- Admin Dashboard
- View All Users
- Monitor Orders
- Track Delivery Agents
- Analytics Overview
- Revenue Tracking
- Pending Order Monitoring
- Delivery Assignment Monitoring

---

# 🧠 Smart Features

- Smart Delivery Assignment
- Pending Order Queue System
- Auto Assignment When Delivery Agent Becomes Available
- Email OTP Verification
- JWT Authentication
- Protected Routes
- Role-Based Authorization
- MongoDB Persistent Storage
- Responsive Brown Premium UI
- Advanced Animations with Framer Motion

---

# 🏗️ Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Framer Motion

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Nodemailer

## Deployment

- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

# 📂 Project Structure

```bash
roombites/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── utils/
│   │   └── App.jsx
│   │
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── DEPLOYMENT.md
└── README.md
```

---

# 🔐 Authentication Flow

## Registration Flow

1. User enters registration details
2. Email OTP is sent using Nodemailer
3. User verifies OTP
4. Account is created in MongoDB
5. User can now login

---

## Login Flow

1. User selects role:
   - Student
   - Delivery Agent
   - Admin

2. User enters:
   - Email
   - Password

3. Backend validates:
   - Email
   - Password
   - Role
   - Email Verification

4. JWT Token generated after successful login

---

# 📦 Order Flow

## Student Side

1. Browse food categories
2. Add items to cart
3. Open checkout panel
4. Enter:
   - Floor
   - Room Number
   - Department
   - Phone Number

5. Select delivery speed
6. Place order
7. Track order live

---

## Delivery Agent Side

1. Set status as Available
2. Receive assigned order
3. Accept order
4. Mark Out for Delivery
5. Mark Near Classroom
6. Complete delivery
7. Order moves to completed history

---

# ⚙️ Backend Setup

## Step 1 — Navigate to Backend

```bash
cd backend
```

---

## Step 2 — Install Dependencies

```bash
npm install
```

---

## Step 3 — Create `.env`

```env
PORT=5001

MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password

NODE_ENV=development
```

---

## Step 4 — Start Backend

```bash
npm run dev
```

---

# 💻 Frontend Setup

## Step 1 — Navigate to Frontend

```bash
cd frontend
```

---

## Step 2 — Install Dependencies

```bash
npm install
```

---

## Step 3 — Create `.env`

```env
VITE_API_URL=http://localhost:5001/api
```

---

## Step 4 — Start Frontend

```bash
npm run dev
```

---

# 🧪 Build Commands

## Frontend Production Build

```bash
cd frontend
npm run build
```

---

## Backend Production Start

```bash
cd backend
npm start
```

---

# 🌐 Deployment

# 🟢 MongoDB Atlas Setup

1. Create MongoDB Atlas account
2. Create cluster
3. Create database user
4. Whitelist IP:
   ```txt
   0.0.0.0/0
   ```
5. Copy connection string
6. Add to backend `.env`

---

# 🟣 Backend Deployment (Render)

## Build Command

```bash
npm install
```

## Start Command

```bash
npm start
```

## Environment Variables

```env
PORT=5001

MONGO_URI=your_mongodb_atlas_uri

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

CLIENT_URL=https://your-frontend.vercel.app

EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password

NODE_ENV=production
```

---

# ⚫ Frontend Deployment (Vercel)

## Environment Variable

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

# 🔒 Security Features

- Password Hashing with bcrypt
- JWT Protected Routes
- Role-Based Authorization
- Email OTP Verification
- Unique Email Validation
- Unique Phone Validation
- Protected Admin Access
- Secure Environment Variables

---

# 📸 Screenshots

Add screenshots inside a `screenshots` folder.

Example:

```md
![Home Page](./screenshots/home.png)

![Student Dashboard](./screenshots/student-dashboard.png)

![Delivery Dashboard](./screenshots/delivery-dashboard.png)

![Admin Dashboard](./screenshots/admin-dashboard.png)
```

---

# ✅ Final Testing Checklist

## Authentication

- Register user
- Receive email OTP
- Verify OTP
- Login successfully

---

## Student Flow

- Browse foods
- Add to cart
- Place order
- Track delivery
- View order history

---

## Delivery Flow

- Set Available
- Accept assigned order
- Update statuses
- Complete delivery
- View completed orders

---

## Admin Flow

- View users
- View orders
- Monitor delivery agents
- Check analytics

---

# 📈 Future Enhancements

- UPI Payment Gateway
- Socket.io Real-Time Tracking
- Ratings & Reviews
- Group Ordering
- AI-Based Delivery Optimization
- QR-Based Delivery Confirmation
- Push Notifications

---

# 👨‍💻 Author

## Sathwik Golla

B.Tech CSE Student  
Full Stack Developer  
Passionate about building real-world scalable campus solutions.

GitHub: `sathwikgolla`

---

# 📄 License

This project is built for educational, portfolio, and campus innovation purposes.
