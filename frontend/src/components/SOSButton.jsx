import { useState, useEffect, useRef, useCallback } from 'react'
import './SOSButton.css'

export default function SOSButton() {
    const [phase, setPhase] = useState('idle') // idle | confirm | counting | triggered
    const [countdown, setCountdown] = useState(3)
    const timerRef = useRef(null)
    const sirenRef = useRef(null)

    // Helper to stop the loud police siren
    const stopSiren = useCallback(() => {
        if (sirenRef.current) {
            clearInterval(sirenRef.current.toggleFreq);
            if (sirenRef.current.autoStopTimer) {
                clearTimeout(sirenRef.current.autoStopTimer);
            }
            sirenRef.current.osc.stop();
            sirenRef.current.ctx.close();
            sirenRef.current = null;
        }
    }, []);

    // Helper to play a loud police siren
    const startSiren = useCallback(() => {
        if (sirenRef.current) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sawtooth'; // Sawtooth wave for a piercing, realistic siren sound
        gain.gain.value = 1.0; // Maximum volume
        
        osc.start();

        // Realistic police wail effect: continuously sweeping frequencies up and down
        const sweepSiren = () => {
            if (!sirenRef.current) return;
            const now = ctx.currentTime;
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.linearRampToValueAtTime(1500, now + 1.5);
            osc.frequency.linearRampToValueAtTime(600, now + 3.0);
        };

        sirenRef.current = { ctx, osc, toggleFreq: null, autoStopTimer: null }; // Temporarily assign so sweepSiren passes the check
        sweepSiren();
        const toggleFreq = setInterval(sweepSiren, 3000);
        
        // Auto-stop the siren after 10 seconds
        const autoStopTimer = setTimeout(() => {
            stopSiren();
        }, 10000);

        sirenRef.current.toggleFreq = toggleFreq;
        sirenRef.current.autoStopTimer = autoStopTimer;
    }, [stopSiren]);

    const handleEmergencyTrigger = useCallback((source = 'Manual') => {
        console.log(`SOS Triggered via: ${source}`);
        setPhase(prevPhase => {
            if (prevPhase === 'idle' || prevPhase === 'confirm') {
                startSiren();
                setCountdown(3);
                return 'counting';
            }
            return prevPhase;
        });
    }, [startSiren]);

    const handleSOSClick = () => {
        if (phase === 'idle') {
            setPhase('confirm')
        }
    }

    const handleConfirm = () => {
        handleEmergencyTrigger('Button Confirm');
    }

    const handleCancel = () => {
        setPhase('idle')
        setCountdown(3)
        clearInterval(timerRef.current)
        stopSiren()
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

    // --- Voice Recognition for Distress Keywords ---
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.log("Speech Recognition API not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        // Recognize both English and Hindi distress words easily
        recognition.lang = 'en-IN'; 

        const keywords = [
            // English
            'help', 'help me', 'emergency', 'save me', 'sos', 'police',
            'call the police', 'stop', 'leave me alone', 'let me go',
            'someone help', 'get away', "don't touch me", 'i need help',
            'danger', 'rape', 'kidnap', 'assault', 'attack', 'killer',
            'get out', 'no no no', 'stay back', 'back off', 'anybody there',
            // Hindi
            'bachao', 'madad karo', 'chhod do', 'mujhe chhod do', 'ruk jao',
            'koi hai', 'police ko bulao', 'hat jao', 'door raho', 
            'maro mat', 'bhaiya', 'darr lag raha hai', 'chillaungi', 
            'hath mat lagao', 'shor machaungi', 'kya kar rahe ho'
        ];

        recognition.onresult = (event) => {
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal || event.results[i][0].confidence > 0.5) {
                    const transcript = event.results[i][0].transcript.toLowerCase();
                    
                    for (const keyword of keywords) {
                        if (transcript.includes(keyword)) {
                            console.log(`Distress keyword detected: ${keyword}`);
                            handleEmergencyTrigger(`Voice Keyword: ${keyword}`);
                            break;
                        }
                    }
                }
            }
        };

        recognition.onerror = (event) => {
            console.warn('Speech recognition error:', event.error);
        };

        recognition.onend = () => {
            // Keep listening continuously
            try {
                recognition.start();
            } catch (err) {
                // Ignore if already started
            }
        };

        try {
            recognition.start();
            console.log("Voice recognition for distress words started.");
        } catch (err) {
            console.error("Failed to start voice recognition:", err);
        }

        return () => {
            recognition.onend = null; // Prevent restart loop on unmount
            recognition.abort();
        };
    }, []);
    // ------------------------------------------------

    // --- Unusual Loud Sound (Scream/Crash) Detection ---
    useEffect(() => {
        let audioContext;
        let analyser;
        let microphone;
        let animationFrame;

        const startAudioAnalysis = async () => {
            try {
                // We ask for audio stream again (can be shared with SpeechRecognition in most browsers)
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (!AudioContext) return;
                audioContext = new AudioContext();
                
                analyser = audioContext.createAnalyser();
                microphone = audioContext.createMediaStreamSource(stream);
                microphone.connect(analyser);

                analyser.fftSize = 256;
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                const checkLoudness = () => {
                    analyser.getByteFrequencyData(dataArray);
                    let sum = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        sum += dataArray[i];
                    }
                    const average = sum / bufferLength;
                    
                    // Threshold for "unusual loud sound": Needs tuning
                    // Normal speaking ~ 20-50. Shouting/Screams ~ 90-150 depending on mic sensitivity.
                    if (average > 105) { 
                        console.log("Unusual loud sound detected (volume level " + average + ")");
                        handleEmergencyTrigger('Loud Audio Detected');
                    }
                    
                    animationFrame = requestAnimationFrame(checkLoudness);
                };
                
                checkLoudness();
            } catch (err) {
                console.error("Failed to start audio analyzer for loudness detection", err);
            }
        };

        startAudioAnalysis();

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
            if (microphone) microphone.disconnect();
            if (audioContext) audioContext.close();
        };
    }, [handleEmergencyTrigger]);
    // ------------------------------------------------

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
