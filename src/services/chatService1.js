import { GoogleGenAI } from "@google/genai";

// Gemini key from TXT file
import geminiKeyFile from "../config/gemini-key.txt?raw";

let ai = null;

/* =========================================================
   GEMINI INITIALIZATION
========================================================= */

const getGeminiAI = () => {
  if (ai) {
    return ai;
  }

  try {
    const apiKey = geminiKeyFile.trim();

    if (!apiKey) {
      throw new Error("Gemini API key is empty.");
    }

    console.log("Gemini API key loaded.");
    
    console.log("API key length:", apiKey.length);

    ai = new GoogleGenAI({
      apiKey,
    });

    return ai;
  } catch (error) {
    console.error("Gemini initialization error:", error);
    throw error;
  }
};

/* =========================================================
   DETECT CITY FROM USER QUESTION
========================================================= */

const extractCityFromMessage = (message) => {
  const text = message.trim();

  const patterns = [
    /weather\s+(?:in|at|of)\s+(.+)/i,
    /temperature\s+(?:in|at|of)\s+(.+)/i,
    /temp\s+(?:in|at|of)\s+(.+)/i,
    /forecast\s+(?:in|for)\s+(.+)/i,
    /humidity\s+(?:in|at|of)\s+(.+)/i,
    /wind\s+(?:in|at|of)\s+(.+)/i,
    /air\s+quality\s+(?:in|of)\s+(.+)/i,
    /how\s+is\s+the\s+weather\s+(?:in|at)\s+(.+)/i,
    /how'?s\s+the\s+weather\s+(?:in|at)\s+(.+)/i,
    /what'?s\s+the\s+weather\s+(?:in|at)\s+(.+)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);

    if (match && match[1]) {
      return match[1]
        .replace(/[?.!,]+$/, "")
        .trim();
    }
  }

  return null;
};

/* =========================================================
   FETCH WEATHER FOR ANOTHER CITY
========================================================= */

const fetchCityWeather = async (city) => {
  try {
    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;

    if (!apiKey) {
      throw new Error("OpenWeatherMap API key is missing.");
    }

    // First find city coordinates
    const geoUrl =
      `https://api.openweathermap.org/geo/1.0/direct` +
      `?q=${encodeURIComponent(city)}` +
      `&limit=1` +
      `&appid=${apiKey}`;

    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      throw new Error(
        `Geocoding failed: ${geoResponse.status}`
      );
    }

    const locations = await geoResponse.json();

    if (!locations.length) {
      return null;
    }

    const location = locations[0];

    // Fetch current weather using coordinates
    const weatherUrl =
      `https://api.openweathermap.org/data/2.5/weather` +
      `?lat=${location.lat}` +
      `&lon=${location.lon}` +
      `&units=metric` +
      `&appid=${apiKey}`;

    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      throw new Error(
        `Weather request failed: ${weatherResponse.status}`
      );
    }

    const data = await weatherResponse.json();

    return {
      city: data.name || location.name || city,
      country: data.sys?.country || location.country || "",

      temperature: data.main?.temp,
      feelsLike: data.main?.feels_like,
      humidity: data.main?.humidity,

      pressure: data.main?.pressure,

      windSpeed: data.wind?.speed,

      description:
        data.weather?.[0]?.description || "Unknown",

      weatherMain:
        data.weather?.[0]?.main || "Unknown",

      visibility:
        data.visibility != null
          ? data.visibility / 1000
          : null,

      sunrise: data.sys?.sunrise,
      sunset: data.sys?.sunset,

      // OpenWeather current weather doesn't directly
      // provide AQI, so this is fetched separately below.
      airQuality: null,

      latitude: data.coord?.lat,
      longitude: data.coord?.lon,
    };
  } catch (error) {
    console.error(
      `Unable to fetch weather for ${city}:`,
      error
    );

    return null;
  }
};

/* =========================================================
   FETCH AIR QUALITY
========================================================= */

const fetchAirQuality = async (weather) => {
  try {
    if (
      weather?.latitude == null ||
      weather?.longitude == null
    ) {
      return weather;
    }

    const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;

    if (!apiKey) {
      return weather;
    }

    const url =
      `https://api.openweathermap.org/data/2.5/air_pollution` +
      `?lat=${weather.latitude}` +
      `&lon=${weather.longitude}` +
      `&appid=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      return weather;
    }

    const data = await response.json();

    const aqi = data.list?.[0]?.main?.aqi;

    const qualityMap = {
      1: "Good",
      2: "Fair",
      3: "Moderate",
      4: "Poor",
      5: "Very Poor",
    };

    return {
      ...weather,
      airQuality: {
        aqi,
        quality: qualityMap[aqi] || "Unknown",
      },
    };
  } catch (error) {
    console.error("Air quality fetch failed:", error);

    return weather;
  }
};

/* =========================================================
   GET WEATHER FOR REQUEST
========================================================= */

const getWeatherForQuestion = async (
  message,
  currentWeather
) => {
  const requestedCity = extractCityFromMessage(message);

  // User did not mention another city
  if (!requestedCity) {
    return currentWeather;
  }

  // User asked for the same city
  const currentCity =
    currentWeather?.city?.toLowerCase();

  if (
    currentCity &&
    requestedCity.toLowerCase() === currentCity
  ) {
    return currentWeather;
  }

  console.log(
    `Fetching weather for requested city: ${requestedCity}`
  );

  let weather = await fetchCityWeather(requestedCity);

  if (!weather) {
    return currentWeather;
  }

  weather = await fetchAirQuality(weather);

  return weather;
};

/* =========================================================
   FORMAT WEATHER
========================================================= */

const formatWeather = (weather) => {
  return `
City: ${weather?.city || "Unknown"}
Country: ${weather?.country || "Unknown"}

Temperature: ${weather?.temperature ?? "N/A"}°C
Feels Like: ${weather?.feelsLike ?? "N/A"}°C
Humidity: ${weather?.humidity ?? "N/A"}%
Wind Speed: ${weather?.windSpeed ?? "N/A"} m/s
Weather: ${weather?.description || "Unknown"}
Air Quality: ${weather?.airQuality?.quality || "Unknown"}
`;
};

/* =========================================================
   FALLBACK RESPONSE
========================================================= */

const getFallbackResponse = (message, weather) => {
  const question = message.toLowerCase().trim();

  const city = weather?.city || "the requested city";
  const temperature = weather?.temperature;
  const feelsLike = weather?.feelsLike;
  const humidity = weather?.humidity;
  const windSpeed = weather?.windSpeed;
  const description = weather?.description;
  const airQuality = weather?.airQuality?.quality;

  // Temperature
  if (
    question.includes("temperature") ||
    question.includes("temp") ||
    question.includes("hot") ||
    question.includes("cold")
  ) {
    return `The current temperature in ${city} is ${
      temperature ?? "N/A"
    }°C. It feels like ${
      feelsLike ?? "N/A"
    }°C.`;
  }

  // Feels like
  if (
    question.includes("feels like") ||
    question.includes("feel like")
  ) {
    return `It currently feels like ${
      feelsLike ?? "N/A"
    }°C in ${city}.`;
  }

  // Humidity
  if (
    question.includes("humidity") ||
    question.includes("humid")
  ) {
    return `The current humidity in ${city} is ${
      humidity ?? "N/A"
    }%.`;
  }

  // Wind
  if (
    question.includes("wind") ||
    question.includes("wind speed")
  ) {
    return `The current wind speed in ${city} is ${
      windSpeed ?? "N/A"
    } m/s.`;
  }

  // Air quality
  if (
    question.includes("air quality") ||
    question.includes("aqi") ||
    question.includes("pollution")
  ) {
    return `The current air quality in ${city} is ${
      airQuality || "not available"
    }.`;
  }

  // Weather
  if (
    question.includes("weather") ||
    question.includes("condition") ||
    question.includes("outside") ||
    question.includes("forecast")
  ) {
    return `The current weather in ${city} is ${
      description || "not available"
    }, with a temperature of ${
      temperature ?? "N/A"
    }°C.`;
  }

  // General fallback
  return `Currently in ${city}, the temperature is ${
    temperature ?? "N/A"
  }°C, it feels like ${
    feelsLike ?? "N/A"
  }°C, humidity is ${
    humidity ?? "N/A"
  }%, wind speed is ${
    windSpeed ?? "N/A"
  } m/s, and the weather is ${
    description || "not available"
  }.`;
};

/* =========================================================
   MAIN CHAT FUNCTION
========================================================= */

export const sendChatMessage = async (
  message,
  weather
) => {
  try {
    // First determine which city's weather is needed
    const requestedWeather =
      await getWeatherForQuestion(
        message,
        weather
      );

    /* ---------------------------------------------
       Try Gemini
    --------------------------------------------- */

    try {
      const geminiAI = getGeminiAI();

      const prompt = `
You are Nimbus AI, an intelligent weather assistant.

Current Weather:

${formatWeather(requestedWeather)}

User Question:
${message}

Instructions:
- Answer clearly and helpfully.
- Use the weather information provided above.
- If the user asks about another city, use the city shown in the weather data.
- Keep the response brief.
- Do not unnecessarily repeat all weather information.
- Mention the city when useful.
- If the question is unrelated to weather, answer normally.
`;

      const response =
        await geminiAI.models.generateContent({
          model: "gemini-3.5-flash-lite",
          contents: prompt,
        });

      return response.text;
    } catch (geminiError) {
      /* ---------------------------------------------
         Gemini unavailable
         Use weather fallback
      --------------------------------------------- */

      console.warn(
        "Gemini unavailable. Using weather fallback."
      );

      return getFallbackResponse(
        message,
        requestedWeather
      );
    }
  } catch (error) {
    console.error("Chat service error:", error);

    return "Sorry, I couldn't fetch the requested weather information.";
  }
};
