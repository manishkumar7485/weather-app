import axios from "axios";
// import ENV from 'env'
/* ==============================
   Configuration
================================= */


const API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY;

const WEATHER_BASE_URL = process.env.REACT_APP_OPENWEATHER_BASE_URL;

const AIR_BASE_URL = process.env.REACT_APP_OPENWEATHERAIR_BASE_URL;

const BIGDATA_URL = process.env.REACT_APP_BIGDATA_URL;

const WEATHERAPI_KEY = process.env.REACT_APP_WEATHERAPI_KEY;

const WEATHERAPI_BASE_URL = process.env.REACT_APP_WEATHERAPI_BASE_URL || "https://api.weatherapi.com/v1";

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

const formatHourlyForecast = (hourlyList = []) => {
  return hourlyList.map((item) => ({
    date: item.time,

    time: new Date(item.time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),

    temperature: Math.round(item.temp_c),

    feelsLike: Math.round(item.feelslike_c),

    tempMin: null,

    tempMax: null,

    humidity: item.humidity,

    pressure: item.pressure_mb,

    windSpeed: item.wind_kph,

    windDirection: item.wind_degree,

    visibility: item.vis_km,

    cloudiness: item.cloud,

    rainChance: item.chance_of_rain,

    snowChance: item.chance_of_snow,

    precipitation: item.precip_mm,

    uvIndex: item.uv,

    gustSpeed: item.gust_kph,

    description: item.condition?.text || "",

    icon: item.condition?.icon
      ? item.condition.icon.startsWith("http")
        ? item.condition.icon
        : `https:${item.condition.icon}`
      : "",

    isDay: item.is_day === 1,
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
    const hourlyForecast = await getHourlyWeather(city);
    // console.log("Hourly data from service : ",weather);

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

      hourlyForecast,

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
    // const hourlyForecast = await getHourlyWeather(city);
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

    const hourlyForecast = await getHourlyWeather(location.city);
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

/* ==============================
   Get Hourly Weather
   WeatherAPI
================================= */

export const getHourlyWeather = async (city) => {
  try {
    if (!WEATHERAPI_KEY) {
      throw new Error(
        "WeatherAPI key is missing."
      );
    }

    const response = await axios.get(
      `${WEATHERAPI_BASE_URL}/forecast.json`,
      {
        params: {
          key: WEATHERAPI_KEY,
          q: city,
          days: 1,
          aqi: "yes",
          alerts: "yes",
        },
      }
    );
    const data = response.data;
    const hourly =
      data.forecast?.forecastday?.[0]?.hour || [];
    // console.log("Hourly response : ",formatHourlyForecast(hourly));
    return formatHourlyForecast(hourly);
    
  } catch (error) {
    console.error(
      "WeatherAPI hourly error:",
      error
    );

    if (error.response?.status === 400) {
      throw new Error(
        "Invalid city name."
      );
    }

    if (error.response?.status === 401) {
      throw new Error(
        "Invalid WeatherAPI key."
      );
    }

    if (error.response?.status === 403) {
      throw new Error(
        "WeatherAPI access denied or quota exceeded."
      );
    }

    if (error.response?.status === 429) {
      throw new Error(
        "WeatherAPI request limit exceeded."
      );
    }

    throw new Error(
      "Unable to fetch hourly weather."
    );
  }
};