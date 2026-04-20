import { useState, useEffect, useRef } from 'react'
import './SOSButton.css'

export default function SOSButton() {
    const [phase, setPhase] = useState('idle') // idle | confirm | counting | triggered
    const [countdown, setCountdown] = useState(3)
    const timerRef = useRef(null)

    const handleSOSClick = () => {
        if (phase === 'idle') {
            setPhase('confirm')
        }
    }

    const handleConfirm = () => {
        setPhase('counting')
        setCountdown(3)
    }

    const handleCancel = () => {
        setPhase('idle')
        setCountdown(3)
        clearInterval(timerRef.current)
    }

    const triggerBackendSOS = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                alert('You must be logged in to notify your contacts.')
                return
            }

            // Get location if possible
            let current_location = 'Location unknown'
            if (navigator.geolocation) {
                await new Promise((resolve) => {
                    navigator.geolocation.getCurrentPosition((pos) => {
                        current_location = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`
                        resolve()
                    }, () => {
                        resolve()
                    })
                })
            }

            const response = await fetch('http://localhost:5000/api/journeys/sos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ current_location })
            })

            const data = await response.json()
            if (response.ok) {
                alert('SOS Alert Sent to: ' + data.notify_contacts.join(', '))
            } else {
                alert('Failed to send SOS: ' + data.error)
            }
        } catch (err) {
            console.error(err)
            alert('Failed to reach the server to send SOS.')
        } finally {
            setPhase('idle')
        }
    }

    useEffect(() => {
        let interval;
        if (phase === 'counting') {
            interval = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(interval)
                        setPhase('triggered')
                        triggerBackendSOS()
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [phase])

    return (
        <>
            {/* Floating SOS Panic Button */}
            <button
                className={`sos-fab ${phase !== 'idle' ? 'sos-fab--active' : ''}`}
                onClick={handleSOSClick}
                aria-label="Emergency SOS - Notify Contacts"
                title="Emergency SOS"
            >
                <span className="sos-fab-icon">🆘</span>
                <span className="sos-fab-label">SOS</span>
                <span className="sos-fab-ring sos-fab-ring--1" />
                <span className="sos-fab-ring sos-fab-ring--2" />
            </button>

            {/* Confirm / Countdown Overlay */}
            {(phase === 'confirm' || phase === 'counting' || phase === 'triggered') && (
                <div className="sos-overlay" onClick={handleCancel}>
                    <div className="sos-modal" onClick={e => e.stopPropagation()}>
                        <div className="sos-modal-icon">🚨</div>
                        {phase === 'confirm' ? (
                            <>
                                <h2 className="sos-modal-title">Send SOS Alert?</h2>
                                <p className="sos-modal-desc">
                                    This will instantly message your <strong>Trusted Contacts</strong> with your current location via SMS.
                                </p>
                                <div className="sos-modal-actions">
                                    <button className="btn btn-accent sos-confirm-btn" onClick={handleConfirm}>
                                        ✅ Yes, Alert Now
                                    </button>
                                    <button className="btn btn-ghost sos-cancel-btn" onClick={handleCancel}>
                                        ✖ Cancel
                                    </button>
                                </div>
                            </>
                        ) : phase === 'triggered' ? (
                            <>
                                <h2 className="sos-modal-title">Sending Alert…</h2>
                                <p className="sos-modal-desc">Getting location and contacting the server...</p>
                            </>
                        ) : (
                            <>
                                <h2 className="sos-modal-title">Alerting Contacts in…</h2>
                                <div className="sos-countdown">{countdown}</div>
                                <p className="sos-modal-desc">Tap cancel to abort</p>
                                <button className="btn btn-ghost sos-cancel-btn" onClick={handleCancel}>
                                    ✖ Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
