import { useState, useEffect, useRef } from 'react'
import './JourneyTracker.css'

export default function JourneyTracker() {
    const [minutes, setMinutes] = useState(30)
    const [running, setRunning] = useState(false)
    const [secondsLeft, setSecondsLeft] = useState(null)
    const [status, setStatus] = useState('idle') // idle | running | safe | alert
    const [destination, setDestination] = useState('')
    const timerRef = useRef(null)

    const totalSeconds = minutes * 60

    // Format seconds as mm:ss
    const fmt = (s) => {
        const m = Math.floor(s / 60).toString().padStart(2, '0')
        const sec = (s % 60).toString().padStart(2, '0')
        return `${m}:${sec}`
    }

    const start = () => {
        if (minutes < 1 || minutes > 180) return
        setSecondsLeft(minutes * 60)
        setRunning(true)
        setStatus('running')
    }

    const markSafe = () => {
        clearInterval(timerRef.current)
        setRunning(false)
        setStatus('safe')
        // share location as safety check-in
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords
                const url = `https://www.google.com/maps?q=${latitude},${longitude}`
                const text = `✅ I'm safe! Current location: ${url}`
                if (navigator.share) {
                    navigator.share({ title: "I'm Safe – Raksha", text, url }).catch(() => {
                        navigator.clipboard.writeText(text)
                    })
                } else {
                    navigator.clipboard.writeText(text)
                    alert('Safety check-in location copied to clipboard. Share it with your trusted contacts.')
                }
            }, () => {
                alert("✅ You marked yourself as safe! (Location permission was not granted.)")
            })
        } else {
            alert("✅ You marked yourself as safe!")
        }
    }

    const reset = () => {
        clearInterval(timerRef.current)
        setRunning(false)
        setSecondsLeft(null)
        setStatus('idle')
        setDestination('')
    }

    useEffect(() => {
        if (running && secondsLeft !== null) {
            timerRef.current = setInterval(() => {
                setSecondsLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current)
                        setRunning(false)
                        setStatus('alert')
                        // Browser notification
                        if ('Notification' in window && Notification.permission === 'granted') {
                            new Notification('🚨 Raksha – Journey Timer Expired!', {
                                body: 'Your safety timer has ended. Are you safe? Please check in.',
                                icon: '/vite.svg',
                            })
                        }
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => clearInterval(timerRef.current)
    }, [running])

    const requestNotificationPermission = () => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission()
        }
    }

    const progressPct = secondsLeft !== null
        ? Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100)
        : 0

    const radius = 54
    const circ = 2 * Math.PI * radius
    const dashOffset = circ - (progressPct / 100) * circ

    return (
        <section id="journey-tracker" className="journey-tracker">
            <div className="jt-header">
                <div className="jt-badge">🗺️ Journey Safety</div>
                <h2 className="section-title">Journey Safety Timer</h2>
                <p className="section-subtitle">
                    Set a timer for your trip. If you don't check in before it ends, you'll get an alert to confirm you're safe.
                </p>
            </div>

            <div className="jt-card card">
                <div className="jt-body">
                    {/* Left: Setup / Status */}
                    <div className="jt-setup">
                        {status === 'idle' && (
                            <>
                                <label className="jt-label">
                                    Destination (optional)
                                    <input
                                        className="jt-input"
                                        type="text"
                                        placeholder="e.g. Mom's house, Office…"
                                        value={destination}
                                        onChange={e => setDestination(e.target.value)}
                                        maxLength={60}
                                    />
                                </label>
                                <label className="jt-label">
                                    Journey duration (minutes)
                                    <div className="jt-minutes-row">
                                        <button className="jt-adj-btn" onClick={() => setMinutes(m => Math.max(5, m - 5))}>−</button>
                                        <input
                                            type="number"
                                            className="jt-minutes-input"
                                            value={minutes}
                                            min={5}
                                            max={180}
                                            onChange={e => setMinutes(Number(e.target.value))}
                                        />
                                        <button className="jt-adj-btn" onClick={() => setMinutes(m => Math.min(180, m + 5))}>+</button>
                                    </div>
                                </label>
                                <div className="jt-presets">
                                    {[15, 30, 45, 60, 90].map(m => (
                                        <button
                                            key={m}
                                            className={`jt-preset-btn ${minutes === m ? 'active' : ''}`}
                                            onClick={() => setMinutes(m)}
                                        >{m}m</button>
                                    ))}
                                </div>
                                <button
                                    className="btn btn-primary jt-start-btn"
                                    onClick={() => { start(); requestNotificationPermission() }}
                                    disabled={minutes < 5 || minutes > 180}
                                >
                                    🚀 Start Journey Timer
                                </button>
                            </>
                        )}

                        {(status === 'running') && (
                            <div className="jt-running-info">
                                {destination && (
                                    <div className="jt-dest-badge">📍 Going to: <strong>{destination}</strong></div>
                                )}
                                <p className="jt-running-text">Timer is active. Stay safe!</p>
                                <button className="btn btn-accent jt-safe-btn" onClick={markSafe}>
                                    ✅ I'm Safe – Check In
                                </button>
                                <button className="btn btn-ghost jt-reset-btn" onClick={reset}>
                                    ✖ Cancel Journey
                                </button>
                            </div>
                        )}

                        {status === 'safe' && (
                            <div className="jt-result safe">
                                <div className="jt-result-icon">✅</div>
                                <h3>You're safe!</h3>
                                <p>Your check-in was recorded and location shared.</p>
                                <button className="btn btn-primary" onClick={reset}>New Journey</button>
                            </div>
                        )}

                        {status === 'alert' && (
                            <div className="jt-result alert">
                                <div className="jt-result-icon">🚨</div>
                                <h3>Timer Expired!</h3>
                                <p>Your journey time ended. Please check in or contact someone.</p>
                                <button className="btn btn-accent jt-safe-btn" onClick={markSafe}>
                                    ✅ I'm Safe Now
                                </button>
                                <button className="btn btn-ghost" onClick={reset}>Reset</button>
                            </div>
                        )}
                    </div>

                    {/* Right: Circular Progress Timer */}
                    <div className="jt-timer-visual">
                        <svg className="jt-ring" viewBox="0 0 120 120" width="160" height="160">
                            <circle
                                cx="60" cy="60" r={radius}
                                className="jt-ring-bg"
                                fill="none"
                                strokeWidth="8"
                            />
                            <circle
                                cx="60" cy="60" r={radius}
                                className={`jt-ring-fill ${status === 'alert' ? 'alert' : status === 'safe' ? 'safe' : ''}`}
                                fill="none"
                                strokeWidth="8"
                                strokeDasharray={circ}
                                strokeDashoffset={status === 'idle' ? circ : dashOffset}
                                strokeLinecap="round"
                                transform="rotate(-90 60 60)"
                                style={{ transition: 'stroke-dashoffset 1s linear' }}
                            />
                        </svg>
                        <div className="jt-ring-label">
                            {status === 'idle' && <span className="jt-idle-label">Ready</span>}
                            {status === 'running' && <span className="jt-time-display">{fmt(secondsLeft)}</span>}
                            {status === 'safe' && <span className="jt-safe-label">Safe ✅</span>}
                            {status === 'alert' && <span className="jt-alert-label">!!! 🚨</span>}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
