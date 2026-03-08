import { useState } from 'react'
import './LegalRights.css'

const rights = [
    {
        icon: '⚖️',
        color: '#7c3aed',
        title: 'Right against Domestic Violence',
        law: 'Protection of Women from Domestic Violence Act, 2005',
        points: [
            'Covers physical, sexual, verbal, emotional, and economic abuse.',
            'Right to reside in shared household even if not the owner.',
            'Protection orders, residence orders, and monetary relief available.',
            'Contact a Protection Officer or call 181 for assistance.',
        ],
    },
    {
        icon: '🏛️',
        color: '#0891b2',
        title: 'Right against Sexual Harassment',
        law: 'POSH Act, 2013 (Workplace)',
        points: [
            'Every organisation with 10+ employees must have an ICC.',
            'You can file a complaint within 3 months of the incident.',
            'Employer must complete inquiry within 90 days.',
            'Anonymous complaints are also accepted in many ICC setups.',
        ],
    },
    {
        icon: '🛡️',
        color: '#dc2626',
        title: 'Right after Sexual Assault',
        law: 'IPC Sections 375–376, CrPC Section 164',
        points: [
            'Medical examination must be free at government hospitals.',
            'Police must register FIR; refusal is a criminal offence.',
            'Statement can be recorded by female police officer.',
            'Identity of survivor is protected by law—no publication allowed.',
        ],
    },
    {
        icon: '💰',
        color: '#d97706',
        title: 'Right to Maintenance & Property',
        law: 'Hindu Marriage Act, Special Marriage Act, CrPC',
        points: [
            'Wife can claim maintenance during and after marriage.',
            'Daughter has equal coparcenary rights in ancestral property.',
            'Right to maintenance even after divorce under Section 125 CrPC.',
            'Stridhan (bridal gifts) belongs exclusively to the wife.',
        ],
    },
    {
        icon: '📋',
        color: '#059669',
        title: 'Right to Free Legal Aid',
        law: 'Legal Services Authorities Act, 1987',
        points: [
            'Women are entitled to free legal aid regardless of income.',
            'Available at District Legal Services Authority (DLSA) offices.',
            'Includes legal advice, representation, and mediation.',
            'Call 15100 (NLSA helpline) or visit your nearest court complex.',
        ],
    },
    {
        icon: '📱',
        color: '#f43f5e',
        title: 'Right against Cybercrime',
        law: 'IT Act 2000, IPC Sections 354C, 354D, 499',
        points: [
            'Online stalking and cyberstalking are punishable offences.',
            'Sharing intimate images without consent is a crime (Section 66E).',
            'Report cybercrime at cybercrime.gov.in or call 1930.',
            'Trolling, threatening, and morphed images are also actionable.',
        ],
    },
]

export default function LegalRights() {
    const [expanded, setExpanded] = useState(null)

    const toggle = (i) => setExpanded(expanded === i ? null : i)

    return (
        <section id="legal-rights" className="legal-rights">
            <div className="legal-top">
                <div className="legal-badge">⚖️ Know Your Rights</div>
                <h2 className="section-title">Your Legal Shield</h2>
                <p className="section-subtitle">
                    Every woman has powerful legal protections. Understanding your rights is your first line of defense.
                </p>
            </div>

            <div className="rights-grid">
                {rights.map((right, i) => (
                    <div
                        key={i}
                        className={`right-card ${expanded === i ? 'expanded' : ''}`}
                        style={{ '--card-color': right.color }}
                    >
                        <button className="right-card-header" onClick={() => toggle(i)}>
                            <div className="right-icon-wrap">
                                <span className="right-icon">{right.icon}</span>
                            </div>
                            <div className="right-info">
                                <h3 className="right-title">{right.title}</h3>
                                <span className="right-law">{right.law}</span>
                            </div>
                            <span className="right-chevron">{expanded === i ? '▲' : '▼'}</span>
                        </button>

                        <div className={`right-body ${expanded === i ? 'open' : ''}`}>
                            <ul className="right-points">
                                {right.points.map((pt, j) => (
                                    <li key={j}>
                                        <span className="right-bullet">✦</span>
                                        {pt}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>

            <div className="legal-footer-note">
                <span>💡</span>
                <span>
                    This information is for awareness only. For legal advice in your specific situation, contact{' '}
                    <a href="https://nalsa.gov.in" target="_blank" rel="noopener noreferrer">NALSA</a> or call{' '}
                    <strong>15100</strong>.
                </span>
            </div>
        </section>
    )
}
