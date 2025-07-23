import { useEffect, useRef } from 'react';
import Message from './Message'; // In a real project

const MessageList = ({ messages, isAuthReady, error }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <main className="app-main">
      <div className="messages-container">
        {error && <div className="error-message">{error}</div>}
        
        {!isAuthReady && !error && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Connecting to chat...</p>
          </div>
        )}

        <div className="message-list">
          {messages.map((msg) => (
            <Message key={msg.id} msg={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </main>
  );
};

export default MessageList;