
const MessageInput = ({ value, onChange, onSubmit, isAuthReady }) => (
  <footer className="app-footer">
    <form onSubmit={onSubmit} className="message-form">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Type your anonymous message..."
        className="message-input"
        disabled={!isAuthReady}
      />
      <button
        type="submit"
        className="send-button"
        disabled={!isAuthReady || value.trim() === ''}
      >
        {/* SVG equivalent for ArrowUp */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5"/><path d="m5 12 7-7 7 7"/></svg>
      </button>
    </form>
  </footer>
);

export default MessageInput;

