import { useState, useRef, useEffect } from 'react'
import './Login.css'

// ─── Hardcoded Credentials (Admin only) ──────────────────────────────
const CREDENTIALS = {
    admin: {
        email: 'raksha@admin.com',
        password: 'admin@1234',
        code: '1234',
    },
}
// ─────────────────────────────────────────────────────────────────────

export default function Login({ onLogin }) {
    const [tab, setTab] = useState('user') // 'user' | 'admin'
    const [isSignUp, setIsSignUp] = useState(false) // Toggle inside 'user' tab
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [code, setCode] = useState(['', '', '', ''])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [shake, setShake] = useState(false)
    const codeRefs = [useRef(), useRef(), useRef(), useRef()]

    // Reset fields on tab or mode switch
    useEffect(() => {
        setName('')
        setEmail('')
        setPassword('')
        setCode(['', '', '', ''])
        setError('')
        setShowPass(false)
    }, [tab, isSignUp])

    const handleCodeInput = (value, i) => {
        if (!/^\d*$/.test(value)) return
        const newCode = [...code]
        newCode[i] = value.slice(-1)
        setCode(newCode)
        if (value && i < 3) codeRefs[i + 1].current?.focus()
    }

    const handleCodeKeyDown = (e, i) => {
        if (e.key === 'Backspace' && !code[i] && i > 0) {
            codeRefs[i - 1].current?.focus()
        }
    }

    const triggerError = (msg) => {
        setError(msg)
        setShake(true)
        setTimeout(() => setShake(false), 600)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        if (tab === 'user') {
            try {
                // Call actual backend API
                const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login'
                const body = isSignUp ? { name, email, password } : { email, password }

                const response = await fetch(`http://localhost:5000${endpoint}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                })

                const data = await response.json()

                if (response.ok) {
                    // Success! Save token and pass user data to parent App.jsx
                    localStorage.setItem('token', data.token)
                    onLogin({ role: 'user', ...data.user })
                } else {
                    triggerError(data.error || 'Something went wrong. Please try again.')
                }
            } catch (err) {
                console.error(err)
                triggerError('Failed to connect to the server. Is it running?')
            } finally {
                setLoading(false)
            }
        } else {
            // Admin logic (still hardcoded for demo purposes)
            setTimeout(() => {
                setLoading(false)
                const enteredCode = code.join('')
                if (
                    email.trim().toLowerCase() === CREDENTIALS.admin.email &&
                    password === CREDENTIALS.admin.password &&
                    enteredCode === CREDENTIALS.admin.code
                ) {
                    onLogin({ role: 'admin', email })
                } else if (email.trim().toLowerCase() !== CREDENTIALS.admin.email || password !== CREDENTIALS.admin.password) {
                    triggerError('Invalid admin email or password.')
                } else {
                    triggerError('Incorrect admin access code. Please try again.')
                }
            }, 900)
        }
    }

    const isFormValid = tab === 'user'
        ? (isSignUp ? name.trim() && email.trim() && password.length >= 6 : email.trim() && password.length >= 6)
        : email.trim() && password.length >= 6 && code.every(d => d !== '')

    return (
        <div className="login-root">
            {/* Animated background orbs */}
            <div className="login-bg">
                <div className="login-orb login-orb--1" />
                <div className="login-orb login-orb--2" />
                <div className="login-orb login-orb--3" />
                <div className="login-grid" />
            </div>

            <div className={`login-card ${shake ? 'login-card--shake' : ''}`}>
                {/* Brand */}
                <div className="login-brand">
                    <div className="login-logo">🛡️</div>
                    <h1 className="login-title">Raksha</h1>
                    <p className="login-tagline">Women Safety Platform</p>
                </div>

                {/* Tab selector */}
                <div className="login-tabs" role="tablist">
                    <button
                        role="tab"
                        aria-selected={tab === 'user'}
                        className={`login-tab ${tab === 'user' ? 'login-tab--active' : ''}`}
                        onClick={() => setTab('user')}
                    >
                        👤 User Login
                    </button>
                    <button
                        role="tab"
                        aria-selected={tab === 'admin'}
                        className={`login-tab ${tab === 'admin' ? 'login-tab--active' : ''}`}
                        onClick={() => setTab('admin')}
                    >
                        🔐 Admin Login
                    </button>
                </div>

                {/* Form */}
                <form className="login-form" onSubmit={handleSubmit} noValidate>
                    {/* Mode Toggle (only for User tab) */}
                    {tab === 'user' && (
                        <div className="login-mode-toggle">
                            <span 
                                className={`login-mode-btn ${!isSignUp ? 'active' : ''}`}
                                onClick={() => setIsSignUp(false)}
                            >
                                Sign In
                            </span>
                            <span 
                                className={`login-mode-btn ${isSignUp ? 'active' : ''}`}
                                onClick={() => setIsSignUp(true)}
                            >
                                Sign Up
                            </span>
                        </div>
                    )}

                    {/* Name (Only for User Sign Up) */}
                    {tab === 'user' && isSignUp && (
                        <div className="login-field">
                            <label className="login-label" htmlFor="login-name">Full Name</label>
                            <div className="login-input-wrap">
                                <span className="login-input-icon">👤</span>
                                <input
                                    id="login-name"
                                    type="text"
                                    className="login-input"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Email */}
                    <div className="login-field">
                        <label className="login-label" htmlFor="login-email">Email address</label>

                        <div className="login-input-wrap">
                            <span className="login-input-icon">✉️</span>
                            <input
                                id="login-email"
                                type="email"
                                className="login-input"
                                placeholder={tab === 'user' ? 'raksha@user.com' : 'raksha@admin.com'}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="login-field">
                        <label className="login-label" htmlFor="login-password">Password</label>
                        <div className="login-input-wrap">
                            <span className="login-input-icon">🔒</span>
                            <input
                                id="login-password"
                                type={showPass ? 'text' : 'password'}
                                className="login-input"
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                            <button
                                type="button"
                                className="login-toggle-pass"
                                onClick={() => setShowPass(!showPass)}
                                aria-label={showPass ? 'Hide password' : 'Show password'}
                            >
                                {showPass ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    {/* Admin code (only for admin tab) */}
                    {tab === 'admin' && (
                        <div className="login-field">
                            <label className="login-label">4-Digit Admin Access Code</label>
                            <div className="login-code-row">
                                {code.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={codeRefs[i]}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        className={`login-code-input ${digit ? 'login-code-input--filled' : ''}`}
                                        value={digit}
                                        onChange={e => handleCodeInput(e.target.value, i)}
                                        onKeyDown={e => handleCodeKeyDown(e, i)}
                                        aria-label={`Code digit ${i + 1}`}
                                    />
                                ))}
                            </div>
                            <p className="login-code-hint">Enter the 4-digit code provided by your administrator</p>
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="login-error" role="alert">
                            <span>⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        className={`btn btn-accent login-submit ${loading ? 'login-submit--loading' : ''}`}
                        disabled={!isFormValid || loading}
                    >
                        {loading ? (
                            <><span className="login-spinner" /> Verifying…</>
                        ) : (
                            <>{tab === 'user' ? (isSignUp ? '✨ Create Account' : '🚀 Sign In') : '🔐 Admin Access'}</>
                        )}
                    </button>
                </form>

                {/* Credentials hint */}
                <div className="login-hint-box">
                    <p className="login-hint-title">Demo credentials (Backend Demo)</p>
                    {tab === 'user' ? (
                        <div className="login-hint-creds">
                            <span>💡 <strong>Create a new account</strong> safely stored in the PostgreSQL database, or log in if you already created one.</span>
                        </div>
                    ) : (
                        <div className="login-hint-creds">
                            <span>📧 <strong>raksha@admin.com</strong></span>
                            <span>🔑 <strong>admin@1234</strong></span>
                            <span>🔢 Code: <strong>1234</strong></span>
                        </div>
                    )}
                </div>

                <p className="login-footer-note">
                    In an emergency, call <strong>112</strong> or <strong>1091</strong> — no login needed.
                </p>
            </div>
        </div>
    )
}
