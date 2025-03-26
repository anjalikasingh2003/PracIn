import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../styles/ChatBot.css';

function ChatBot({ darkMode }) {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I’m your FAANG DSA interviewer 👨‍💻. Let’s start when you’re ready.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMessage = { sender: 'user', text: input };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const payload = {
        messages: newMessages.map((msg) => ({
          role: msg.sender === 'bot' ? 'assistant' : 'user',
          content: msg.text,
        })),
      };

      const res = await axios.post('http://localhost:5000/ask', payload);

      const botResponse = {
        sender: 'bot',
        text: res.data.content,
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { sender: 'bot', text: '❌ Failed to get response. Try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`chatbot-container ${darkMode ? 'dark' : 'light'}`}>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`chat-bubble ${msg.sender}`}>
            <div className="bubble">{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div className="chat-bubble bot">
            <div className="bubble">💭 Thinking...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <textarea
          rows="1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>➤</button>
      </div>
    </div>
  );
}

export default ChatBot;
