import axios from "axios";

const API_KEY = "1bc5d446b342dce8d4069504af326b92";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

/**
 * Get state, district, country from BigDataCloud
 */
const getLocationDetails = async (lat, lon) => {
  try {
    const response = await axios.get(
      "https://api.bigdatacloud.net/data/reverse-geocode-client",
      {
        params: {
          latitude: lat,
          longitude: lon,
          localityLanguage: "en",
        },
      }
    );

    const location = response.data;

    return {
      city: location.city || location.locality || "",
      state: location.principalSubdivision || "",
      district:
        location.localityInfo?.administrative?.[3]?.name || "",
      country: location.countryName || "",
    };
  } catch (err) {
    console.error("BigDataCloud Error:", err);

    return {
      city: "",
      state: "",
      district: "",
      country: "",
    };
  }
};

export const getWeatherData = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });

    const data = response.data;

    const location = await getLocationDetails(
      data.coord.lat,
      data.coord.lon
    );

    return {
      city: location.city || data.name,
      state: location.state,
      district: location.district,
      country: location.country || data.sys.country,

      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),

      description: data.weather[0].description,
      icon: data.weather[0].icon,

      humidity: data.main.humidity,
      pressure: data.main.pressure,

      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,

      visibility: data.visibility / 1000,

      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000),

      timezone: data.timezone,
    };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error(
        "City not found. Please check the spelling and try again."
      );
    }

    if (error.response?.status === 401) {
      throw new Error(
        "Invalid API key. Please check your OpenWeatherMap API key."
      );
    }

    throw new Error("Failed to fetch weather data.");
  }
};

export const getWeatherDataByCoordinates = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: "metric",
      },
    });

    const data = response.data;

    const location = await getLocationDetails(lat, lon);

    return {
      city: location.city || data.name,
      state: location.state,
      district: location.district,
      country: location.country || data.sys.country,

      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),

      description: data.weather[0].description,
      icon: data.weather[0].icon,

      humidity: data.main.humidity,
      pressure: data.main.pressure,

      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,

      visibility: data.visibility / 1000,

      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000),

      timezone: data.timezone,
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error(
        "Invalid API key. Please check your OpenWeatherMap API key."
      );
    }

    throw new Error("Failed to fetch weather data.");
  }
};

export const getWeatherIcon = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
};