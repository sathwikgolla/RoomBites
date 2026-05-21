<div align="center">

# 🍔 ROOMBITES  
### Smart Campus Food Delivery Platform 🚀

<p align="center">
  <img src="https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Backend-Node.js-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/UI-TailwindCSS-38BDF8?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Auth-JWT-orange?style=for-the-badge" />
</p>

### 🌐 Live Website  
# 👉 https://room-bites.vercel.app/

### 💻 GitHub Repository  
# 👉 https://github.com/sathwikgolla/RoomBites

</div>

---

# 📌 About RoomBites

RoomBites is a modern full-stack campus food delivery platform designed for college students to order food directly to their classrooms, hostel rooms, or campus locations.

The platform provides:

- 👨‍🎓 Student Dashboard
- 🛵 Delivery Agent Dashboard
- 🛠️ Admin Dashboard
- 📦 Real-Time Order Tracking
- ⚡ Smart Delivery Assignment
- 📱 Fully Responsive UI
- 🎨 Premium Brown-Themed SaaS Design

---

# 🚀 Live Demo

| Platform | URL |
|---|---|
| 🌐 Frontend | https://room-bites.vercel.app/ |
| 💻 GitHub | https://github.com/sathwikgolla/RoomBites |
| 👨‍💻 Portfolio | https://sathwikgolla-portfolio.vercel.app/ |

---

# ✨ Features

# 👨‍🎓 Student Features

✅ Secure Authentication  
✅ Browse Food Categories  
✅ View Food Images & Details  
✅ Add to Cart  
✅ Floating Checkout Panel  
✅ Demo Wallet Payment  
✅ Room/Floor Selection  
✅ Live Order Tracking  
✅ Notifications  
✅ Order History  
✅ Responsive UI  

---

# 🛵 Delivery Agent Features

✅ Delivery Login  
✅ Available / Busy Toggle  
✅ Assigned Orders Only  
✅ Accept Orders  
✅ Mark Out for Delivery  
✅ Near Classroom Status  
✅ Delivery Success Confirmation  
✅ Completed Orders History  

---

# 🛠️ Admin Features

✅ Admin Dashboard  
✅ User Management  
✅ Order Monitoring  
✅ Delivery Tracking  
✅ Revenue Analytics  
✅ Pending Order Queue Monitoring  

---

# 🧠 Smart Features

✨ Smart Delivery Assignment  
✨ Auto Queue System  
✨ JWT Authentication  
✨ Protected Routes  
✨ Role-Based Authorization  
✨ MongoDB Persistent Storage  
✨ Framer Motion Animations  
✨ Responsive Premium UI  

---

# 🏗️ Tech Stack

## 🎨 Frontend

- React.js
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- Framer Motion

---

## ⚙️ Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Nodemailer

---

## ☁️ Deployment

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

---

# 📂 Project Structure

```bash
RoomBites/
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
└── README.md
```

---

# 🔐 Authentication Flow

## 📝 Registration Flow

1️⃣ User enters registration details  
2️⃣ Email OTP verification  
3️⃣ Account creation  
4️⃣ User login enabled  

---

## 🔑 Login Flow

User selects role:

- 👨‍🎓 Student
- 🛵 Delivery Agent
- 🛠️ Admin

Backend validates:

- Email
- Password
- Role
- Verification

JWT token generated after successful login.

---

# 📦 Order Workflow

# 👨‍🎓 Student Side

- Browse foods
- Add items to cart
- Open checkout panel
- Select:
  - Floor
  - Room Number
  - Department
  - Delivery Speed
- Place order
- Track delivery live

---

# 🛵 Delivery Side

- Set Available
- Accept order
- Mark Out for Delivery
- Mark Near Classroom
- Complete delivery

---

# ⚙️ Backend Setup

## 1️⃣ Navigate to Backend

```bash
cd backend
```

## 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Create `.env`

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

## 4️⃣ Start Backend

```bash
npm run dev
```

---

# 💻 Frontend Setup

## 1️⃣ Navigate to Frontend

```bash
cd frontend
```

## 2️⃣ Install Dependencies

```bash
npm install
```

## 3️⃣ Create `.env`

```env
VITE_API_URL=http://localhost:5001/api
```

## 4️⃣ Start Frontend

```bash
npm run dev
```

---

# 🚀 Production Build

## Frontend Build

```bash
npm run build
```

## Backend Start

```bash
npm start
```

---

# 🌐 Deployment

# 🟢 MongoDB Atlas

- Create cluster
- Create DB user
- Whitelist IP:
```txt
0.0.0.0/0
```
- Add Mongo URI to `.env`

---

# 🟣 Render Backend

## Build Command

```bash
npm install
```

## Start Command

```bash
npm start
```

---

# ⚫ Vercel Frontend

## Environment Variable

```env
VITE_API_URL=https://your-backend.onrender.com/api
```

---

# 🔒 Security Features

🔐 bcrypt Password Hashing  
🔐 JWT Protected Routes  
🔐 Role-Based Authorization  
🔐 Email OTP Verification  
🔐 Unique Email Validation  
🔐 Secure Environment Variables  

---

# 📸 Screenshots

```md
![Home Page](./screenshots/home.png)

![Student Dashboard](./screenshots/student-dashboard.png)

![Delivery Dashboard](./screenshots/delivery-dashboard.png)

![Admin Dashboard](./screenshots/admin-dashboard.png)
```

---

# 📈 Future Enhancements

🚀 Real-Time Socket.io Tracking  
🚀 UPI Payment Gateway  
🚀 AI-Based Delivery Optimization  
🚀 Push Notifications  
🚀 QR-Based Delivery Confirmation  
🚀 Ratings & Reviews  

---

# 👨‍💻 Developer

<div align="center">

## Sathwik Golla

### 🌐 Portfolio
https://sathwikgolla-portfolio.vercel.app/

### 💻 GitHub
https://github.com/sathwikgolla

### 🚀 Live Website
https://room-bites.vercel.app/

</div>

---

# ⭐ Support

If you like this project:

⭐ Star the Repository  
🍴 Fork the Project  
🚀 Contribute Improvements  

---

<div align="center">

# 🚀 ROOMBITES — Smart Campus Food Delivery Platform

### Built with ❤️ by Sathwik Golla

</div>
