import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import '../styles/ChatBot.css';

const speechKey = process.env.REACT_APP_AZURE_SPEECH_KEY;
const serviceRegion = process.env.REACT_APP_AZURE_REGION;

const inactivityInterval = 2 * 60 * 1000; // 2 minutes
const maxHints = 4;
const hintMessages = [
  "Still there? 😊 Let me know when you're ready!",
  "If you're stuck, feel free to ask for a hint! 💡",
  "Don't worry if it's tricky — I'm here to help! 💪",
  "Want to try the next one or need a small push? 🚀"
];

function ChatBot({ darkMode }) {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I’m your MAANG DSA interviewer 👨‍💻. Let’s start when you’re ready.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const inactivityTimerRef = useRef(null);
  const hintCountRef = useRef(0);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    resetInactivityTimer();
    hintCountRef.current = 0; // Reset hint count only once on mount
    return () => clearTimeout(inactivityTimerRef.current);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const speakText = (text) => {
    setIsSpeaking(true);
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(speechKey, serviceRegion);
    speechConfig.speechSynthesisVoiceName = 'en-US-JennyNeural';
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultSpeakerOutput();
    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);

    synthesizer.speakTextAsync(
      text,
      result => {
        if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
          console.log("Speech synthesis finished.");
        } else {
          console.error("Speech synthesis failed:", result.errorDetails);
        }
        setIsSpeaking(false);
        synthesizer.close();
      },
      error => {
        console.error(error);
        setIsSpeaking(false);
        synthesizer.close();
      }
    );
  };

  const listenToUser = () => {
    resetInactivityTimer();
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(speechKey, serviceRegion);
    speechConfig.speechRecognitionLanguage = 'en-US';
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    recognizer.recognizeOnceAsync(result => {
      if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {
        setInput(result.text);
        handleSend(result.text);
      } else {
        console.error('Speech not recognized.');
      }
    });
  };

  const isHintMessage = (text) => hintMessages.includes(text);

  const handleSend = async (customInput) => {
    resetInactivityTimer();

    const messageText = customInput || input;
    if (!messageText.trim()) return;

    const newUserMessage = { sender: 'user', text: messageText };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Filter out hint messages before sending to backend
      const filteredMessages = newMessages.filter((msg) => !isHintMessage(msg.text));

      const payload = {
        messages: filteredMessages.map((msg) => ({
          role: msg.sender === 'bot' ? 'assistant' : 'user',
          content: msg.text,
        })),
      };

      const res = await axios.post('http://localhost:5000/ask', payload);
      const botResponse = { sender: 'bot', text: res.data.content };

      setMessages((prev) => [...prev, botResponse]);
      speakText(res.data.content);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, {
        sender: 'bot',
        text: '❌ Failed to get response. Try again later.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimerRef.current);
    scheduleNextHint(); // Only reset timer, not hint count
  };

  const scheduleNextHint = () => {
    if (hintCountRef.current >= maxHints) return;

    inactivityTimerRef.current = setTimeout(() => {
      const hint = hintMessages[hintCountRef.current];
      const hintMessage = { sender: 'bot', text: hint };

      setMessages((prev) => [...prev, hintMessage]);
      speakText(hint);
      hintCountRef.current += 1;

      scheduleNextHint(); // Schedule next if under max
    }, inactivityInterval);
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
          onChange={(e) => {
            setInput(e.target.value);
            resetInactivityTimer();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your message..."
        />
        <button onClick={() => handleSend()}>➤</button>
        <button onClick={listenToUser} style={{ marginLeft: '10px' }}>🎙️</button>
      </div>
    </div>
  );
}

export default ChatBot;
