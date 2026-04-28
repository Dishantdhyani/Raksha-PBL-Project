import { useState, useEffect, useRef } from 'react'
import './SafetyTools.css'

export default function SafetyTools() {
  const [callStatus, setCallStatus] = useState('idle') // idle | incoming | active
  const [callTimer, setCallTimer] = useState(0)
  const [callerName, setCallerName] = useState('Dad')

  const audioContextRef = useRef(null)
  const oscillatorRef = useRef(null)
  const gainRef = useRef(null)
  const intervalRef = useRef(null)
  const timerIntervalRef = useRef(null)

  const checklistItems = [
    { key: 'savedNumbers', label: '112 & 1091 saved in phone' },
    { key: 'locationShared', label: 'Live location shared with someone' },
    { key: 'charged', label: 'Phone charged' },
    { key: 'trustedContact', label: 'Trusted contact informed' },
  ]
  const [checklist, setChecklist] = useState({
    savedNumbers: false,
    locationShared: false,
    charged: false,
    trustedContact: false,
  })

  // Load checklist from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('raksha_checklist')
    if (saved) {
      setChecklist(JSON.parse(saved))
    }
  }, [])

  // Save checklist to localStorage
  const toggleCheck = (key) => {
    const newChecklist = { ...checklist, [key]: !checklist[key] }
    setChecklist(newChecklist)
    localStorage.setItem('raksha_checklist', JSON.stringify(newChecklist))
  }

  const resetChecklist = () => {
    console.log('Reset button clicked!')
    localStorage.removeItem('raksha_checklist')
    const resetList = {
      savedNumbers: false,
      locationShared: false,
      charged: false,
      trustedContact: false,
    }
    setChecklist(resetList)
    console.log('Checklist cleared:', resetList)
  }

  const completedCount = Object.values(checklist).filter(Boolean).length
  const totalCount = checklistItems.length
  const completionPercentage = Math.round((completedCount / totalCount) * 100)

  // Function to start ringing sound
  const startRinging = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }

      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }

      // Loop the ring pattern every 3 seconds
      const playRing = () => {
        const now = ctx.currentTime
        const osc1 = ctx.createOscillator()
        const osc2 = ctx.createOscillator()
        const gain = ctx.createGain()

        osc1.frequency.setValueAtTime(350, now) 
        osc2.frequency.setValueAtTime(440, now) 

        osc1.type = 'sine'
        osc2.type = 'sine'

        osc1.connect(gain)
        osc2.connect(gain)
        gain.connect(ctx.destination)

        gain.gain.setValueAtTime(0, now)

        // Ring for 0.8s, pause 0.2s, ring 0.8s
        gain.gain.linearRampToValueAtTime(0.8, now + 0.05)
        gain.gain.linearRampToValueAtTime(0, now + 0.8)
        gain.gain.linearRampToValueAtTime(0.8, now + 1.0)
        gain.gain.linearRampToValueAtTime(0, now + 1.8)

        osc1.start(now)
        osc1.stop(now + 2.0)
        osc2.start(now)
        osc2.stop(now + 2.0)

        if (navigator.vibrate) {
          navigator.vibrate([800, 200, 800])
        }

        oscillatorRef.current = { osc1, osc2 }
        gainRef.current = gain
      }

      playRing()
      intervalRef.current = setInterval(playRing, 3000)

    } catch (error) {
      console.log('Audio context not available', error)
    }
  }

  // Function to stop ringing sound
  const stopRinging = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    if (navigator.vibrate) navigator.vibrate(0)
    
    try {
      if (oscillatorRef.current && audioContextRef.current) {
        const now = audioContextRef.current.currentTime
        if (gainRef.current) {
          gainRef.current.gain.linearRampToValueAtTime(0, now + 0.1)
        }
      }
    } catch (error) {
      console.log('Error stopping oscillator', error)
    }
  }

  const triggerFakeCall = (delay = 0) => {
    if (delay > 0) {
      alert(`Fake call scheduled in ${delay} seconds. Put your phone away.`)
    }
    
    setTimeout(() => {
      setCallStatus('incoming')
      startRinging()
    }, delay * 1000)
  }

  const acceptCall = () => {
    stopRinging()
    setCallStatus('active')
    setCallTimer(0)
    timerIntervalRef.current = setInterval(() => {
      setCallTimer((prev) => prev + 1)
    }, 1000)
  }

  const endCall = () => {
    stopRinging()
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current)
    setCallStatus('idle')
    setCallTimer(0)
  }

  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0')
    const s = (seconds % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  return (
    <section id="tools" className="safety-tools">
      {/* ─── Fake Call UI Overlay ─── */}
      {callStatus !== 'idle' && (
        <div className="fake-call-overlay">
          <div className={`fake-call-screen ${callStatus}`}>
            <div className="fake-call-avatar">👤</div>
            <div className="fake-caller-name">{callerName}</div>
            
            {callStatus === 'incoming' ? (
              <div className="fake-call-status">Mobile • Incoming call</div>
            ) : (
              <div className="fake-call-status active-time">{formatTime(callTimer)}</div>
            )}
            
            <div className="fake-call-actions">
              {callStatus === 'incoming' && (
                <button className="fake-btn fake-btn-accept" onClick={acceptCall} title="Accept">
                  📞
                </button>
              )}
              <button className="fake-btn fake-btn-decline" onClick={endCall} title="Decline/End">
                ☎️
              </button>
            </div>
          </div>
        </div>
      )}
      <h2 className="section-title">Safety Tools</h2>
      <p className="section-subtitle">
        Use these quick tools to feel safer. Fake call can help you exit a situation without confrontation.
      </p>
      <div className="tools-grid">
        <div className="tool-card card">
          <h3>📞 Fake Call Engine</h3>
          <p>Schedule a realistic incoming call to help you exit an uncomfortable situation seamlessly.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <div className="fake-call-caller-select">
              <label>Caller ID:</label>
              <select value={callerName} onChange={(e) => setCallerName(e.target.value)}>
                <option value="Dad">Dad</option>
                <option value="Mom">Mom</option>
                <option value="Home">Home</option>
                <option value="Brother">Brother</option>
                <option value="Faculty">Faculty</option>
                <option value="Police">Police Inspector</option>
                <option value="Boss">Boss/Manager</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1 }}
                onClick={() => triggerFakeCall(0)}
                disabled={callStatus !== 'idle'}
              >
                Ring Now
              </button>
              <button
                className="btn btn-ghost"
                style={{ flex: 1, border: '1px solid currentColor' }}
                onClick={() => triggerFakeCall(10)}
                disabled={callStatus !== 'idle'}
              >
                In 10 sec
              </button>
            </div>
          </div>
        </div>
        <div className="tool-card card">
          <div className="checklist-header">
            <h3>✅ Pre-travel Checklist</h3>
            <button className="reset-btn" onClick={resetChecklist} title="Reset checklist">
              ↻
            </button>
          </div>
          <p>Before going out, tick these off for peace of mind.</p>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${completionPercentage}%`,
                transition: 'width 0.4s ease-out',
              }}
            />
          </div>
          <div className="progress-text">
            {completedCount} of {totalCount} completed
          </div>

          <ul className="checklist">
            {checklistItems.map(({ key, label }) => (
              <li key={key}>
                <button
                  className={`check-item ${checklist[key] ? 'done' : ''}`}
                  onClick={() => toggleCheck(key)}
                >
                  <span className="check-box">{checklist[key] ? '✓' : ''}</span>
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
