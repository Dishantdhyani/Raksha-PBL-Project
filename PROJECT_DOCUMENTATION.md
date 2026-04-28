# 🛡️ Raksha – Women Safety AI Web Application
## Complete Technical Documentation

---

## 1. Project Overview

### What is Raksha?
**Raksha** (Sanskrit for "protection") is a full-stack, AI-powered women safety web application. It combines emergency tools, AI assistance, journey tracking, and legal awareness into a single platform.

### Why are we building this?
Women's safety remains a critical concern in India. Existing solutions are fragmented — emergency numbers are hard to remember, legal rights are not easily accessible, and there's no single platform that combines all safety tools. Raksha solves this by providing:
- **Instant emergency access** (one-tap calling to 112, 1091, etc.)
- **AI-powered chatbot** for real-time safety guidance
- **SOS alerts via email** to trusted contacts with location
- **Voice & sound detection** that auto-triggers SOS
- **Journey safety timer** with automatic alerts
- **Legal rights education** and self-defense guides

### How are we building this?
We use a modern full-stack architecture:
- **Frontend**: React 18 + Vite (fast dev server, JSX components, CSS modules)
- **Backend**: Node.js + Express.js (REST API)
- **Database**: PostgreSQL (relational data storage)
- **AI**: Groq API with Llama 3.3 70B model (chatbot)
- **Email**: Nodemailer with Gmail SMTP (SOS alerts)
- **Auth**: JWT + bcrypt (secure authentication)

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)               │
│                   http://localhost:5173                   │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │  Login   │ │   Hero   │ │ ChatBot  │ │SOSButton │   │
│  └────┬─────┘ └──────────┘ └────┬─────┘ └────┬─────┘   │
│       │                         │              │         │
│  ┌────┴─────────────────────────┴──────────────┴────┐   │
│  │          fetch() calls to backend API            │   │
│  └──────────────────────┬───────────────────────────┘   │
└─────────────────────────┼───────────────────────────────┘
                          │ HTTP REST API
┌─────────────────────────┼───────────────────────────────┐
│                    BACKEND (Express.js)                   │
│                   http://localhost:5000                   │
│                                                          │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐           │
│  │ /api/auth  │ │/api/chatbot│ │/api/journeys│          │
│  │ (JWT+bcrypt│ │ (Groq API) │ │(Nodemailer) │          │
│  └─────┬──────┘ └─────┬──────┘ └──────┬──────┘          │
│        │               │               │                 │
│  ┌─────┴───────────────┴───────────────┴──────┐         │
│  │              PostgreSQL (raksha_db)          │         │
│  │  users | emergency_contacts | journeys      │         │
│  └─────────────────────────────────────────────┘         │
│                                                          │
│  External: Groq AI API ←→ chatbot.js                    │
│  External: Gmail SMTP  ←→ journeys.js (Nodemailer)      │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Project Folder Structure

```
Raksha PBL Project/
├── backend/
│   ├── .env                    # Environment variables (DB, email, API keys)
│   ├── database.sql            # SQL schema for PostgreSQL
│   ├── package.json            # Backend dependencies
│   └── src/
│       ├── index.js            # Express server entry point
│       ├── db.js               # PostgreSQL connection pool
│       ├── middleware/
│       │   └── authorize.js    # JWT authentication middleware
│       └── routes/
│           ├── auth.js         # Register & Login endpoints
│           ├── contacts.js     # CRUD for trusted contacts
│           ├── journeys.js     # Journey tracking + SOS + email alerts
│           └── chatbot.js      # AI chatbot via Groq API
│
├── frontend/
│   ├── index.html              # HTML entry with Google Fonts
│   ├── vite.config.js          # Vite build configuration
│   ├── package.json            # Frontend dependencies
│   └── src/
│       ├── main.jsx            # React root + BrowserRouter
│       ├── App.jsx             # Main app with routing & auth state
│       ├── index.css           # Global styles & design tokens
│       └── components/
│           ├── Login.jsx / .css       # Auth (signup/login/admin)
│           ├── Navbar.jsx / .css      # Navigation bar
│           ├── Hero.jsx / .css        # Landing section
│           ├── EmergencyContacts.jsx   # National helplines
│           ├── TrustedContacts.jsx     # User's personal contacts
│           ├── SafetyTools.jsx         # Fake call + checklist
│           ├── JourneyTracker.jsx      # Safety timer
│           ├── SOSButton.jsx           # Panic button + voice/sound
│           ├── ChatBot.jsx             # AI assistant
│           ├── SafetyTips.jsx          # Safety advice
│           ├── SelfDefense.jsx         # Self-defense techniques
│           ├── LegalRights.jsx         # Legal protections
│           ├── Resources.jsx           # External resources
│           ├── About.jsx               # About page
│           ├── Footer.jsx              # Footer
│           └── Toast.jsx               # Notification toast
└── README.md
```

---

## 4. Database Design

We use **PostgreSQL** with 3 tables. Here is the schema from `backend/database.sql`:

```sql
-- 1. Users Table — stores registered users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,      -- bcrypt hashed password
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Emergency Contacts — each user's trusted contacts
CREATE TABLE emergency_contacts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,  -- FK to users
    name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(150) NOT NULL,   -- stores email addresses for alerts
    relation VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Journeys — tracks trips and SOS alerts
CREATE TABLE journeys (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    start_location VARCHAR(255) NOT NULL,
    end_location VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'in-progress',  -- in-progress | completed | alert
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP
);
```

**Why these tables?**
- `users` → Core authentication. Passwords are never stored in plain text (bcrypt hashed).
- `emergency_contacts` → Per-user trusted contacts that receive SOS email alerts.
- `journeys` → Logs every journey and SOS event for audit trail.
- `ON DELETE CASCADE` → If a user is deleted, their contacts and journeys are auto-deleted.

---

## 5. Backend — Feature-by-Feature Breakdown

### 5.1 Server Entry Point (`src/index.js`)

Sets up Express, middleware, and routes:

```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

// Middleware
app.use(cors());           // Allow frontend (port 5173) to call backend (port 5000)
app.use(express.json());   // Parse JSON request bodies

// Mount route modules
app.use('/api/auth', authRoutes);       // Login & Register
app.use('/api/contacts', contactRoutes); // Trusted contacts CRUD
app.use('/api/journeys', journeyRoutes); // Journey tracking + SOS
app.use('/api/chatbot', chatbotRoutes);  // AI chatbot

app.listen(5000, () => console.log('Server running on port 5000'));
```

**Why CORS?** The frontend runs on `localhost:5173` and the backend on `localhost:5000`. Without CORS, the browser blocks cross-origin requests.

### 5.2 Database Connection (`src/db.js`)

```javascript
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'raksha_db'
});

export default pool;
```

**Why connection pool?** A `Pool` reuses database connections instead of opening a new one for every query. This is faster and prevents connection exhaustion.

### 5.3 Authentication (`src/routes/auth.js`)

**Two endpoints:** `POST /api/auth/register` and `POST /api/auth/login`

**Registration flow:**
1. Check if email already exists in DB
2. Hash the password with bcrypt (salt rounds = 10)
3. Insert user into `users` table
4. Generate JWT token (expires in 1 day)
5. Return token + user data

```javascript
// Password hashing — never store plain passwords
const salt = await bcrypt.genSalt(10);
const passwordHash = await bcrypt.hash(password, salt);

// Save to database
const newUser = await pool.query(
  'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
  [name, email, passwordHash]
);

// Generate JWT — contains user ID, expires in 1 day
const token = jwt.sign({ id: newUser.rows[0].id }, JWT_SECRET, { expiresIn: '1d' });
```

**Login flow:**
1. Find user by email
2. Compare password with bcrypt
3. Generate and return JWT token

**Why bcrypt?** It's a one-way hash — even if the database is compromised, passwords can't be reversed. The salt prevents rainbow table attacks.

**Why JWT?** JSON Web Tokens let the frontend prove identity without sending credentials on every request. The token is stored in `localStorage` and sent as `Authorization: Bearer <token>`.

### 5.4 JWT Middleware (`src/middleware/authorize.js`)

Every protected route uses this middleware:

```javascript
export default function authorize(req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];  // "Bearer <token>"

  if (!token) return res.status(403).json({ error: 'Access denied' });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;  // { id: user_id } — available in route handlers
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}
```

**How it works:** Every request to protected endpoints must include `Authorization: Bearer <token>` header. The middleware decodes the JWT to get the user ID and attaches it to `req.user`.

### 5.5 Trusted Contacts CRUD (`src/routes/contacts.js`)

Three endpoints, all protected by `authorize` middleware:

| Method | Endpoint | Action |
|--------|----------|--------|
| `GET` | `/api/contacts` | Get all contacts for logged-in user |
| `POST` | `/api/contacts` | Add a new trusted contact |
| `DELETE` | `/api/contacts/:id` | Delete a contact (with ownership check) |

**Security:** The delete endpoint verifies `user_id` matches the logged-in user before deletion — preventing users from deleting others' contacts.

### 5.6 Journey Tracking & SOS (`src/routes/journeys.js`)

This is the most complex route. Four endpoints:

| Endpoint | Purpose |
|----------|---------|
| `POST /start` | Start a new journey |
| `GET /active` | Get active journeys |
| `PUT /:id/end` | Mark journey as completed |
| `POST /sos` | **Trigger SOS alert with email notifications** |

**SOS Alert Flow (the core safety feature):**

```
User clicks SOS → Frontend gets GPS location → POST /api/journeys/sos
    → Backend creates 'alert' journey record
    → Fetches user's name and email from DB
    → Fetches all trusted contacts
    → Sends confirmation email to user
    → Sends emergency email to each trusted contact (if email address)
    → Returns list of notified contacts
```

**Email sending with Nodemailer:**
```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,   // Gmail address
    pass: process.env.EMAIL_PASS,   // Gmail App Password (not regular password)
  },
});

// Send to each trusted contact
await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: contact.phone_number,  // stores email address
  subject: `🚨 EMERGENCY ALERT FROM ${userName} 🚨`,
  text: `${userName} has triggered an emergency panic signal!\nLocation: ${current_location}`
});
```

**Why Gmail App Passwords?** Google requires 2FA-enabled accounts to use "App Passwords" for SMTP access. This is more secure than using the actual Gmail password.

### 5.7 AI Chatbot (`src/routes/chatbot.js`)

Uses **Groq API** (free tier) with the **Llama 3.3 70B** model:

```javascript
import OpenAI from 'openai';

// Groq uses OpenAI-compatible API format
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',  // Groq's endpoint
});

const completion = await openai.chat.completions.create({
  model: 'llama-3.3-70b-versatile',
  messages: [
    {
      role: 'system',
      content: `You are Raksha, an AI safety assistant specialized in women's safety,
      self-defense, and legal rights in India. Use a supportive, clear tone.
      Format answers using Markdown. If someone is in immediate danger,
      advise calling 112 or 1091.`
    },
    { role: 'user', content: message }
  ],
});
```

**Why Groq + Llama 3?**
- **Free tier** — no cost for the project
- **OpenAI-compatible SDK** — uses the same `openai` npm package
- **Fast inference** — Groq's LPU hardware gives near-instant responses
- **System prompt** — constrains the AI to only discuss safety-related topics

---

## 6. Frontend — Feature-by-Feature Breakdown

### 6.1 Entry Point (`main.jsx` + `App.jsx`)

```jsx
// main.jsx — wraps app in BrowserRouter for client-side routing
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
```

**App.jsx** manages global auth state:
```jsx
function App() {
  const [user, setUser] = useState(null)  // null = not logged in

  // If not logged in, show Login screen
  if (!user) return <Login onLogin={setUser} />

  // If logged in, show full app with routing
  return (
    <>
      <Navbar onLogout={() => setUser(null)} />
      <Routes>
        <Route path="/" element={<MainHome />} />
        <Route path="/safety-tips" element={<SafetyTips />} />
        <Route path="/self-defense" element={<SelfDefense />} />
        <Route path="/legal-rights" element={<LegalRights />} />
        {/* ... more routes */}
      </Routes>
      <ChatBot />   {/* Floating chatbot on every page */}
      <SOSButton /> {/* Floating SOS button on every page */}
    </>
  )
}
```

**Why this pattern?** The `user` state acts as a gate — unauthenticated users see only the login page. The `ChatBot` and `SOSButton` are always rendered so they're accessible from any page.

### 6.2 Login System (`Login.jsx`)

Supports **3 modes**:
1. **User Sign Up** — creates account via `POST /api/auth/register`
2. **User Sign In** — authenticates via `POST /api/auth/login`
3. **Admin Login** — hardcoded credentials with 4-digit access code

```jsx
// API call for user authentication
const response = await fetch(`http://localhost:5000${endpoint}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
});

if (response.ok) {
  localStorage.setItem('token', data.token);  // Save JWT for future API calls
  onLogin({ role: 'user', ...data.user });     // Update App state
}
```

**Features:** Password visibility toggle, form validation, error shake animation, loading spinner.

### 6.3 Hero Section (`Hero.jsx`)

The landing section with 3 critical quick actions:

| Button | What it does | Code |
|--------|-------------|------|
| Emergency SOS | Dials 112 | `window.open('tel:112', '_self')` |
| Share Location | Gets GPS → shares Google Maps link | Uses `navigator.geolocation` + `navigator.share` |
| Nearby Police | Opens Google Maps search for police stations | `maps/search/police+stations/@lat,lng` |

### 6.4 SOS Button (`SOSButton.jsx`) — Most Advanced Component

This is the **most technically complex component**. It has 3 trigger methods:

#### Trigger 1: Manual Button Press
```
Click SOS → Confirm dialog → 3-second countdown → Send alert to backend
```

#### Trigger 2: Voice Recognition (Distress Keywords)
Uses the **Web Speech Recognition API** to continuously listen for distress words:

```javascript
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.lang = 'en-IN';

const keywords = [
  // English
  'help', 'emergency', 'save me', 'sos', 'police', 'stop',
  // Hindi
  'bachao', 'madad karo', 'chhod do', 'police ko bulao',
];

recognition.onresult = (event) => {
  const transcript = event.results[i][0].transcript.toLowerCase();
  for (const keyword of keywords) {
    if (transcript.includes(keyword)) {
      handleEmergencyTrigger(`Voice Keyword: ${keyword}`);
    }
  }
};
```

**Why this matters:** If the user can't touch their phone (hands restrained, phone in pocket), shouting "help" or "bachao" will auto-trigger SOS.

#### Trigger 3: Loud Sound Detection (Screams/Crashes)
Uses the **Web Audio API** to analyze microphone volume:

```javascript
const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;

const checkLoudness = () => {
  analyser.getByteFrequencyData(dataArray);
  const average = sum / bufferLength;
  if (average > 105) {  // Threshold for screams
    handleEmergencyTrigger('Loud Audio Detected');
  }
  requestAnimationFrame(checkLoudness);
};
```

**Police Siren Sound:** When triggered, plays a loud sawtooth-wave siren using Web Audio API to attract attention:
```javascript
osc.type = 'sawtooth';
osc.frequency.linearRampToValueAtTime(1500, now + 1.5);  // Sweep up
osc.frequency.linearRampToValueAtTime(600, now + 3.0);   // Sweep down
```

### 6.5 AI Chatbot (`ChatBot.jsx`)

- Rendered via **React Portal** (`createPortal`) to `#chatbot-portal` div — keeps it on top of all content
- Uses **ReactMarkdown** + **remark-gfm** to render AI responses with formatting
- **Chat history** persisted in `localStorage`
- **Quick suggestions** for common queries (Emergency, Travel Safety, etc.)
- **Typing indicator** with animated dots

### 6.6 Journey Safety Timer (`JourneyTracker.jsx`)

**Flow:**
1. User sets destination and duration (15–180 minutes)
2. Timer starts with circular SVG progress ring
3. If user arrives safely → clicks "I'm Safe" → shares location
4. If timer expires → **automatic SOS triggered** → emails sent to contacts

```javascript
// Auto-trigger SOS when timer expires
if (prev <= 1) {
  setStatus('alert');
  triggerAutomaticSOS();  // Calls POST /api/journeys/sos
  new Notification('🚨 Raksha – Journey Timer Expired!');
}
```

The circular progress uses **SVG stroke-dasharray/dashoffset** animation.

### 6.7 Trusted Contacts (`TrustedContacts.jsx`)

Full CRUD connected to the database:
- **Add contact** → `POST /api/contacts`
- **Delete contact** → `DELETE /api/contacts/:id`
- **List contacts** → `GET /api/contacts`
- All API calls include `Authorization: Bearer <token>` header

### 6.8 Safety Tools (`SafetyTools.jsx`)

#### Fake Call Engine
Simulates a realistic incoming phone call:
- Choose caller ID (Dad, Mom, Police Inspector, etc.)
- "Ring Now" or schedule in 10 seconds
- Plays realistic dual-tone ringing using Web Audio API
- Phone vibration via `navigator.vibrate()`
- Full-screen call UI with accept/decline buttons and active call timer

**Why?** Helps women exit uncomfortable situations by pretending to receive a call.

#### Pre-Travel Checklist
Persistent checklist stored in `localStorage` with progress bar.

### 6.9 Other Pages

| Component | Purpose |
|-----------|---------|
| `EmergencyContacts` | 6 national helplines (112, 1091, 181, 14490, etc.) with one-tap call and copy |
| `SafetyTips` | Expandable accordion with tips for travel, home, online, workplace |
| `SelfDefense` | 6 techniques with step-by-step instructions + safety tools list |
| `LegalRights` | 6 key legal protections with relevant law citations |
| `Resources` | Links to NCW, WCD, 112 India App, Sakhi One Stop Centres |

---

## 7. API Reference

### Authentication
| Method | Endpoint | Body | Auth | Response |
|--------|----------|------|------|----------|
| POST | `/api/auth/register` | `{name, email, password}` | No | `{token, user}` |
| POST | `/api/auth/login` | `{email, password}` | No | `{token, user}` |

### Contacts
| Method | Endpoint | Body | Auth | Response |
|--------|----------|------|------|----------|
| GET | `/api/contacts` | — | Yes | `[{id, name, phone_number, relation}]` |
| POST | `/api/contacts` | `{name, phone_number, relation}` | Yes | `{contact}` |
| DELETE | `/api/contacts/:id` | — | Yes | `{message}` |

### Journeys & SOS
| Method | Endpoint | Body | Auth | Response |
|--------|----------|------|------|----------|
| POST | `/api/journeys/start` | `{start_location, end_location}` | Yes | `{journey}` |
| GET | `/api/journeys/active` | — | Yes | `[{journey}]` |
| PUT | `/api/journeys/:id/end` | — | Yes | `{journey}` |
| POST | `/api/journeys/sos` | `{current_location, destination, time_passed}` | Yes | `{message, alert, notify_contacts}` |

### Chatbot
| Method | Endpoint | Body | Auth | Response |
|--------|----------|------|------|----------|
| POST | `/api/chatbot` | `{message}` | No | `{response}` |

---

## 8. Tech Stack & Dependencies

### Backend (`package.json`)
| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^5.2.1 | Web server framework |
| `pg` | ^8.20.0 | PostgreSQL client for Node.js |
| `bcrypt` | ^6.0.0 | Password hashing |
| `jsonwebtoken` | ^9.0.3 | JWT token generation & verification |
| `nodemailer` | ^8.0.5 | Email sending (Gmail SMTP) |
| `openai` | ^6.34.0 | Groq API client (OpenAI-compatible) |
| `cors` | ^2.8.6 | Cross-origin resource sharing |
| `dotenv` | ^17.4.2 | Environment variable loading |
| `nodemon` | ^3.1.14 | Auto-restart server on file changes (dev) |

### Frontend (`package.json`)
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.3.1 | UI component library |
| `react-dom` | ^18.3.1 | React DOM renderer |
| `react-router-dom` | ^6.28.0 | Client-side routing |
| `react-markdown` | ^10.1.0 | Render Markdown in chatbot responses |
| `remark-gfm` | ^4.0.1 | GitHub Flavored Markdown support |
| `vite` | ^7.3.1 | Fast build tool & dev server |
| `@vitejs/plugin-react` | ^4.3.3 | React JSX support for Vite |

### Web APIs Used (No packages needed)
| API | Used In | Purpose |
|-----|---------|---------|
| `navigator.geolocation` | Hero, SOS, Journey | Get GPS coordinates |
| `navigator.share` | Hero, Journey | Native share dialog |
| `SpeechRecognition` | SOSButton | Voice distress detection |
| `Web Audio API` | SOSButton, SafetyTools | Siren sound, fake call ring |
| `navigator.vibrate` | SafetyTools | Phone vibration |
| `Notification API` | JourneyTracker | Browser push notifications |

---

## 9. Environment Variables

The `.env` file in the `backend/` directory:

```env
# Server
PORT=5000

# PostgreSQL Database
DB_USER=postgres
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=raksha_db

# Nodemailer (Gmail SMTP for SOS alerts)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password    # NOT your Gmail password, use App Password

# AI Chatbot (Groq - free)
GROQ_API_KEY=your_groq_api_key       # Get free at console.groq.com
```

---

## 10. How to Set Up & Run

### Step 1: Database
```bash
# Install PostgreSQL, then:
psql -U postgres
CREATE DATABASE raksha_db;
\c raksha_db
\i backend/database.sql
```

### Step 2: Backend
```bash
cd backend
npm install
# Create .env file with your credentials
npm run dev      # Starts on http://localhost:5000
```

### Step 3: Frontend
```bash
cd frontend
npm install
npm run dev      # Starts on http://localhost:5173
```

---

## 11. Security Measures

| Threat | Protection |
|--------|-----------|
| Password theft | bcrypt hashing with salt (never stored plain) |
| Unauthorized API access | JWT tokens with 1-day expiry |
| Cross-origin attacks | CORS middleware configured |
| SQL injection | Parameterized queries (`$1, $2, $3`) everywhere |
| Contact data leaks | Ownership verification before delete |
| Email credential exposure | Environment variables (`.env` file, not in code) |

---

## 12. Key Design Decisions

1. **Why PostgreSQL over MongoDB?** Our data is relational (users → contacts, users → journeys). SQL enforces referential integrity with foreign keys and CASCADE deletes.

2. **Why Groq over OpenAI?** Groq offers a free tier with Llama 3.3 70B. It uses the same OpenAI SDK, making it easy to switch providers later.

3. **Why Nodemailer over Twilio SMS?** Email via Gmail is 100% free. Twilio charges per SMS. For a PBL project, free is essential.

4. **Why React Portal for ChatBot?** Portals render components outside the normal DOM hierarchy, ensuring the chatbot floats above all content regardless of parent CSS.

5. **Why Voice + Sound Detection?** In emergencies, users may not be able to touch their phone. Passive detection through voice keywords and scream detection adds a safety layer.

6. **Why localStorage for chat history?** Keeps conversation history without requiring database storage, reducing backend load.

---

*Document generated on April 28, 2026. Covers all files in the Raksha PBL Project codebase.*
