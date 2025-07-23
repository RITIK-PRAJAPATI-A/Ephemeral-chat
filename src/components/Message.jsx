const Message = ({ msg }) => {
  const userColor = (userId) => {
    const colors = [
      '#f87171', '#4ade80', '#60a5fa', '#facc15',
      '#a78bfa', '#f472b6', '#6366f1', '#2dd4bf'
    ];
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };
  
  const colorStyle = { color: userColor(msg.userId) };

  return (
    <div className="message-item">
      <div className="message-avatar" style={colorStyle}>
        {msg.userId.substring(5, 7)}
      </div>
      <div className="message-content">
        <div className="message-header">
          <span className="message-user-id" style={colorStyle}>{msg.userId}</span>
          <span className="message-timestamp">
            {msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="message-bubble">
          <p className="message-text">{msg.text}</p>
        </div>
      </div>
    </div>
  );
};


export default Message;