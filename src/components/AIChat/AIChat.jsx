import { useEffect, useRef, useState } from "react";
import "./AIChat.css";

export default function AIChat({ weather, onClose }) {

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "👋 Hello!\n\nI'm your AI Weather Assistant.\n\nAsk me anything about today's weather.",
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typing]);

  /* -----------------------------
      Dynamic Suggestions
  ----------------------------- */

  const suggestions = weather
    ? [
        {
          icon: "🌧",
          label: "Rain",
          question: `Will it rain today in ${weather.city}?`,
        },
        {
          icon: "🌡",
          label: `${weather.temperature}°C`,
          question: `Explain today's temperature in ${weather.city}.`,
        },
        {
          icon: "💨",
          label: `${weather.windSpeed} m/s`,
          question: "How strong is today's wind?",
        },
        {
          icon: "💧",
          label: `${weather.humidity}%`,
          question: "Is today's humidity comfortable?",
        },
        {
          icon: "🌱",
          label: weather.airQuality?.quality || "AQI",
          question: "How is today's air quality?",
        },
        {
          icon: "☂",
          label: "Umbrella",
          question: "Should I carry an umbrella today?",
        },
      ]
    : [];

  /* -----------------------------
      Send Message
  ----------------------------- */

  const sendMessage = (text = input) => {
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text,
      },
    ]);

    setInput("");

    setTyping(true);

    setTimeout(() => {
      setTyping(false);

      let reply = "";

      if (weather) {
        reply =
          `📍 ${weather.city}, ${weather.country}\n\n` +
          `🌡 Temperature : ${weather.temperature}°C\n` +
          `🤗 Feels Like : ${weather.feelsLike}°C\n` +
          `💧 Humidity : ${weather.humidity}%\n` +
          `💨 Wind : ${weather.windSpeed} m/s\n` +
          `🌥 Weather : ${weather.description}\n` +
          `🌱 AQI : ${
            weather.airQuality?.quality || "Unavailable"
          }\n\n` +
          `🤖 AI Answer:\n` +
          `This is currently a demo response. Once Gemini/OpenAI API is connected, I'll answer your question intelligently using the latest weather data.`;
      } else {
        reply =
          "Weather data is not available yet. Please wait until the weather loads.";
      }

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: reply,
        },
      ]);
    }, 1200);
  };

  return (
    <div className="ai-chat">

      {/* Header */}

      <div className="chat-header">
        <div>
          <h2>🤖 Weather AI</h2>

          <small>
            <span className="online-dot"></span>
            AI Assistant Online
          </small>
        </div>

        <button
          className="close-btn"
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      {/* Suggestions */}

      {weather && (
        <div className="suggestions">
          {suggestions.map((item, index) => (
            <button
              key={index}
              onClick={() => sendMessage(item.question)}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}

      <div className="chat-body">

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender}`}
          >
            <div className="bubble">
              {msg.text}
            </div>
          </div>
        ))}

        {typing && (
          <div className="message bot">
            <div className="bubble typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef}></div>

      </div>

      {/* Footer */}

      <div className="chat-footer">

        <input
          type="text"
          placeholder="Ask anything about today's weather..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && sendMessage()
          }
        />

        <button
          onClick={() => sendMessage()}
          disabled={!input.trim()}
        >
          ➤
        </button>

      </div>

    </div>
  );
}