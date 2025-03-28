import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import * as SpeechSDK from 'microsoft-cognitiveservices-speech-sdk';
import '../styles/ChatBot.css';

const speechKey = process.env.REACT_APP_AZURE_SPEECH_KEY;
const serviceRegion = process.env.REACT_APP_AZURE_REGION;

function ChatBot({ darkMode, code }) {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I’m your MAANG DSA interviewer 👨‍💻. Let’s start when you’re ready.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

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

  const handleSend = async (customInput) => {
    const messageText = customInput || input;
    if (!messageText.trim()) return;

    const newUserMessage = { sender: 'user', text: messageText };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Check for code review command
      if (
        messageText.toLowerCase().includes("review my code") ||
        messageText.toLowerCase().includes("give feedback on my code") ||
        messageText.toLowerCase().includes("analyze my code")
      ) {
        const reviewRes = await axios.post('http://localhost:5002/review-code', {
          code: code || "// No code provided.",
          language: 'cpp' // Make this dynamic later if needed
        });

        const botResponse = { sender: 'bot', text: reviewRes.data.content };
        setMessages((prev) => [...prev, botResponse]);
        speakText(reviewRes.data.content);
        return;
      }

      // Default chat flow
      const lastBotMessage = messages.slice().reverse().find(msg => msg.sender === 'bot');
      const payload = {
        question: lastBotMessage?.text || '',
        answer: messageText,
      };

      const res = await axios.post('http://localhost:5002/ask', payload);
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
