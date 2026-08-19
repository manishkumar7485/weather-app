import { InferenceClient } from "@huggingface/inference";

const apiKey = process.env.REACT_APP_HUGGINGFACEMODEL_KEY;

if (!apiKey) {
  console.error(
    "Missing REACT_APP_HUGGINGFACEMODEL_KEY in your .env file."
  );
}

const client = new InferenceClient({
  apiKey,
  dangerouslyAllowBrowser: true,
});

export const sendChatMessage = async (message, weather) => {
  try {
    if (!message?.trim()) {
      return "Please enter a question.";
    }

    const completion = await client.chatCompletion({
      model: "Qwen/Qwen2.5-3B-Instruct",
      messages: [
        {
          role: "system",
          content: `
You are Weather AI.

Answer only weather-related questions.

Current Weather:

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

Keep answers friendly, concise, and easy to understand.
`,
        },
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    return (
      completion.choices?.[0]?.message?.content ||
      "No response received."
    );
  } catch (error) {
    console.error("Hugging Face Error:", error);

    if (error?.status === 401) {
      return "Invalid Hugging Face API key.";
    }

    if (error?.status === 429) {
      return "Hugging Face rate limit exceeded.";
    }

    return "Sorry, I couldn't generate a response.";
  }
};
