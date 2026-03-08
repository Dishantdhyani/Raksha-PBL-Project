import { useState, useEffect, useRef } from 'react'
import './SafetyTools.css'

export default function SafetyTools() {
  const [fakeCallOn, setFakeCallOn] = useState(false)
  const audioContextRef = useRef(null)
  const oscillatorRef = useRef(null)
  const gainRef = useRef(null)

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
      // Create audio context if not already created
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }

      const ctx = audioContextRef.current
      const now = ctx.currentTime

      // Create oscillators for realistic phone ringing
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      // Set frequencies for realistic phone ringing - classic telephone tones
      osc1.frequency.setValueAtTime(350, now) // Lower frequency
      osc2.frequency.setValueAtTime(440, now) // Standard telephone tone frequency

      // Set wave type
      osc1.type = 'sine'
      osc2.type = 'sine'

      // Connect to gain and then to speakers
      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)

      // Create pulsing ring pattern: "ring-ring, ring-ring" every 1 second
      // 0.8 seconds ON, 0.2 seconds OFF pattern
      gain.gain.setValueAtTime(0, now)

      // Create the ringing pattern for 10 seconds
      for (let i = 0; i < 10; i++) {
        const ringStart = now + i
        const ringDuration = 0.8 // Ring for 0.8 seconds
        const pauseDuration = 0.2 // Pause for 0.2 seconds

        // Ring ON
        gain.gain.linearRampToValueAtTime(0.8, ringStart + 0.05)
        // Ring OFF
        gain.gain.linearRampToValueAtTime(0, ringStart + ringDuration)
      }

      // Ensure it's off at the end
      gain.gain.setValueAtTime(0, now + 10)

      // Start oscillators
      osc1.start(now)
      osc2.start(now + 10)

      // Store references to stop later
      oscillatorRef.current = { osc1, osc2 }
      gainRef.current = gain

      // Stop after 10 seconds
      setTimeout(() => {
        stopRinging()
      }, 10000)

      // Haptic feedback on mobile - pulse with the ring pattern
      if (navigator.vibrate) {
        // Ring-ring pattern: 200ms on, 100ms off, repeated
        navigator.vibrate([200, 100, 200, 100, 200, 100, 200, 100, 200, 100, 200, 100, 200, 100, 200, 100, 200, 100, 200, 100])
      }
    } catch (error) {
      console.log('Audio context not available')
    }
  }

  // Function to stop ringing sound
  const stopRinging = () => {
    try {
      if (oscillatorRef.current && audioContextRef.current) {
        const now = audioContextRef.current.currentTime
        oscillatorRef.current.osc1.stop(now)
        oscillatorRef.current.osc2.stop(now)
        oscillatorRef.current = null
      }
    } catch (error) {
      console.log('Error stopping oscillator')
    }
  }

  const triggerFakeCall = () => {
    setFakeCallOn(true)
    startRinging()

    setTimeout(() => {
      stopRinging()
      alert('Incoming call simulation ended. Use this to leave an uncomfortable situation.')
      setFakeCallOn(false)
    }, 10500)
  }

  return (
    <section id="tools" className="safety-tools">
      <h2 className="section-title">Safety Tools</h2>
      <p className="section-subtitle">
        Use these quick tools to feel safer. Fake call can help you exit a situation without confrontation.
      </p>
      <div className="tools-grid">
        <div className="tool-card card">
          <h3>📞 Fake Call</h3>
          <p>Simulate an incoming call to leave a situation. Your phone will vibrate and ring.</p>
          <button
            className={`btn ${fakeCallOn ? 'btn-ghost' : 'btn-primary'}`}
            onClick={triggerFakeCall}
            disabled={fakeCallOn}
          >
            {fakeCallOn ? '📳 Ringing...' : 'Trigger fake call'}
          </button>
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
