import "./AIChat.css";

export default function ChatMessage({
  sender,
  text,
}) {
  return (
    <div className={`message ${sender}`}>
      <div className="bubble">
        {text}
      </div>
    </div>
  );
}