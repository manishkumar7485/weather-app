import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useParams } from "react-router-dom";
import "./App.css";
import ThemeToggle from "./components/ThemeToggle";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
// import WeatherDetails from "./components/WeatherDetails";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import AirQualityCard from "./components/AirQualityCard";
import WeatherHighlights from "./components/WeatherHighlights";
import WeatherMap from "./components/WeatherMap";
import WeatherBackground from "./components/WeatherBackground";

import { getCurrentLocation } from "./services/geolocationService";
import {
  getWeatherData,
  getWeatherDataByCoordinates,
} from "./services/weatherService";

function WeatherPage() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("");
  const [locationPermission, setLocationPermission] = useState("prompt");

  const { cityName } = useParams();
  useEffect(() => {
  if (cityName) {
    fetchWeather(cityName);
  } else {
    fetchWeatherByLocation();
  }
}, [cityName]);

  const fetchWeatherByLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const coordinates = await getCurrentLocation();

      setLocationPermission("granted");

      const weatherData = await getWeatherDataByCoordinates(
        coordinates.latitude,
        coordinates.longitude
      );

      setWeather(weatherData);
      setCity(weatherData.city);
    } catch (err) {
      setLocationPermission("denied");

      console.log(
        "Geolocation failed, falling back to default city:",
        err?.message
      );

      try {
        const data = await getWeatherData("Noida");
        setWeather(data);
        setCity("Noida");
      } catch (fallbackErr) {
        setError(fallbackErr?.message || "Failed to fetch weather data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherData(cityName);
      setWeather(data);
      setCity(cityName);
    } catch (err) {
      setError(err?.message || "Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (cityName) => {
    setCity(cityName);
    fetchWeather(cityName);
  };

  return (
  <div className="app">
    {weather && <WeatherBackground weather={weather} />}

    <ThemeToggle />

    <div className="container">
      <h1 className="app-title">MyCityWeather App</h1>

      <SearchBar
        onSearch={handleSearch}
        onLocationClick={fetchWeatherByLocation}
        loading={loading}
      />

      {locationPermission === "denied" && (
        <div className="location-notice">
          <p>
            📍 Showing weather for <strong>{city}</strong>. You can search for
            another city above.
          </p>
        </div>
      )}

      {locationPermission === "granted" && (
        <div className="location-success">
          <p>📍 Showing weather for your current location</p>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading weather data...</p>
        </div>
      )}

      {weather && !loading && (
        <>
          <WeatherCard weather={weather} />

          <HourlyForecast
            forecast={weather.hourlyForecast}
          />

          <WeatherHighlights
            weather={weather}
          />

          <DailyForecast
            forecast={weather.dailyForecast}
          />

          <AirQualityCard
            airQuality={weather.airQuality}
          />

          {/* <WeatherDetails
            weather={weather}
          /> */}

          <WeatherMap
            weather={weather}
          />
        </>
      )}
    </div>
  </div>
);
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/weather" replace />} />

      {/* Default location */}
      <Route path="/weather" element={<WeatherPage />} />

      {/* City from URL */}
      <Route path="/weather/:cityName" element={<WeatherPage />} />
    </Routes>
  );
}