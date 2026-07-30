import axios from "axios";

const API_KEY = "e507e7d11194435b892171613262707";
const BASE_URL = "https://api.weatherapi.com/v1";

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

/**
 * Get Weather By City
 */
export const getWeatherData = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast.json`, {
      params: {
        key: API_KEY,
        q: city,
        days: 10,
        aqi: "yes",
        alerts: "yes",
      },
    });

    const data = response.data;

    console.log(data)

    const location = await getLocationDetails(
      data.location.lat,
      data.location.lon
    );

    return {
      city: location.city || data.location.name,
      state: location.state,
      district: location.district,
      country: location.country || data.location.country,

      latitude: data.location.lat,
      longitude: data.location.lon,

      temperature: Math.round(data.current.temp_c),
      feelsLike: Math.round(data.current.feelslike_c),

      minTemp: Math.round(data.forecast.forecastday[0].day.mintemp_c),
      maxTemp: Math.round(data.forecast.forecastday[0].day.maxtemp_c),

      description: data.current.condition.text,
      icon: data.current.condition.icon,

      humidity: data.current.humidity,
      pressure: data.current.pressure_mb,

      windSpeed: data.current.wind_kph,
      windDirection: data.current.wind_degree,

      visibility: data.current.vis_km,

      uv: data.current.uv,

      sunrise:
        data.forecast.forecastday[0].astro.sunrise,

      sunset:
        data.forecast.forecastday[0].astro.sunset,

      airQuality: data.current.air_quality,

      hourly: data.forecast.forecastday[0].hour,

      forecast: data.forecast.forecastday,

      alerts: data.alerts?.alert || [],
    };
  } catch (error) {
    if (error.response?.status === 400) {
      throw new Error("City not found.");
    }

    if (error.response?.status === 401) {
      throw new Error("Invalid WeatherAPI API Key.");
    }

    throw new Error("Failed to fetch weather data.");
  }
};

/**
 * Get Weather By Coordinates
 */
export const getWeatherDataByCoordinates = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast.json`, {
      params: {
        key: API_KEY,
        q: `${lat},${lon}`,
        days: 10,
        aqi: "yes",
        alerts: "yes",
      },
    });

    const data = response.data;

    const location = await getLocationDetails(lat, lon);

    return {
      city: location.city || data.location.name,
      state: location.state,
      district: location.district,
      country: location.country || data.location.country,

      latitude: data.location.lat,
      longitude: data.location.lon,

      temperature: Math.round(data.current.temp_c),
      feelsLike: Math.round(data.current.feelslike_c),

      minTemp: Math.round(data.forecast.forecastday[0].day.mintemp_c),
      maxTemp: Math.round(data.forecast.forecastday[0].day.maxtemp_c),

      description: data.current.condition.text,
      icon: data.current.condition.icon,

      humidity: data.current.humidity,
      pressure: data.current.pressure_mb,

      windSpeed: data.current.wind_kph,
      windDirection: data.current.wind_degree,

      visibility: data.current.vis_km,

      uv: data.current.uv,

      sunrise:
        data.forecast.forecastday[0].astro.sunrise,

      sunset:
        data.forecast.forecastday[0].astro.sunset,

      airQuality: data.current.air_quality,

      hourly: data.forecast.forecastday[0].hour,

      forecast: data.forecast.forecastday,

      alerts: data.alerts?.alert || [],
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Invalid WeatherAPI API Key.");
    }

    throw new Error("Failed to fetch weather data.");
  }
};

/**
 * WeatherAPI already returns a complete icon URL.
 */
export const getWeatherIcon = (iconUrl) => {
  return iconUrl.startsWith("//")
    ? `https:${iconUrl}`
    : iconUrl;
};