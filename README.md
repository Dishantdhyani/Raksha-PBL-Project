# Raksha – Women Safety AI Web Application

**Raksha** is a full-stack AI-powered women safety web application. It provides emergency contacts, safety tips, quick actions, journey tracking, and an in-page AI chatbot for instant safety guidance and legal rights knowledge.

## Capabilities & Features

- **Hero & Quick Actions**: Emergency SOS (112), **Share my location**, and quick links to all emergency numbers.
- **AI Chatbot**: An intelligent assistant powered by **Groq (Llama 3)**, styled with Markdown. It provides real-time guidance on emergency numbers, safety tips, legal rights, and domestic violence support.
- **Journey Tracker**: Share and track your journey securely.
- **SOS Alerts**: Send immediate email alerts to trusted contacts via Nodemailer.
- **User Authentication**: Secure signup and login using JWT and bcrypt.
- **Emergency Contacts**: 112, 1091, 181, 14490, NCW, and other critical helplines with one-tap call functionality.
- **Safety Tools & Resources**: Fake call generator (to exit uncomfortable situations), pre-travel checklists, and direct links to NCW, WCD, 112 India app, and Sakhi One Stop Centres.
- **Safety Tips & Legal Rights**: Curated resources regarding travel, public, online, and workplace safety, plus deep dives into legal rights.

## Tech Stack

### Frontend
- React 18 & Vite
- React Markdown (for rendering beautiful AI output)
- CSS (Custom global and component-scoped styles)
- React Router DOM

### Backend
- Node.js & Express.js
- PostgreSQL (Database)
- Groq API (Llama 3 for the AI Chatbot)
- JWT (Authentication) & bcrypt (Password hashing)
- Nodemailer (SOS Email alerts)

## Setup & Run Locally

### 1. Database Setup
Ensure you have PostgreSQL installed. Create a database named `raksha_db`. 
Import the schema and tables provided in `backend/database.sql`.

### 2. Backend Setup
Navigate to the `backend` folder, install dependencies, and setup the environment variables.

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
DB_USER=postgres
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=raksha_db

# Email Configuration (for SOS alerts)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# AI Chatbot Configuration
GROQ_API_KEY=your_free_groq_api_key_here
```

Start the backend development server:
```bash
npm run dev
```
*(The server will run on `http://localhost:5000`)*

### 3. Frontend Setup
Open a new terminal, navigate to the `frontend` folder, and install dependencies.

```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```
*(The application will open on `http://localhost:5173`)*

## Project Architecture

- `backend/` – Express API handling authentication, journey tracking, emergency contacts sharing, and the Groq AI Chatbot integration.
- `frontend/` – React application encompassing structured features (Navbar, Hero, ChatBot, EmergencyContacts, LegalRights, JourneyTracker, SOSButton, etc.).
