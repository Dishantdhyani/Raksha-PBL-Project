import { useState } from 'react'
import './SelfDefense.css'

const techniques = [
    {
        icon: '✋',
        color: '#f43f5e',
        title: 'Palm Heel Strike',
        difficulty: 'Beginner',
        target: 'Face / Nose',
        steps: [
            'Keep your fingers bent back, palm flat and firm.',
            'Aim the heel of your palm at the assailant\'s nose or chin.',
            'Push explosively forward with your bodyweight behind it.',
            'Pull back immediately and create distance.',
        ],
        tip: 'Harder and safer than a fist — no risk of breaking your fingers.',
    },
    {
        icon: '💪',
        color: '#7c3aed',
        title: 'Elbow Strike',
        difficulty: 'Beginner',
        target: 'Face / Ribs',
        steps: [
            'Bend your arm so your elbow is your striking point.',
            'Drive your elbow forward, sideways, or backward as needed.',
            'Use for close-range situations — it\'s your strongest joint.',
            'Target the face, temple, or ribs for maximum effect.',
        ],
        tip: 'Most effective when grabbed from behind or in very close range.',
    },
    {
        icon: '🦵',
        color: '#0891b2',
        title: 'Groin Kick',
        difficulty: 'Beginner',
        target: 'Groin',
        steps: [
            'Raise your knee first to generate power.',
            'Drive your foot upward into the groin with speed.',
            'Alternatively, use your knee directly for close-range.',
            'Run immediately after — don\'t wait.',
        ],
        tip: 'Extremely effective for creating space to escape. Always follow up by running.',
    },
    {
        icon: '👁️',
        color: '#d97706',
        title: 'Eye Gouge / Jab',
        difficulty: 'Intermediate',
        target: 'Eyes',
        steps: [
            'Use your thumbs or fingers directed at the eyes.',
            'Even the threat of this move causes most attackers to back off.',
            'A quick jab or waving motion toward the eyes causes flinching.',
            'Use only in genuine danger — this is a last resort.',
        ],
        tip: 'Even a fake jab toward the eyes will cause most people to instinctively recoil.',
    },
    {
        icon: '🤲',
        color: '#059669',
        title: 'Wrist Escape',
        difficulty: 'Beginner',
        target: 'Wrist Grab',
        steps: [
            'When grabbed, rotate your wrist toward the attacker\'s thumb side.',
            'The thumb is the weakest point of any grip.',
            'Pull your arm sharply through that gap.',
            'Step back and create distance immediately.',
        ],
        tip: 'Works against both single and double-hand wrist grabs. Practice this regularly.',
    },
    {
        icon: '📢',
        color: '#6366f1',
        title: 'Voice & Awareness',
        difficulty: 'Always-on',
        target: 'Prevention',
        steps: [
            'Trust your gut — if a situation feels wrong, leave early.',
            'Shout "FIRE!" loudly — it draws more attention than "Help".',
            'Maintain confident posture and awareness in public.',
            'Keep a hand free and avoid headphones in unfamiliar areas.',
        ],
        tip: '"FIRE!" triggers faster response from bystanders than any other word.',
    },
]

const tools = [
    { icon: '🌶️', name: 'Pepper Spray', note: 'Legal in India. Keep in reachable pocket, not buried in bag.' },
    { icon: '🔔', name: 'Personal Alarm', note: 'Emits 120dB+ siren. Clips onto bag or keychain.' },
    { icon: '🗝️', name: 'Key Knuckles', note: 'Hold keys between fingers as a defensive tool.' },
    { icon: '💡', name: 'Flashlight', note: 'Tactical flashlight can disorient attacker & be used as a strike tool.' },
]

export default function SelfDefense() {
    const [expanded, setExpanded] = useState(null)

    const difficultyColor = (d) => {
        if (d === 'Beginner') return '#22c55e'
        if (d === 'Intermediate') return '#f59e0b'
        return '#818cf8'
    }

    return (
        <section id="self-defense" className="self-defense">
            {/* Header */}
            <div className="sd-header">
                <div className="sd-badge">🥋 Self-Defense</div>
                <h2 className="section-title">Protect Yourself</h2>
                <p className="section-subtitle">
                    Basic techniques every woman should know. Practice these moves so they become instinct — your body is your first safety tool.
                </p>
            </div>

            {/* Techniques grid */}
            <div className="sd-grid">
                {techniques.map((t, i) => (
                    <div
                        key={i}
                        className={`sd-card ${expanded === i ? 'sd-card--open' : ''}`}
                        style={{ '--card-accent': t.color }}
                    >
                        <button className="sd-card-header" onClick={() => setExpanded(expanded === i ? null : i)}>
                            <div className="sd-icon-wrap">
                                <span className="sd-icon">{t.icon}</span>
                            </div>
                            <div className="sd-meta">
                                <h3 className="sd-title">{t.title}</h3>
                                <div className="sd-tags">
                                    <span className="sd-tag sd-tag--target">🎯 {t.target}</span>
                                    <span
                                        className="sd-tag sd-tag--diff"
                                        style={{ color: difficultyColor(t.difficulty), borderColor: difficultyColor(t.difficulty) + '44', background: difficultyColor(t.difficulty) + '18' }}
                                    >
                                        {t.difficulty}
                                    </span>
                                </div>
                            </div>
                            <span className="sd-chevron">{expanded === i ? '▲' : '▼'}</span>
                        </button>

                        <div className={`sd-body ${expanded === i ? 'sd-body--open' : ''}`}>
                            <ol className="sd-steps">
                                {t.steps.map((step, j) => (
                                    <li key={j}>
                                        <span className="sd-step-num">{j + 1}</span>
                                        {step}
                                    </li>
                                ))}
                            </ol>
                            <div className="sd-tip">
                                <span className="sd-tip-icon">💡</span>
                                <span>{t.tip}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Safety tools */}
            <div className="sd-tools-section">
                <h3 className="sd-tools-title">🛡️ Carry These Safety Tools</h3>
                <div className="sd-tools-grid">
                    {tools.map((tool, i) => (
                        <div key={i} className="sd-tool-card">
                            <span className="sd-tool-icon">{tool.icon}</span>
                            <div>
                                <strong className="sd-tool-name">{tool.name}</strong>
                                <p className="sd-tool-note">{tool.note}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Disclaimer */}
            <div className="sd-disclaimer">
                <span>⚠️</span>
                <span>
                    These techniques are for emergency self-defense situations only.
                    Consider enrolling in a certified self-defense class (e.g., Krav Maga, Wing Chun, or local women's martial arts programs) for hands-on training.
                </span>
            </div>
        </section>
    )
}
