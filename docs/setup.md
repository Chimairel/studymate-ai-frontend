# StudyMate AI - Frontend Setup Guide

This guide provides step-by-step instructions to install and run the **StudyMate AI Next.js Frontend Client** on your local machine.

---

## 🚀 Frontend Setup Instructions

### Step 1: Create Environment File
1. In the root of the **`studymate-ai-frontend`** directory, create a file named **`.env.local`**.
2. Copy and paste the following variable into your `.env.local` file:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

---

### Step 2: Install Node Dependencies
Open a terminal in the **`studymate-ai-frontend`** directory and install the required modules:
```bash
npm install
```

---

### Step 3: Run the Development Server
Start the development server:
```bash
npm run dev
```

*The frontend web client will start successfully on **[http://localhost:3000](http://localhost:3000)**.*
*Open your browser and navigate to the address to view the landing page, register an account, and start drafting essays with your AI Coach!*

---

> [!IMPORTANT]
> **Prerequisite**: Ensure the **`studymate-ai-backend`** Express server is running successfully on port `5000` so that API calls can resolve correctly when logging in or saving essays!
