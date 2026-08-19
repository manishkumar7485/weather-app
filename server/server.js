const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const app = express();

const PORT = process.env.PORT || 5000;


/* =========================================================
   CONFIGURATION
========================================================= */

const OPENWEATHER_API_KEY =
  process.env.OPENWEATHER_API_KEY;

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY;


/* =========================================================
   API KEY CHECK
========================================================= */

if (!OPENWEATHER_API_KEY) {
  console.error(
    "❌ OPENWEATHER_API_KEY is missing."
  );
}

if (!GEMINI_API_KEY) {
  console.error(
    "❌ GEMINI_API_KEY is missing."
  );
}


/* =========================================================
   MIDDLEWARE
========================================================= */

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://manishkumar7485.github.io",
    ],

    methods: [
      "GET",
      "POST",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
    ],
  })
);

app.use(express.json());


/* =========================================================
   GEMINI CONFIGURATION
========================================================= */

const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});


/* =========================================================
   HEALTH CHECK
========================================================= */

app.get("/", (req, res) => {

  res.json({
    success: true,
    message:
      "🌦️ Nimbus AI Server is running",
    service:
      "MyCityWeather",
  });

});


/* =========================================================
   TEST API
========================================================= */

app.get("/api/test", (req, res) => {

  res.json({
    success: true,
    message:
      "Nimbus AI API is working",
  });

});


/* =========================================================
   EXTRACT CITY FROM USER MESSAGE
========================================================= */

const extractCityFromMessage = (message) => {
  if (!message || typeof message !== "string") {
    return null;
  }

  let text = message
    .trim()
    .replace(/\s+/g, " ");

  /* Remove common question words */
  text = text
    .replace(
      /^(please\s+)?(can you\s+|could you\s+|would you\s+)?/i,
      ""
    )
    .trim();

  const patterns = [
    // What's the weather in Delhi?
    /(?:weather|temperature|forecast|humidity|wind|air\s+quality)\s+(?:in|at|for|of)\s+(.+)/i,

    // How is the weather in Delhi?
    /how\s+(?:is|'s)\s+(?:the\s+)?weather\s+(?:in|at|for)\s+(.+)/i,

    // What is the weather in Delhi?
    /what\s+(?:is|'s)\s+(?:the\s+)?weather\s+(?:in|at|for)\s+(.+)/i,

    // Tell me about the weather in Delhi
    /tell\s+me\s+(?:about\s+)?(?:the\s+)?weather\s+(?:in|at|for)\s+(.+)/i,

    // Delhi weather
    /^(.+?)\s+(?:weather|forecast)$/i,

    // Weather Delhi
    /^(?:weather|forecast)\s+(.+)$/i,

    // How is Delhi today?
    /how\s+is\s+(.+?)(?:\s+today|\s+now)?$/i,

    // What's Delhi temperature?
    /(?:what(?:'s|\s+is)|how\s+is)\s+(.+?)\s+(?:temperature|weather|forecast)$/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match && match[1]) {
      let city = match[1]
        .trim()
        .replace(/[?.!,]+$/, "");

      /* Remove time words */
      city = city
        .replace(
          /\b(today|tomorrow|now|tonight|right now)\b/gi,
          ""
        )
        .trim();

      /* Remove common trailing words */
      city = city
        .replace(
          /\b(please|currently|right now)\b/gi,
          ""
        )
        .trim();

      city = city
        .replace(/\s+/g, " ")
        .trim();

      if (city.length > 1) {
        console.log("🏙️ City detected:", city);
        return city;
      }
    }
  }

  console.log("⚠️ No city detected from:", message);

  return null;
};


/* =========================================================
   GET WEATHER FOR ANOTHER CITY
========================================================= */

const getCityWeather = async (city) => {

  try {

    console.log(
      `🌍 Searching weather for: ${city}`
    );


    /* =====================================================
       STEP 1: GEOCODING
    ===================================================== */

    const geoUrl =
      "https://api.openweathermap.org/geo/1.0/direct";


    const geoResponse =
      await fetch(
        `${geoUrl}?q=${encodeURIComponent(city)}&limit=1&appid=${OPENWEATHER_API_KEY}`
      );


    if (!geoResponse.ok) {

      throw new Error(
        `Geocoding API error: ${geoResponse.status}`
      );

    }


    const locations =
      await geoResponse.json();


    if (
      !locations ||
      locations.length === 0
    ) {

      console.log(
        `❌ City not found: ${city}`
      );

      return null;

    }


    const location =
      locations[0];


    const latitude =
      location.lat;

    const longitude =
      location.lon;


    console.log(
      `📍 ${location.name}: ${latitude}, ${longitude}`
    );


    /* =====================================================
       STEP 2: CURRENT WEATHER
    ===================================================== */

    const weatherUrl =
      "https://api.openweathermap.org/data/2.5/weather";


    const weatherResponse =
      await fetch(
        `${weatherUrl}?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_API_KEY}`
      );


    if (!weatherResponse.ok) {

      throw new Error(
        `Weather API error: ${weatherResponse.status}`
      );

    }


    const weather =
      await weatherResponse.json();


    /* =====================================================
       STEP 3: AIR QUALITY
    ===================================================== */

    let airQuality = null;


    try {

      const airUrl =
        "https://api.openweathermap.org/data/2.5/air_pollution";


      const airResponse =
        await fetch(
          `${airUrl}?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}`
        );


      if (airResponse.ok) {

        const airData =
          await airResponse.json();


        const air =
          airData?.list?.[0];


        if (air) {

          const aqiLabels = {

            1: "Good",

            2: "Fair",

            3: "Moderate",

            4: "Poor",

            5: "Very Poor",

          };


          airQuality = {

            aqi:
              air.main?.aqi,

            quality:
              aqiLabels[
                air.main?.aqi
              ] || "Unknown",

            co:
              air.components?.co,

            no2:
              air.components?.no2,

            o3:
              air.components?.o3,

            so2:
              air.components?.so2,

            pm2_5:
              air.components?.pm2_5,

            pm10:
              air.components?.pm10,

          };

        }

      }

    } catch (airError) {

      console.warn(
        "⚠️ Air quality unavailable:",
        airError.message
      );

    }


    /* =====================================================
       STEP 4: FORMAT WEATHER
    ===================================================== */

    return {

      city:
        weather.name ||
        location.name,

      state:
        location.state ||
        "",

      country:
        weather.sys?.country ||
        location.country ||
        "",

      latitude,

      longitude,


      temperature:
        Math.round(
          weather.main?.temp
        ),


      feelsLike:
        Math.round(
          weather.main?.feels_like
        ),


      tempMin:
        Math.round(
          weather.main?.temp_min
        ),


      tempMax:
        Math.round(
          weather.main?.temp_max
        ),


      humidity:
        weather.main?.humidity,


      pressure:
        weather.main?.pressure,


      visibility:
        weather.visibility != null
          ? weather.visibility / 1000
          : null,


      windSpeed:
        weather.wind?.speed,


      windDirection:
        weather.wind?.deg,


      cloudiness:
        weather.clouds?.all,


      description:
        weather.weather?.[0]?.description ||
        "Unknown",


      weatherMain:
        weather.weather?.[0]?.main ||
        "Unknown",


      icon:
        weather.weather?.[0]?.icon,


      sunrise:
        weather.sys?.sunrise,


      sunset:
        weather.sys?.sunset,


      timezone:
        weather.timezone,


      airQuality,

    };

  } catch (error) {

    console.error(
      "❌ Weather fetch error:",
      error
    );

    return null;

  }

};


/* =========================================================
   BUILD WEATHER CONTEXT
========================================================= */

const buildWeatherContext = (weather) => {

  if (!weather) {

    return `
WEATHER INFORMATION

No weather information is currently available.
`;

  }


  return `
CURRENT WEATHER INFORMATION

City:
${weather.city || "Unknown"}

State:
${weather.state || "Unknown"}

Country:
${weather.country || "Unknown"}

Temperature:
${weather.temperature ?? "N/A"}°C

Feels Like:
${weather.feelsLike ?? "N/A"}°C

Minimum Temperature:
${weather.tempMin ?? "N/A"}°C

Maximum Temperature:
${weather.tempMax ?? "N/A"}°C

Humidity:
${weather.humidity ?? "N/A"}%

Pressure:
${weather.pressure ?? "N/A"} hPa

Visibility:
${weather.visibility ?? "N/A"} km

Wind Speed:
${weather.windSpeed ?? "N/A"} m/s

Wind Direction:
${weather.windDirection ?? "N/A"}°

Cloudiness:
${weather.cloudiness ?? "N/A"}%

Weather:
${weather.description || "Unknown"}

Air Quality:
${weather.airQuality?.quality || "Unavailable"}

AQI:
${weather.airQuality?.aqi ?? "N/A"}
`;

};


/* =========================================================
   GEMINI CHAT API
========================================================= */

app.post(
  "/api/chat",
  async (req, res) => {

    try {

      const {
        message,
        weather: currentWeather,
      } = req.body;


      /* ===================================================
         VALIDATE MESSAGE
      =================================================== */

      if (
        !message ||
        !message.trim()
      ) {

        return res.status(400).json({

          success: false,

          error:
            "Message is required.",

        });

      }


      /* ===================================================
         DETECT CITY
      =================================================== */

      const requestedCity =
        extractCityFromMessage(
          message
        );


      console.log(
        "💬 User:",
        message
      );


      console.log(
        "🏙️ Detected city:",
        requestedCity ||
        "Current city"
      );


      /* ===================================================
         DETERMINE WEATHER
      =================================================== */

      let weather =
        currentWeather;


      if (requestedCity) {

        const currentCity =
          currentWeather?.city
            ?.toLowerCase()
            ?.trim();


        const requestedCityLower =
          requestedCity
            .toLowerCase()
            .trim();


        /*
          If the user asks for another city,
          fetch fresh weather.
        */

        if (
          !currentCity ||
          !requestedCityLower.includes(
            currentCity
          )
        ) {

          const requestedWeather =
            await getCityWeather(
              requestedCity
            );


          if (
            requestedWeather
          ) {

            weather =
              requestedWeather;


            console.log(
              `✅ Weather fetched for ${requestedWeather.city}`
            );

          } else {

            return res.status(404).json({

              success: false,

              error:
                `Unable to find weather for ${requestedCity}.`,

            });

          }

        }

      }


      /* ===================================================
         BUILD WEATHER CONTEXT
      =================================================== */

      const weatherContext =
        buildWeatherContext(
          weather
        );


      /* ===================================================
         GEMINI PROMPT
      =================================================== */

      const prompt = `

You are Nimbus AI, the weather assistant
for MyCityWeather.

Answer the user's question using ONLY
the weather information provided below.

IMPORTANT RULES:

1. Give a complete answer.
2. Keep the answer short and useful.
3. Normally answer in 2 to 4 sentences.
4. Do NOT start with "Hello!" unless the
   user greets you.
5. Do NOT generate a long weather report
   unless the user asks for details.
6. Always mention the correct city when
   answering about a specific city.
7. Use Celsius for temperatures.
8. Do not invent missing information.
9. If a value is unavailable, say
   "Unavailable".
10. Do not expose API keys.
11. Do not expose server information.
12. If another city's weather was fetched,
    use that city's weather data.
13. Do not repeat the weather data unnecessarily.
14. Do not stop in the middle of a sentence.
15. Give a natural conversational answer.

${weatherContext}

USER QUESTION:

${message}

Provide the complete answer now.
`;


      /* ===================================================
         GEMINI REQUEST
      =================================================== */

      const response =
        await ai.models.generateContent({

          model:
            "gemini-3.6-flash",

          contents:
            prompt,

          config: {

            maxOutputTokens:
              1000,

            temperature:
              1,

          },

        });


      /* ===================================================
         GET RESPONSE
      =================================================== */

      let reply =
        response?.text?.trim();


      /* ===================================================
         VALIDATE RESPONSE
      =================================================== */

      if (!reply) {

        return res.status(500).json({

          success: false,

          error:
            "No response received from Gemini.",

        });

      }


      /* ===================================================
         CLEAN RESPONSE
      =================================================== */

      reply =
        reply
          .replace(/^["']|["']$/g, "")
          .trim();


      /* ===================================================
         SEND RESPONSE
      =================================================== */

      return res.json({

        success: true,

        reply,

        weather: weather
          ? {

              city:
                weather.city,

              country:
                weather.country,

              temperature:
                weather.temperature,

              feelsLike:
                weather.feelsLike,

              description:
                weather.description,

            }

          : null,

      });

    } catch (error) {

      console.error(
        "❌ Gemini API Error:",
        error
      );


      const status =
        error?.status ||
        error?.response?.status;


      /* ===================================================
         400
      =================================================== */

      if (
        status === 400
      ) {

        return res.status(400).json({

          success: false,

          error:
            "Invalid request sent to Gemini.",

        });

      }


      /* ===================================================
         401 / 403
      =================================================== */

      if (
        status === 401 ||
        status === 403
      ) {

        return res.status(401).json({

          success: false,

          error:
            "Invalid or unauthorized Gemini API key.",

        });

      }


      /* ===================================================
         404
      =================================================== */

      if (
        status === 404
      ) {

        return res.status(404).json({

          success: false,

          error:
            "Gemini model is unavailable.",

        });

      }


      /* ===================================================
         429
      =================================================== */

      if (
        status === 429
      ) {

        return res.status(429).json({

          success: false,

          error:
            "Gemini API rate limit reached.",

        });

      }


      /* ===================================================
         GENERAL ERROR
      =================================================== */

      return res.status(500).json({

        success: false,

        error:
          "Unable to generate AI response.",

      });

    }

  }
);


/* =========================================================
   LOCAL DEVELOPMENT SERVER
========================================================= */

if (
  process.env.NODE_ENV !==
  "production"
) {

  app.listen(
    PORT,
    () => {

      console.log(
        `🌦️ Nimbus AI Server running on port ${PORT}`
      );

      console.log(
        `🚀 http://localhost:${PORT}`
      );

    }
  );

}


/* =========================================================
   EXPORT FOR VERCEL
========================================================= */

module.exports = app;