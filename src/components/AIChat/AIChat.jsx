import { useEffect, useRef, useState } from "react";
import "./AIChat.css";

// import { sendChatMessage } from "../../services/chatService";
import { sendChatMessage } from "../../services/OpenAIService";

import { IoSend } from "react-icons/io5";

export default function AIChat({ weather, onClose }) {
  /* ==========================================
     Initial Message
  ========================================== */

  const [messages, setMessages] = useState([
    {
      id: "initial-bot-message",
      sender: "bot",

      text:
        "👋 Hello!\n\n" +
        "I'm your AI Weather Assistant.\n\n" +
        "Ask me anything about today's weather.",

      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const messagesEndRef = useRef(null);


  /* ==========================================
     Auto Scroll
  ========================================== */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, typing]);


  /* ==========================================
     Generate Unique ID
  ========================================== */

  const generateMessageId = (sender) => {
    return `${sender}-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;
  };


  /* ==========================================
     Dynamic Suggestions
  ========================================== */

  const suggestions = weather
    ? [
        {
          id: "rain",
          icon: "🌧️",
          label: "Rain",
          question: `Will it rain today in ${weather.city}?`,
        },

        {
          id: "temperature",
          icon: "🌡️",
          label: `${weather.temperature ?? "--"}°C`,
          question: `Explain today's temperature in ${weather.city}.`,
        },

        {
          id: "wind",
          icon: "💨",
          label: `${weather.windSpeed ?? "--"} m/s`,
          question: "How strong is today's wind?",
        },

        {
          id: "humidity",
          icon: "💧",
          label: `${weather.humidity ?? "--"}%`,
          question: "Is today's humidity comfortable?",
        },

        {
          id: "aqi",
          icon: "🌱",
          label:
            weather.airQuality?.quality || "AQI",
          question: "How is today's air quality?",
        },

        {
          id: "umbrella",
          icon: "☂️",
          label: "Umbrella",
          question:
            "Should I carry an umbrella today?",
        },

        {
          id: "sunrise",
          icon: "🌅",
          label: "Sunrise",
          question:
            "When is sunrise today?",
        },

        {
          id: "sunset",
          icon: "🌇",
          label: "Sunset",
          question:
            "When is sunset today?",
        },

        {
          id: "outdoor",
          icon: "🏃",
          label: "Outdoor",
          question:
            "Is today good for outdoor activities?",
        },
      ]
    : [];


  /* ==========================================
     Send Message
  ========================================== */

  const sendMessage = async (text = input) => {
    const cleanText = text.trim();

    /*
      Prevent empty messages
      and prevent multiple requests
      while AI is responding.
    */

    if (!cleanText || typing) {
      return;
    }


    /* ========================================
       User Message
    ======================================== */

    const userMessage = {
      id: generateMessageId("user"),

      sender: "user",

      text: cleanText,

      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };


    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);


    setInput("");

    setTyping(true);


    try {

      /* ======================================
         Gemini / AI Request
      ====================================== */

      const reply = await sendChatMessage(
        cleanText,
        weather
      );


      /* ======================================
         Bot Message
      ====================================== */

      const botMessage = {
        id: generateMessageId("bot"),

        sender: "bot",

        text:
          reply ||
          "Sorry, I couldn't generate a response.",

        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };


      setMessages((prev) => [
        ...prev,
        botMessage,
      ]);

    } catch (error) {

      console.error(
        "AI Chat Error:",
        error
      );


      /* ======================================
         Error Message
      ====================================== */

      const errorMessage = {
        id: generateMessageId("bot-error"),

        sender: "bot",

        text:
          "⚠️ Sorry, I'm unable to connect to the AI service right now.",

        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };


      setMessages((prev) => [
        ...prev,
        errorMessage,
      ]);

    } finally {

      setTyping(false);

    }
  };


  /* ==========================================
     Enter Key
  ========================================== */

  const handleKeyDown = (event) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendMessage();

    }
  };


  /* ==========================================
     Render
  ========================================== */

  return (
    <div className="ai-chat">

      {/* ======================================
          Header
      ====================================== */}

      <div className="chat-header">

        <div>

          <h2>
            🤖 Weather AI
          </h2>

          <small>

            <span className="online-dot"></span>

            AI Assistant Online

          </small>

        </div>


        <button
          type="button"
          className="close-btn"
          onClick={onClose}
          aria-label="Close AI chat"
        >
          ✕
        </button>

      </div>


      {/* ======================================
          Suggestions
      ====================================== */}

      {weather &&
        suggestions.length > 0 && (

          <div className="suggestions">

            {suggestions.map((item) => (

              <button
                key={item.id}
                type="button"
                disabled={typing}
                onClick={() =>
                  sendMessage(
                    item.question
                  )
                }
              >

                <span>
                  {item.icon}
                </span>

                {item.label}

              </button>

            ))}

          </div>

        )}


      {/* ======================================
          Chat Body
      ====================================== */}

      <div className="chat-body">

        {messages.map((msg) => (

          <div
            key={msg.id}
            className={`message ${msg.sender}`}
          >

            {/* ================================
                Avatar
            ================================= */}

            <div
              className={`avatar ${
                msg.sender === "bot"
                  ? "bot-avatar"
                  : "user-avatar"
              }`}
            >

              {msg.sender === "bot"
                ? "🤖"
                : "👤"}

            </div>


            {/* ================================
                Message Content
            ================================= */}

            <div className="bubble-container">

              <div className="bubble">

                {msg.text
                  .split("\n")
                  .map((line, index) => (

                    <p
                      key={`${msg.id}-line-${index}`}
                    >
                      {line || "\u00A0"}
                    </p>

                  ))}

              </div>


              <small className="time">
                {msg.time}
              </small>

            </div>

          </div>

        ))}


        {/* ====================================
            Typing Indicator
        ==================================== */}

        {typing && (

          <div
            className="message bot"
            key="typing-indicator"
          >

            <div className="avatar bot-avatar">
              🤖
            </div>


            <div className="bubble-container">

              <div className="bubble typing">

                <span></span>
                <span></span>
                <span></span>

              </div>

            </div>

          </div>

        )}


        {/* ====================================
            Scroll Anchor
        ==================================== */}

        <div
          ref={messagesEndRef}
        />

      </div>


      {/* ======================================
          Chat Footer
      ====================================== */}

      <div className="chat-footer">

        <input
          type="text"
          placeholder="Ask anything about today's weather..."
          value={input}
          disabled={typing}
          onChange={(event) =>
            setInput(event.target.value)
          }
          onKeyDown={handleKeyDown}
        />


        <button
          type="button"
          onClick={() => sendMessage()}
          disabled={
            !input.trim() ||
            typing
          }
          aria-label="Send message"
        >

          <IoSend />

        </button>

      </div>


      {/* ======================================
          Footer Branding
      ====================================== */}

      <div className="chat-branding">

        <span className="brand-icon">
          🌦️
        </span>


        <span className="brand-text">

          <strong>
            Nimbus AI
          </strong>

          <small>
            Powered by MyCityWeather
          </small>

        </span>

      </div>

    </div>
  );
}