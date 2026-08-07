import OpenAI from "openai";

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

if (!apiKey) {
  console.error(
    "Missing REACT_APP_OPENAI_API_KEY in your .env file."
  );
}

const client = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true,
});

export const sendChatMessage = async (message, weather) => {
  try {
    if (!message?.trim()) {
      return "Please enter a question.";
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",

      messages: [
        {
          role: "system",
          content: `
You are Weather AI.

Answer only weather-related questions.

Current Weather

City: ${weather?.city || "Unknown"}
Country: ${weather?.country || "Unknown"}

Temperature: ${weather?.temperature ?? "N/A"}°C
Feels Like: ${weather?.feelsLike ?? "N/A"}°C

Humidity: ${weather?.humidity ?? "N/A"}%
Pressure: ${weather?.pressure ?? "N/A"} hPa

Wind Speed: ${weather?.windSpeed ?? "N/A"} m/s

Weather: ${weather?.description ?? "Unknown"}

Air Quality:
${weather?.airQuality?.quality || "Unavailable"}

Keep answers friendly and concise.
          `,
        },

        {
          role: "user",
          content: message,
        },
      ],

      temperature: 0.7,
      max_completion_tokens: 300,
    });

    return (
      completion.choices?.[0]?.message?.content ||
      "No response received."
    );
  } catch (error) {
    console.error("OpenAI Error:", error);

    if (error.status === 401) {
      return "Invalid OpenAI API key.";
    }

    if (error.status === 429) {
      return "OpenAI quota exceeded.";
    }

    return "Sorry, I couldn't generate a response.";
  }
};