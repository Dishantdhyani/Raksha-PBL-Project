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

    useEffect(() => {
        if (phase === 'counting') {
            timerRef.current = setInterval(() => {
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timerRef.current)
                        setPhase('triggered')
                        window.open('tel:112', '_self')
                        setTimeout(() => setPhase('idle'), 3000)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
        }
        return () => clearInterval(timerRef.current)
    }, [phase])

    return (
        <>
            {/* Floating SOS Panic Button */}
            <button
                className={`sos-fab ${phase !== 'idle' ? 'sos-fab--active' : ''}`}
                onClick={handleSOSClick}
                aria-label="Emergency SOS - Call 112"
                title="Emergency SOS"
            >
                <span className="sos-fab-icon">🆘</span>
                <span className="sos-fab-label">SOS</span>
                <span className="sos-fab-ring sos-fab-ring--1" />
                <span className="sos-fab-ring sos-fab-ring--2" />
            </button>

            {/* Confirm / Countdown Overlay */}
            {(phase === 'confirm' || phase === 'counting') && (
                <div className="sos-overlay" onClick={handleCancel}>
                    <div className="sos-modal" onClick={e => e.stopPropagation()}>
                        <div className="sos-modal-icon">🚨</div>
                        {phase === 'confirm' ? (
                            <>
                                <h2 className="sos-modal-title">Call Emergency (112)?</h2>
                                <p className="sos-modal-desc">
                                    This will dial <strong>112</strong> – India's national emergency number.<br />
                                    Only use in a genuine emergency situation.
                                </p>
                                <div className="sos-modal-actions">
                                    <button className="btn btn-accent sos-confirm-btn" onClick={handleConfirm}>
                                        ✅ Yes, Call Now
                                    </button>
                                    <button className="btn btn-ghost sos-cancel-btn" onClick={handleCancel}>
                                        ✖ Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 className="sos-modal-title">Calling 112 in…</h2>
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
