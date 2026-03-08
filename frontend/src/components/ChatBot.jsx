import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import './ChatBot.css'

const SAFETY_RESPONSES = {
  default: "I'm Raksha, your safety assistant. You can ask me about: emergency numbers (112, 1091), safety tips, domestic violence helplines, legal rights, or how to share your location. How can I help you?",
  emergency: "In an emergency, call **112** (pan-India) or **1091** (women helpline) immediately. If you're in danger, try to get to a safe, public place and share your location with a trusted contact using the 'Share my location' button on this site.",
  '112': "**112** is India's single emergency number for police, fire, and medical help. It works 24/7 across India. You can also use the 112 India app or press the power button 3 times on many smartphones to trigger a panic alert.",
  '1091': "**1091** is the national women's helpline run by police. It's toll-free and 24/7. Use it for domestic violence, harassment, assault, or if you feel unsafe. They can guide you and connect you to support services.",
  helpline: "Key helplines: **112** (emergency), **1091** (women police), **181** (domestic violence), **14490** (NCW). Save these in your phone. All are toll-free except the NCW direct line 7827170170.",
  tips: "Here are quick safety tips: (1) Share live location with someone you trust when traveling. (2) Save 112 and 1091 on speed dial. (3) Trust your instincts—leave if a place or person feels unsafe. (4) Use the fake call tool on this site to exit uncomfortable situations. Want more tips? Ask 'travel safety' or 'online safety'.",
  'travel safety': "When traveling: share your ride details and live location with a trusted contact, sit in the back seat, note the vehicle number, and avoid posting travel plans on social media until you've reached. Use the pre-travel checklist in the Safety Tools section.",
  'online safety': "Online: don't share your live location or daily routine with strangers. Use strong passwords and 2FA. Block and report harassing accounts. If meeting someone you only know online, choose a public place and tell a friend.",
  domestic: "If you're facing domestic violence, you're not alone. Call **181** (Domestic Violence Helpline) or **1091**. You can also contact NCW on **14490**. One Stop Centres (Sakhi) offer medical, legal, and counselling support—see the Resources section for links.",
  legal: "You have legal rights under laws like the Protection of Women from Domestic Violence Act, IPC sections on assault and harassment, and workplace sexual harassment laws (POSH). For specific advice, contact NCW (14490) or a local legal aid cell. I can't give legal advice, but I can point you to resources.",
  location: "To share your location: use the **Share my location** button on the home section of this page. It will get your current position and let you share it via your phone's share menu or copy the link to send to a trusted contact.",
  hi: "Hello! I'm here to help with safety information and support. Ask me about emergency numbers, safety tips, or what to do in a difficult situation.",
  thank: "You're welcome. Stay safe. Remember: 112 and 1091 are there for you 24/7. If you need more help, just ask.",
}

function getBotResponse(input) {
  const lower = input.toLowerCase().trim()
  if (!lower) return SAFETY_RESPONSES.default

  if (/hi|hello|hey|namaste/.test(lower)) return SAFETY_RESPONSES.hi
  if (/thank|thanks|bye/.test(lower)) return SAFETY_RESPONSES.thank
  if (/emergency|danger|help me|unsafe/.test(lower)) return SAFETY_RESPONSES.emergency
  if (/\b112\b/.test(lower)) return SAFETY_RESPONSES['112']
  if (/\b1091\b/.test(lower)) return SAFETY_RESPONSES['1091']
  if (/helpline|number|contact|phone/.test(lower)) return SAFETY_RESPONSES.helpline
  if (/tip|advice|suggest|safe/.test(lower) && !/travel|online|domestic|legal|location/.test(lower)) return SAFETY_RESPONSES.tips
  if (/travel|travelling|cab|ride/.test(lower)) return SAFETY_RESPONSES['travel safety']
  if (/online|internet|social|harass/.test(lower)) return SAFETY_RESPONSES['online safety']
  if (/domestic|violence|abuse|family/.test(lower)) return SAFETY_RESPONSES.domestic
  if (/legal|right|law|complaint/.test(lower)) return SAFETY_RESPONSES.legal
  if (/location|share location|where am i/.test(lower)) return SAFETY_RESPONSES.location

  return SAFETY_RESPONSES.default
}

function formatMessage(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}

const QUICK_SUGGESTIONS = [
  { text: '🆘 Emergency', value: 'emergency' },
  { text: '🚗 Travel Safety', value: 'travel safety' },
  { text: '💻 Online Safety', value: 'online safety' },
  { text: '☎️ Helplines', value: 'helplines' },
]

export default function ChatBot({ open, onToggle }) {
  const [messages, setMessages] = useState([
    { role: 'bot', text: "Hi! I'm Raksha, your safety assistant. Ask me about emergency numbers, safety tips, or how to stay safe. How can I help?" },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const endRef = useRef(null)

  // Load chat history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('raksha_chat_history')
    if (saved) {
      setMessages(JSON.parse(saved))
    }
  }, [])

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    localStorage.setItem('raksha_chat_history', JSON.stringify(messages))
  }, [messages])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const send = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }])
    setIsTyping(true)

    setTimeout(() => {
      const reply = getBotResponse(trimmed)
      setMessages((prev) => [...prev, { role: 'bot', text: reply }])
      setIsTyping(false)
    }, 600)
  }

  const clearChat = () => {
    if (confirm('Clear all chat history?')) {
      setMessages([
        { role: 'bot', text: "Hi! I'm Raksha, your safety assistant. Ask me about emergency numbers, safety tips, or how to stay safe. How can I help?" },
      ])
      localStorage.removeItem('raksha_chat_history')
    }
  }

  const handleSuggestion = (suggestion) => {
    setInput(suggestion)
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'user', text: suggestion }])
      setIsTyping(true)
      setTimeout(() => {
        const reply = getBotResponse(suggestion)
        setMessages((prev) => [...prev, { role: 'bot', text: reply }])
        setIsTyping(false)
      }, 600)
    }, 0)
  }

  return createPortal(
    <div className={`chatbot-wrapper ${open ? 'open' : ''}`}>
      <button className="chatbot-toggle" onClick={onToggle} aria-label={open ? 'Close Raksha Assistant' : 'Open Raksha Assistant'}>
        <span className="chatbot-toggle-icon">{open ? '✕' : '💬'}</span>
      </button>
      <div className="chatbot-window card">
        <div className="chatbot-header">
          <div className="chatbot-header-content">
            <span className="chatbot-title">🛡️ Raksha Assistant</span>
            <p className="chatbot-subtitle">Safety info & support 24/7</p>
          </div>
          <button className="chatbot-clear" onClick={clearChat} title="Clear chat" aria-label="Clear chat history">
            🗑️
          </button>
        </div>
        <div className="chatbot-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role}`}>
              {m.role === 'bot' ? (
                <div className="msg-bubble bot" dangerouslySetInnerHTML={{ __html: formatMessage(m.text) }} />
              ) : (
                <div className="msg-bubble user">{m.text}</div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="chat-msg bot">
              <div className="msg-bubble bot typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
        {messages.length <= 1 && (
          <div className="chatbot-suggestions">
            {QUICK_SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion.value}
                className="suggestion-btn"
                onClick={() => handleSuggestion(suggestion.value)}
              >
                {suggestion.text}
              </button>
            ))}
          </div>
        )}
        <div className="chatbot-input-wrap">
          <input
            type="text"
            placeholder="Ask about safety, emergency numbers..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send()}
            className="chatbot-input"
          />
          <button className="chatbot-send btn btn-primary" onClick={send}>
            Send
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('chatbot-portal') || document.body
  )
}
