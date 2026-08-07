import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.REACT_APP_GEMINI_API_KEY,
});

export const sendChatMessage = async (message, weather) => {
  try {
    const prompt = `
      You are Nimbus AI.

      Current Weather:

      City: ${weather?.city}
      Country: ${weather?.country}
      Temperature: ${weather?.temperature}°C
      Feels Like: ${weather?.feelsLike}°C
      Humidity: ${weather?.humidity}%
      Wind Speed: ${weather?.windSpeed} m/s
      Weather: ${weather?.description}
      Air Quality: ${weather?.airQuality?.quality}

      User Question:
      ${message}

      Answer briefly and helpfully.
      `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite" || "gemini-3.6-flash" ,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error(error);
    return "Unable to generate AI response.";
  }
};