# Task Approval Frontend

## 📜 Overview
This is a **Next.js application** designed for **task approvals**. It allows users to **create tasks**, **assign them via email**, and **collect approvals securely using tokenized links**. The interface provides real-time tracking and ensures data security.

---

## ⚙️ Tech Stack
- **Next.js** - React framework for server-side rendering & performance
- **TypeScript** - Static typing for improved maintainability
- **Tailwind CSS** - Utility-first styling framework
- **Axios** - API communication with the backend
- **Vercel** - Deployment platform for Next.js applications

---

## 🔧 Setup & Installation

### **1️⃣ Clone the Repository and Install Dependencies**
```bash
git clone <repository-url>
cd task-approval-frontend
npm install
```

### **2️⃣ Setup Environment Variables**

create .env.local file and place it to main folder

```bash
NEXTAUTH_SECRET=V5pJ2dIEJ1qiF0aPB84VMZJC0WN+wFUuAx1HhtCci20=
NEXT_PUBLIC_APP_URL=/
NEXT_PUBLIC_API_URL=https://link-based-task-api.vercel.app/
NEXTAUTH_URL=http://localhost:3000

NODE_ENV=PRODUCTION
```

### **3️⃣ Start the Development Server**
```bash
npm run dev
```

The frontend will run at http://localhost:3000 by default.

## **🚀 Features**
### **✅ Create tasks and assign via email**
### **✅ Track approvals and status updates**
### **✅ Secure tokenized links for response access**
### **✅ Responsive UI using Tailwind CSS**
### **✅ Login and signup functionality for authentication**



## **Live Demo**
#### https://link-based-task-app.vercel.app/

