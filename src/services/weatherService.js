import axios from "axios";
// import ENV from 'env'
/* ==============================
   Configuration
================================= */


const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

const WEATHER_BASE_URL = process.env.REACT_APP_OPENWEATHER_BASE_URL;

const AIR_BASE_URL = process.env.REACT_APP_OPENWEATHERAIR_BASE_URL;

const BIGDATA_URL = process.env.REACT_APP_BIGDATA_URL;

/* ==============================
   BigDataCloud Location
================================= */
const getLocationDetails = async (lat, lon) => {
  try {
    const { data } = await axios.get(BIGDATA_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        localityLanguage: "en",
      },
    });
// console.log(data);
    return {
      city:
        data.city ||
        data.locality ||
        "",

      state:
        data.principalSubdivision ||
        "",

      district:
        data.localityInfo?.administrative?.[3]?.name ||
        "",

      country:
        data.countryName ||
        "",

      countryCode:
        data.countryCode ||
        "",

      postcode:
        data.postcode ||
        "",
    };
  } catch (err) {
    console.error("BigDataCloud:", err);

    return {
      city: "",
      state: "",
      district: "",
      country: "",
      countryCode: "",
      postcode: "",
    };
  }
};

/* ==============================
   Format Current Weather
================================= */

const formatCurrentWeather = (weather, location) => ({
  city: location.city || weather.name,

  state: location.state,

  district: location.district,

  country: location.country || weather.sys.country,

  postcode: location.postcode || weather.sys.postcode,

  latitude: weather.coord.lat,

  longitude: weather.coord.lon,

  temperature: Math.round(weather.main.temp),

  feelsLike: Math.round(weather.main.feels_like),

  tempMin: Math.round(weather.main.temp_min),

  tempMax: Math.round(weather.main.temp_max),

  humidity: weather.main.humidity,

  pressure: weather.main.pressure,

  visibility: weather.visibility / 1000,

  windSpeed: weather.wind.speed,

  windDirection: weather.wind.deg,

  cloudiness: weather.clouds.all,

  description: weather.weather[0].description,

  icon: weather.weather[0].icon,

  sunrise: new Date(weather.sys.sunrise * 1000),

  sunset: new Date(weather.sys.sunset * 1000),

  timezone: weather.timezone,
});

/* ==============================
   Format Hourly Forecast
================================= */

const formatHourlyForecast = (forecastList) => {
  return forecastList.slice(0, 8).map((item) => ({
    date: item.dt_txt,

    time: new Date(item.dt * 1000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),

    temperature: Math.round(item.main.temp),

    feelsLike: Math.round(item.main.feels_like),

    tempMin: Math.round(item.main.temp_min),

    tempMax: Math.round(item.main.temp_max),

    humidity: item.main.humidity,

    pressure: item.main.pressure,

    windSpeed: item.wind.speed,

    windDirection: item.wind.deg,

    visibility: item.visibility / 1000,

    cloudiness: item.clouds.all,

    rainChance: Math.round(item.pop * 100),

    description: item.weather[0].description,

    icon: item.weather[0].icon,
  }));
};

/* ==============================
   Format Daily Forecast
================================= */

const formatDailyForecast = (forecastList) => {
  const days = {};

  forecastList.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];

    if (!days[date]) {
      days[date] = item;
    }
  });

  return Object.values(days).slice(0, 5).map((item) => ({
    date: item.dt_txt,

    day: new Date(item.dt * 1000).toLocaleDateString([], {
      weekday: "short",
    }),

    temp: Math.round(item.main.temp),

    minTemp: Math.round(item.main.temp_min),

    maxTemp: Math.round(item.main.temp_max),

    icon: item.weather[0].icon,

    description: item.weather[0].description,

    rainChance: Math.round(item.pop * 100),
  }));
};

/* ==============================
   Create weather chart Data
================================= */

const createChartData = (hourlyForecast) => {
  return hourlyForecast.map((item) => ({
    time: item.time,
    temperature: item.temperature,
    feelsLike: item.feelsLike,
    humidity: item.humidity,
    pressure: item.pressure,
    windSpeed: item.windSpeed,
    rainChance: item.rainChance,
    cloudiness: item.cloudiness,
    visibility: item.visibility,
  }));
};

/* ==========================================
   Get Air Quality
========================================== */

export const getAirQuality = async (lat, lon) => {
  try {
    const { data } = await axios.get(AIR_BASE_URL, {
      params: {
        lat,
        lon,
        appid: API_KEY,
      },
    });

    const air = data.list[0];

    const aqiLabels = {
      1: "Good",
      2: "Fair",
      3: "Moderate",
      4: "Poor",
      5: "Very Poor",
    };

    return {
      aqi: air.main.aqi,
      quality: aqiLabels[air.main.aqi],

      co: air.components.co,
      no: air.components.no,
      no2: air.components.no2,
      o3: air.components.o3,
      so2: air.components.so2,
      pm2_5: air.components.pm2_5,
      pm10: air.components.pm10,
      nh3: air.components.nh3,
    };
  } catch (err) {
    console.error(err);

    return null;
  }
};

/* ==========================================
   Get Weather By City
========================================== */

export const getWeatherData = async (city) => {
  try {
    // Current Weather
    const weatherResponse = await axios.get(
      `${WEATHER_BASE_URL}/weather`,
      {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric",
        },
      }
    );

    const weather = weatherResponse.data;

    // Forecast
    const forecastResponse = await axios.get(
      `${WEATHER_BASE_URL}/forecast`,
      {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric",
        },
      }
    );

    // Location Details
    const location = await getLocationDetails(
      weather.coord.lat,
      weather.coord.lon
    );

    // AQI
    const airQuality = await getAirQuality(
      weather.coord.lat,
      weather.coord.lon
    );

    return {
      ...formatCurrentWeather(weather, location),

      hourlyForecast: formatHourlyForecast(
        forecastResponse.data.list
      ),

      dailyForecast: formatDailyForecast(
        forecastResponse.data.list
      ),

      airQuality,
    };
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("City not found.");
    }

    if (error.response?.status === 401) {
      throw new Error("Invalid API Key.");
    }

    throw new Error("Unable to fetch weather.");
  }
};

/* ==========================================
   Get Weather By Coordinates
========================================== */

export const getWeatherDataByCoordinates = async (
  lat,
  lon
) => {
  try {
    const weatherResponse = await axios.get(
      `${WEATHER_BASE_URL}/weather`,
      {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: "metric",
        },
      }
    );

    const weather = weatherResponse.data;
    // console.log(weather);
    const forecastResponse = await axios.get(
      `${WEATHER_BASE_URL}/forecast`,
      {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: "metric",
        },
      }
    );

    // console.log(weather);

    const location = await getLocationDetails(lat, lon);

    const airQuality = await getAirQuality(lat, lon);

    const hourlyForecast = formatHourlyForecast(
      forecastResponse.data.list
    );
    const dailyForecast = formatDailyForecast(
      forecastResponse.data.list
    );

    // console.log(createChartData(hourlyForecast));

    return {
      ...formatCurrentWeather(weather, location),

      hourlyForecast,

      dailyForecast,

      chartData: createChartData(hourlyForecast),

      airQuality,
    };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Invalid API Key.");
    }

    throw new Error("Unable to fetch weather.");
  }
};

/* ==========================================
   Weather Icon
========================================== */

export const getWeatherIcon = (iconCode) =>
  `https://openweathermap.org/img/wn/${iconCode}@4x.png`;