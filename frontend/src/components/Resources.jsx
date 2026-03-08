import './Resources.css'

const resources = [
  {
    icon: '⚖️',
    title: 'National Commission for Women (NCW)',
    desc: 'Complaints, legal aid, and support for women. Helpline: 14490, 7827170170.',
    link: 'https://ncw.nic.in',
    linkLabel: 'Visit NCW',
  },
  {
    icon: '🏛️',
    title: 'Ministry of Women & Child Development',
    desc: 'Government schemes, One Stop Centres, and women welfare programs.',
    link: 'https://wcd.nic.in',
    linkLabel: 'Visit WCD',
  },
  {
    icon: '📱',
    title: '112 India App',
    desc: 'Pan-India emergency app with SHOUT feature and panic button.',
    link: 'https://112.gov.in',
    linkLabel: '112.gov.in',
  },
  {
    icon: '🏥',
    title: 'Sakhi One Stop Centres',
    desc: 'Emergency support, medical, legal, and counselling under one roof.',
    link: 'https://wcd.nic.in/schemes/one-stop-centre-osc',
    linkLabel: 'Know more',
  },
]

export default function Resources() {
  return (
    <section id="resources" className="resources">
      <h2 className="section-title">Resources & Support</h2>
      <p className="section-subtitle">
        Official helplines, apps, and organisations that can help. Reach out—you are not alone.
      </p>
      <div className="resources-grid">
        {resources.map((r, i) => (
          <div key={i} className="resource-card card">
            <div className="resource-icon">{r.icon}</div>
            <h3>{r.title}</h3>
            <p>{r.desc}</p>
            <a href={r.link} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              {r.linkLabel} →
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
