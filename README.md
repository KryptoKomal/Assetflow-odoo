<div align="center">

# 📦 AssetFlow

### Enterprise Asset & Resource Management System

A full-stack ERP web application for managing physical assets, employee allocations, resource bookings, and maintenance workflows — built with React, Firebase, and Tailwind CSS.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-v11-FFCA28?logo=firebase&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-green)

</div>

---

## 📖 About

AssetFlow helps organizations track, allocate, and maintain their physical assets and shared resources — from laptops and projectors to meeting rooms — all in one centralized platform. It replaces spreadsheets and manual tracking with a live dashboard, role-based access control, and a complete audit trail.

Built as a hands-on project to learn full-stack development with React and Firebase, structured module by module — from authentication through to reporting and role-based security.

---

## ✨ Features

- 🔐 **Authentication** — secure login/signup with Firebase Auth, protected routes, password reset
- 👥 **Role-based access** — Admin, Manager, and Employee roles with different permissions across the app
- 📊 **Dashboard** — live KPIs, asset status breakdown, allocation trends, recent activity feed
- 🏢 **Organization management** — departments and employee directory
- 📦 **Asset management** — register assets with photos, auto-generated tags, and downloadable **QR codes**
- 🔄 **Allocation** — assign assets to employees with conflict prevention (no double-allocation)
- ↔️ **Transfers** — request and approve asset transfers between employees
- 📅 **Resource booking** — interactive calendar (React Big Calendar) with **overlap validation**
- 🛠️ **Maintenance workflow** — raise → approve → resolve, with priority levels
- 🔔 **Notifications** — real-time in-app notification center
- 📜 **Activity logs** — full audit trail of every action in the system
- ✅ **Audit cycles** — department-wise asset verification workflow
- 📈 **Reports & analytics** — charts with CSV/PDF export
- 🌙 **Dark mode**, fully responsive design, and a reusable component system (data tables, modals, forms) throughout

---

## 🛠️ Tech Stack

**Frontend**
| | |
|---|---|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router DOM |
| Forms | React Hook Form |
| State | Context API |
| Charts | Recharts |
| Calendar | React Big Calendar |
| Animation | Framer Motion |
| Icons | Lucide React |
| QR Codes | qrcode.react |

**Backend**
| | |
|---|---|
| Auth | Firebase Authentication |
| Database | Cloud Firestore |
| Storage | Firebase Storage |
| Hosting | Firebase Hosting |

---

## 📂 Project Structure

```
src/
├── components/     # Reusable UI (tables, modals, forms, cards, charts, layout)
├── pages/          # Route-level pages, grouped by module
├── context/        # Auth, Theme, Sidebar contexts
├── services/       # Firestore/Storage read-write logic per module
├── hooks/          # Custom hooks (Firestore subscriptions, role checks)
├── routes/         # Route definitions + guards
├── firebase/       # Firebase SDK config
├── constants/      # Collection names, navigation config
└── utils/          # Helper functions (formatting, CSV/PDF export)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with **Authentication**, **Firestore**, and **Storage** enabled

### 1. Clone & Install

```bash
git clone https://github.com/ankitj1105/assetflow.git
cd assetflow
npm install
```

### 2. Environment Setup

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Get these values from **Firebase Console → Project Settings → General → Your apps → SDK setup and configuration**.

In Firebase Console, also enable:
- **Authentication** → Email/Password sign-in method
- **Firestore Database** (apply the security rules in `/firestore.rules` before going to production)
- **Storage** (for asset photos)

### 3. Run Locally

```bash
npm run dev
```

### 4. Build for Production

```bash
npm run build
```

### 5. Deploy (Firebase Hosting)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

---

## 🔐 Security

Firestore and Storage rules enforce role-based access on the **server side** — not just hidden UI buttons. Admins can manage all data; employees have read access and limited write access (e.g., raising maintenance requests, creating their own bookings). See `firestore.rules` for the complete rule set.

---

## 🗺️ Roadmap

- [ ] Invite-based account creation for new employees (Cloud Functions)
- [ ] Push notifications
- [ ] Advanced audit reports with damage/missing asset tracking
- [ ] Multi-department analytics dashboard

---

## 👤 Author

**Ankit Kumar Jha
 komal patel
 Ayush Saraswat **
 
B.Tech Computer Science & Engineering, GLA University, Mathura


---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

<div align="center">

⭐ If you found this project useful, consider giving it a star!

</div>
