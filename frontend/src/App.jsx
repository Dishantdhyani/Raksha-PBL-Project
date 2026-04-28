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

import { Routes, Route } from 'react-router-dom'

// Layout for the main single-page sections
function MainHome() {
  return (
    <>
      <Hero />
      <EmergencyContacts />
      <TrustedContacts />
      <SafetyTools />
      <JourneyTracker />
    </>
  )
}

function App() {
  const [user, setUser] = useState(null)   // null = not logged in
  const [chatOpen, setChatOpen] = useState(false)

  // ── Not logged in → show Login ──
  if (!user) {
    return <Login onLogin={setUser} />
  }

  // Wrapper for standalone pages to ensure they are fully visible below the fixed navbar
  const PageWrapper = ({ children }) => (
    <div style={{ paddingTop: '64px', minHeight: '100vh' }}>
      {children}
    </div>
  )

  // ── Logged in → show app ──
  return (
    <>
      <Navbar onLogout={() => setUser(null)} userRole={user.role} userName={user.name} />
      <main>
        <Routes>
          <Route path="/" element={<MainHome />} />
          <Route path="/safety-tips" element={<PageWrapper><SafetyTips /></PageWrapper>} />
          <Route path="/self-defense" element={<PageWrapper><SelfDefense /></PageWrapper>} />
          <Route path="/legal-rights" element={<PageWrapper><LegalRights /></PageWrapper>} />
          <Route path="/resources" element={<PageWrapper><Resources /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        </Routes>
      </main>
      <Footer />
      <ChatBot open={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />
      <SOSButton />
    </>
  )
}

export default App
