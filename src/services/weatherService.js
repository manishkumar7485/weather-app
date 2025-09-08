import axios from 'axios';

const API_KEY = 'de72f0371e1ba6d27c8594a593f7185d'; // Your API key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeatherData = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric'
      }
    });

    const data = response.data;
    
    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,
      visibility: data.visibility / 1000, // Convert to km
      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000),
      timezone: data.timezone
    };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('City not found. Please check the spelling and try again.');
    } else if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
    } else {
      throw new Error('Failed to fetch weather data. Please try again later.');
    }
  }
};

export const getWeatherDataByCoordinates = async (lat, lon) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat: lat,
        lon: lon,
        appid: API_KEY,
        units: 'metric'
      }
    });

    const data = response.data;
    
    return {
      city: data.name,
      country: data.sys.country,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      windDirection: data.wind.deg,
      visibility: data.visibility / 1000, // Convert to km
      sunrise: new Date(data.sys.sunrise * 1000),
      sunset: new Date(data.sys.sunset * 1000),
      timezone: data.timezone
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
    } else {
      throw new Error('Failed to fetch weather data. Please try again later.');
    }
  }
};

export const getWeatherIcon = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};


