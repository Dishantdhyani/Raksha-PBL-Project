# Raksha – Women Safety AI Web Application

A React-based frontend for **Raksha**, an AI-powered women safety web app. It provides emergency contacts, safety tips, quick actions, and an in-page AI chatbot for instant guidance.

## Features

- **Hero & quick actions**: Emergency SOS (112), Share my location, link to all emergency numbers
- **Safety tips**: Travel, home/public, online, and workplace safety
- **Emergency contacts**: 112, 1091, 181, 14490, NCW, and other helplines with one-tap call
- **Safety tools**: Fake call (exit uncomfortable situations), pre-travel checklist
- **Resources**: Links to NCW, WCD, 112 India app, Sakhi One Stop Centres
- **About**: What Raksha is and how to use the app
- **AI chatbot** (bottom-right): Ask about emergency numbers, safety tips, legal rights, domestic violence helplines, and more

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Build for production

```bash
npm run build
npm run preview
```

## Tech stack

- React 18
- Vite 7
- React Router DOM
- CSS (no UI library)

## Project structure

- `src/App.jsx` – Main app and section layout
- `src/components/` – Navbar, Hero, SafetyTips, EmergencyContacts, SafetyTools, Resources, About, Footer, ChatBot
- `src/index.css` – Global styles and variables

The chatbot uses local, rule-based responses keyed to safety topics (no backend required). You can later connect it to your own AI API by replacing the logic in `ChatBot.jsx`.
