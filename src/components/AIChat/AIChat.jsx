import { useEffect, useRef, useState } from "react";
import "./AIChat.css";
import { sendChatMessage } from "../../services/chatService";
import { IoSend } from "react-icons/io5";
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
      {
        icon: "🌅",
        label: "Sunrise",
        question: "When is sunrise today?",
      },
      {
        icon: "🌇",
        label: "Sunset",
        question: "When is sunset today?",
      },
      {
        icon: "🏃",
        label: "Outdoor",
        question: "Is today good for outdoor activities?",
      },
    ]
  : [];

  /* -----------------------------
      Send Message
  ----------------------------- */

const sendMessage = async (text = input) => {
  if (!text.trim()) return;

  setMessages((prev) => [
    ...prev,
    {
      id: Date.now(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  setInput("");

  setTyping(true);

  try {
    const reply = await sendChatMessage(text, weather);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        sender: "bot",
        text: reply,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  } catch (err) {
    console.error(err);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        sender: "bot",
        text:
          "⚠ Sorry, I'm unable to connect to the AI service right now.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  } finally {
    setTyping(false);
  }
};

  // return (
  //   <div className="ai-chat">

  //     {/* Header */}

  //     <div className="chat-header">
  //       <div>
  //         <h2>🤖 Weather AI</h2>

  //         <small>
  //           <span className="online-dot"></span>
  //           AI Assistant Online
  //         </small>
  //       </div>

  //       <button
  //         className="close-btn"
  //         onClick={onClose}
  //       >
  //         ✕
  //       </button>
  //     </div>

  //     {/* Suggestions */}

  //     {weather && (
  //       <div className="suggestions">
  //         {suggestions.map((item, index) => (
  //           <button
  //             key={index}
  //             onClick={() => sendMessage(item.question)}
  //           >
  //             {item.icon} {item.label}
  //           </button>
  //         ))}
  //       </div>
  //     )}

  //     {/* Messages */}

  //     <div className="chat-body">

  //       {messages.map((msg, index) => (
  //         <div
  //           key={index}
  //           className={`message ${msg.sender}`}
  //         >
  //           <div className="bubble">
  //             {msg.text}
  //           </div>
  //         </div>
  //       ))}

  //       {typing && (
  //         <div className="message bot">
  //           <div className="bubble typing">
  //             <span></span>
  //             <span></span>
  //             <span></span>
  //           </div>
  //         </div>
  //       )}

  //       <div ref={messagesEndRef}></div>

  //     </div>

  //     {/* Footer */}

  //     <div className="chat-footer">

  //       <input
  //         type="text"
  //         placeholder="Ask anything about today's weather..."
  //         value={input}
  //         onChange={(e) => setInput(e.target.value)}
  //         onKeyDown={(e) =>
  //           e.key === "Enter" && sendMessage()
  //         }
  //       />

  //       <button
  //         onClick={() => sendMessage()}
  //         disabled={!input.trim()}
  //       >
  //         ➤
  //       </button>

  //     </div>

  //   </div>
  // );

  return (
  <div className="ai-chat">

    {/* ================= Header ================= */}

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

    {/* ================= Suggestions ================= */}

    {weather && (

      <div className="suggestions">

        {suggestions.map((item, index) => (

          <button
            key={index}
            onClick={() => sendMessage(item.question)}
          >

            <span>{item.icon}</span>

            {item.label}

          </button>

        ))}

      </div>

    )}

    {/* ================= Chat Body ================= */}

    <div className="chat-body">

      {messages.map((msg) => (


        <div
          key={msg.id}
          className={`message ${msg.sender}`}
        >
        
          {/* Avatar */}

          <div
            className={`avatar ${
              msg.sender === "bot"
                ? "bot-avatar"
                : "user-avatar"
            }`}
          >
            {msg.sender === "bot" ? "🤖" : "👤"}
          </div>
          
          {/* Bubble */}
          
          <div className="bubble-container">
          
            <div className="bubble">
          
              {msg.text.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}

            </div>
            
            <small className="time">
            
              {msg.time}
            
            </small>
            
          </div>
            
        </div>

      ))}

      {/* ================= Typing ================= */}

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

    {/* ================= Footer ================= */}

    <div className="chat-footer">

      <input
        type="text"
        placeholder="Ask anything about today's weather..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) =>
          e.key === "Enter" &&
          sendMessage()
        }
      />

      <button
        onClick={() => sendMessage()}
        disabled={!input.trim() || typing}
      >
        <IoSend />
      </button>

    </div>

    {/* ================= Footer Branding ================= */}

<div className="chat-branding">

  <span className="brand-icon">🌦️</span>

  <span className="brand-text">
    <strong>Nimbus AI</strong>
    <small>Powered by MyCityWeather</small>
  </span>

</div>

  </div>
);

}