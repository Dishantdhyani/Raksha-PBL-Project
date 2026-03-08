import { useState } from 'react'
import Login from './components/Login'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import SafetyTips from './components/SafetyTips'
import EmergencyContacts from './components/EmergencyContacts'
import TrustedContacts from './components/TrustedContacts'
import SafetyTools from './components/SafetyTools'
import JourneyTracker from './components/JourneyTracker'
import SelfDefense from './components/SelfDefense'
import LegalRights from './components/LegalRights'
import Resources from './components/Resources'
import About from './components/About'
import Footer from './components/Footer'
import ChatBot from './components/ChatBot'
import SOSButton from './components/SOSButton'

function App() {
  const [user, setUser] = useState(null)   // null = not logged in
  const [chatOpen, setChatOpen] = useState(false)

  // ── Not logged in → show Login ──
  if (!user) {
    return <Login onLogin={setUser} />
  }

  // ── Logged in → show app ──
  return (
    <>
      <Navbar onLogout={() => setUser(null)} userRole={user.role} />
      <main>
        <Hero />
        <SafetyTips />
        <EmergencyContacts />
        <TrustedContacts />
        <SafetyTools />
        <JourneyTracker />
        <SelfDefense />
        <LegalRights />
        <Resources />
        <About />
      </main>
      <Footer />
      <ChatBot open={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
      <SOSButton />
    </>
  )
}

export default App
