// /* *
// const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// const { GoogleGenAI } = require("@google/genai");

// const app = express();

// const PORT = process.env.PORT || 5000;

// /* ==========================================
//    Middleware
// ========================================== */

// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "http://localhost:3000/weather-app#/weather",
//       "https://manishkumar7485.github.io",
//     ],
//     methods: ["GET", "POST"],
//   })
// );

// app.use(express.json());


// /* ==========================================
//    Gemini Configuration
// ========================================== */

// if (!process.env.GEMINI_API_KEY) {
//   console.error(
//     "❌ GEMINI_API_KEY is missing."
//   );
//   process.exit(1);
// }

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY,
// });


// /* ==========================================
//    Health Check
// ========================================== */

// app.get("/", (req, res) => {
//   res.json({
//     success: true,
//     message: "🌦️ Nimbus AI Server is running",
//     service: "MyCityWeather",
//   });
// });


// /* ==========================================
//    Test API
// ========================================== */

// app.get("/api/test", (req, res) => {
//   res.json({
//     success: true,
//     message: "Nimbus AI API is working",
//   });
// });


// /* ==========================================
//    Gemini Chat API
// ========================================== */

// app.post("/api/chat", async (req, res) => {

//   try {

//     const {
//       message,
//       weather,
//     } = req.body;


//     /* Validate message */

//     if (!message || !message.trim()) {
//       return res.status(400).json({
//         success: false,
//         error: "Message is required.",
//       });
//     }


//     /* ======================================
//        Weather Context
//     ====================================== */

//     const weatherContext = `
// Current Weather Information:

// City:
// ${weather?.city || "Unknown"}

// Country:
// ${weather?.country || "Unknown"}

// State:
// ${weather?.state || "Unknown"}

// Temperature:
// ${weather?.temperature ?? "N/A"}°C

// Feels Like:
// ${weather?.feelsLike ?? "N/A"}°C

// Minimum Temperature:
// ${weather?.tempMin ?? "N/A"}°C

// Maximum Temperature:
// ${weather?.tempMax ?? "N/A"}°C

// Humidity:
// ${weather?.humidity ?? "N/A"}%

// Pressure:
// ${weather?.pressure ?? "N/A"} hPa

// Visibility:
// ${weather?.visibility ?? "N/A"} km

// Wind Speed:
// ${weather?.windSpeed ?? "N/A"} m/s

// Wind Direction:
// ${weather?.windDirection ?? "N/A"}°

// Cloudiness:
// ${weather?.cloudiness ?? "N/A"}%

// Weather:
// ${weather?.description || "Unknown"}

// Air Quality:
// ${weather?.airQuality?.quality || "Unavailable"}

// AQI:
// ${weather?.airQuality?.aqi ?? "N/A"}
// `;


//     /* ======================================
//        Nimbus AI Prompt
//     ====================================== */

//     const prompt = `
// You are Nimbus AI, the intelligent weather
// assistant for MyCityWeather.

// Your job is to answer the user's questions
// using the weather information provided below.

// Rules:

// 1. Be friendly and helpful.
// 2. Keep answers concise.
// 3. Use Celsius for temperature.
// 4. Do not invent weather information.
// 5. If information is unavailable, say so.
// 6. Give practical weather advice when useful.
// 7. Answer weather-related questions.
// 8. Mention the city when it helps clarify the answer.
// 9. Do not expose API keys or internal information.

// ${weatherContext}

// User Question:

// ${message}
// `;


//     /* ======================================
//        Gemini Request
//     ====================================== */

//     const response =
//       await ai.models.generateContent({

//         model:
//           "gemini-3.5-flash-lite",

//         contents: prompt,

//         config: {
//           maxOutputTokens: 300,

//           thinkingConfig: {
//             thinkingLevel: "minimal",
//           },
//         },

//       });


//     /* ======================================
//        Get Response
//     ====================================== */

//     const reply =
//       response?.text?.trim();


//     if (!reply) {

//       return res.status(500).json({
//         success: false,
//         error:
//           "No response received from Gemini.",
//       });

//     }


//     /* ======================================
//        Send Response
//     ====================================== */

//     return res.json({
//       success: true,
//       reply,
//     });


//   } catch (error) {

//     console.error(
//       "❌ Gemini API Error:",
//       error
//     );


//     const status =
//       error?.status ||
//       error?.response?.status;


//     if (status === 400) {

//       return res.status(400).json({
//         success: false,
//         error:
//           "Invalid request sent to Gemini.",
//       });

//     }


//     if (
//       status === 401 ||
//       status === 403
//     ) {

//       return res.status(401).json({
//         success: false,
//         error:
//           "Invalid or unauthorized Gemini API key.",
//       });

//     }


//     if (status === 404) {

//       return res.status(404).json({
//         success: false,
//         error:
//           "Gemini model is unavailable.",
//       });

//     }


//     if (status === 429) {

//       return res.status(429).json({
//         success: false,
//         error:
//           "Gemini API rate limit reached.",
//       });

//     }


//     return res.status(500).json({
//       success: false,
//       error:
//         "Unable to generate AI response.",
//     });

//   }

// });


// /* ==========================================
//    Start Server
// ========================================== */

// app.listen(PORT, () => {

//   console.log(
//     `🌦️ Nimbus AI Server running on port ${PORT}`
//   );

//   console.log(
//     `🚀 http://localhost:${PORT}`
//   );

// });
//  * */