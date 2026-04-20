import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import './ChatBot.css'

const QUICK_SUGGESTIONS = [
  { text: '🆘 Emergency', value: 'emergency' },
  { text: '🚗 Travel Safety', value: 'travel safety' },
  { text: '💻 Online Safety', value: 'online safety' },
  { text: '☎️ Helplines', value: 'helplines' },
]

async function fetchChatbotResponse(message) {
  try {
    const response = await fetch('http://localhost:5000/api/chatbot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    const data = await response.json();
    if (data.error) {
      if (data.error.includes("API key")) {
         return "I'm currently running in limited mode. To activate my full AI capabilities, please set up the GROQ_API_KEY in the backend.";
      }
      return "I'm sorry, I'm having trouble connecting to my service right now. Please try again later.";
    }
    return data.response;
  } catch (error) {
    console.error("Chatbot fetch error:", error);
    return "I'm offline right now. If you're in an emergency, please dial 112.";
  }
}

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

  const send = async () => {
    const trimmed = input.trim()
    if (!trimmed) return

    setInput('')
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }])
    setIsTyping(true)

    const reply = await fetchChatbotResponse(trimmed);
    setMessages((prev) => [...prev, { role: 'bot', text: reply }])
    setIsTyping(false)
  }

  const clearChat = () => {
    if (confirm('Clear all chat history?')) {
      setMessages([
        { role: 'bot', text: "Hi! I'm Raksha, your safety assistant. Ask me about emergency numbers, safety tips, or how to stay safe. How can I help?" },
      ])
      localStorage.removeItem('raksha_chat_history')
    }
  }

  const handleSuggestion = async (suggestion) => {
    setInput(suggestion)
    setMessages((prev) => [...prev, { role: 'user', text: suggestion }])
    setIsTyping(true)
    
    const reply = await fetchChatbotResponse(suggestion);
    setMessages((prev) => [...prev, { role: 'bot', text: reply }])
    setIsTyping(false)
    setInput('')
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
                <div className="msg-bubble bot">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
                </div>
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
