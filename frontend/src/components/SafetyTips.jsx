import { useState } from 'react'
import './SafetyTips.css'

const tips = [
  {
    title: 'When traveling alone',
    items: [
      'Share your live location with a trusted contact before and during the trip.',
      'Avoid sharing travel plans on public social media until you have reached.',
      'Pre-book verified cabs; note vehicle number and share with family.',
      'Sit in the back seat and keep windows slightly open if possible.',
    ],
    icon: '🚕',
  },
  {
    title: 'At home & in public',
    items: [
      'Keep emergency numbers on speed dial: 112, 1091.',
      'Trust your instincts—if a place or person feels unsafe, leave.',
      'Carry a pepper spray or personal alarm where legally allowed.',
      'In crowded places, keep bags closed and valuables in front.',
    ],
    icon: '🏠',
  },
  {
    title: 'Online safety',
    items: [
      'Do not share live location or routine with strangers online.',
      'Use strong, unique passwords and enable two-factor authentication.',
      'Block and report harassing or abusive accounts.',
      'Be cautious with meeting someone you only know online; choose public places.',
    ],
    icon: '📱',
  },
  {
    title: 'Workplace & institutions',
    items: [
      'Know your organization\'s ICC (Internal Complaints Committee) and how to report.',
      'Keep written records of any harassment (dates, messages, witnesses).',
      'Reach out to 181 (Women Helpline) or NCW 14490 for guidance.',
      'You have the right to a safe workplace—do not hesitate to report.',
    ],
    icon: '💼',
  },
]

export default function SafetyTips() {
  const [expandedIndex, setExpandedIndex] = useState(null)

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <section id="safety-tips" className="safety-tips">
      <h2 className="section-title">Safety Tips</h2>
      <p className="section-subtitle">
        Practical advice to stay safe in different situations. Bookmark this page and share with friends.
      </p>
      <div className="tips-grid">
        {tips.map((tip, i) => (
          <div key={i} className={`tip-card card ${expandedIndex === i ? 'expanded' : ''}`}>
            <button
              className="tip-header-btn"
              onClick={() => toggleExpand(i)}
              aria-expanded={expandedIndex === i}
            >
              <div className="tip-header">
                <div className="tip-icon">{tip.icon}</div>
                <h3 className="tip-title">{tip.title}</h3>
              </div>
              <div className="expand-icon">{expandedIndex === i ? '−' : '+'}</div>
            </button>
            <ul className={`tip-list ${expandedIndex === i ? 'visible' : ''}`}>
              {tip.items.map((item, j) => (
                <li key={j}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
