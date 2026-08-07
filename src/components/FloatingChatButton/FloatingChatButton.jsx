import { useState } from "react";
import AIChat from "../AIChat/AIChat";
import "./FloatingChatButton.css";

export default function FloatingChatButton({ weather }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      {isOpen && (
        <div className="chat-popup">
          <AIChat onClose={() => setIsOpen(false)} weather={weather} />
        </div>
      )}

      <button
        className="floating-chat-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Weather AI"
      >
        <span className="chat-icon">
          {isOpen ? "✕" : "🤖"}
        </span>

        {/* {!isOpen && (
          <span className="chat-label">
            Ask Weather AI
          </span> 
        )} */}
      </button>
    </>
  );
}