# Deployment Guide for SoloHack Portfolio App

This guide will help you deploy your MERN stack application.

## Overview

- **Frontend**: stored on **Firebase Hosting** (Free, fast/CDN).
- **Backend**: You have two main options:
    1.  **Render.com** (Recommended - Free Tier, easier for standard Node/Express apps).
    2.  **Firebase Cloud Functions** (Integrated, but requires **Blaze Plan** / Credit Card, and code changes).
- **Database**: **MongoDB Atlas** (Cloud database).

---

## Prerequisite: Database (MongoDB Atlas)

Before deploying the backend, your local database connection (`mongodb://localhost...`) won't work. You need a cloud database.

1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a free cluster.
3.  Click "Connect" -> "Connect your application".
4.  Copy the connection string (e.g., `mongodb+srv://<username>:<password>@cluster0...`).
5.  **Save this**; you will need it for your backend environment variables.

---

## Part 1: Backend Deployment (Option A: Render - Recommended)

This is the easiest way to deploy a standard Node.js/Express app for free.

1.  **Push your code to GitHub**.
    *   Make sure your project is in a GitHub repository.
2.  **Create a Render Service**.
    *   Go to [Render.com](https://render.com) and sign up with GitHub.
    *   Click "New +" -> "Web Service".
    *   Connect your repository.
3.  **Configure**.
    *   **Root Directory**: `backend` (Important! Your server.js is inside the backend folder).
    *   **Build Command**: `npm install`
    *   **Start Command**: `node server.js`
4.  **Environment Variables**.
    *   Scroll down to "Environment Variables".
    *   Add Key: `MONGO_URI`, Value: (Your MongoDB Atlas connection string).
    *   Add Key: `PORT`, Value: `5000` (Optional, Render sets this automatically usually, but good to have).
5.  **Deploy**.
    *   Click "Create Web Service".
    *   Wait for it to finish. You will get a URL like `https://solohack-backend.onrender.com`.
    *   **Copy this URL**.

---

## Part 2: Backend Deployment (Option B: Firebase Functions)

*Warning: Requires Firebase 'Blaze' (Pay-as-you-go) plan.*

1.  **Initialize Functions**:
    ```bash
    firebase init functions
    ```
2.  **Select**: "Use an existing project" (or create new).
3.  **Language**: JavaScript.
4.  **Setup**:
    *   This creates a `functions` folder.
    *   You will need to move your `backend` code logic into `functions` OR refactor `functions/index.js` to import your `backend/server.js` app.
    *   *Note: Standard `app.listen` in `server.js` causes issues in Functions. You need to export the `app`.*
    *   **Example `functions/index.js`**:
        ```javascript
        const functions = require('firebase-functions');
        const express = require('express');
        const app = express();
        // ... your middlewares and routes ...
        exports.api = functions.https.onRequest(app);
        ```
5.  **Deploy**:
    ```bash
    firebase deploy --only functions
    ```

---

## Part 3: Frontend Deployment (Firebase Hosting)

1.  **Install Firebase Tools** (if not installed):
    ```bash
    npm install -g firebase-tools
    ```

2.  **Login**:
    ```bash
    firebase login
    ```

3.  **Initialize** (Run inside `d:\SoloHack\`):
    ```bash
    firebase init hosting
    ```
    *   **Public directory**: `frontend/dist` (This is where Vite builds to).
    *   **Configure as a single-page app**: **Yes**.
    *   **Set up automatic builds and deploys with GitHub**: No (unless you want that).

4.  **Configure Production API URL**:
    *   Create a file named `.env.production` inside the `frontend/` folder.
    *   Add your backend URL (from Render or Firebase Functions):
        ```
        VITE_API_BASE_URL=https://your-backend-url.onrender.com
        ```
    *   *Note: Do NOT put a trailing slash `/` at the end.*

5.  **Build and Deploy**:
    ```bash
    cd frontend
    npm run build
    cd ..
    firebase deploy --only hosting
    ```

6.  **Done!** Firebase will give you a hosting URL (e.g., `https://your-project.firebaseapp.com`).
