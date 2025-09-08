import { useEffect, useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import WeatherDetails from './components/WeatherDetails';
import { getCurrentLocation } from './services/geolocationService';
import { getWeatherData, getWeatherDataByCoordinates } from './services/weatherService';

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState('');
  const [locationPermission, setLocationPermission] = useState('prompt');

  useEffect(() => {
    fetchWeatherByLocation();
  }, []);

  const fetchWeatherByLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const coordinates = await getCurrentLocation();
      setLocationPermission('granted');
      const weatherData = await getWeatherDataByCoordinates(coordinates.latitude, coordinates.longitude);
      setWeather(weatherData);
      setCity(weatherData.city);
    } catch (err) {
      setLocationPermission('denied');
      console.log('Geolocation failed, falling back to default city:', err?.message);
      try {
        const data = await getWeatherData('Hyderabad');
        setWeather(data);
        setCity('Hyderabad');
      } catch (fallbackErr) {
        setError(fallbackErr?.message || 'Failed to fetch weather data.');
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
      setError(err?.message || 'Failed to fetch weather data.');
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
      <div className="container">
        <h1 className="app-title">MyCityWeather App</h1>
        <SearchBar onSearch={handleSearch} onLocationClick={fetchWeatherByLocation} loading={loading} />
        {locationPermission === 'denied' && (
          <div className="location-notice">
            <p>📍 Showing weather for {city}. You can search for your city above.</p>
          </div>
        )}
        {locationPermission === 'granted' && (
          <div className="location-success">
            <p>📍 Showing weather for your current location</p>
          </div>
        )}
        {error && <div className="error-message">{error}</div>}
        {weather && !loading && (
          <>
            <WeatherCard weather={weather} />
            <WeatherDetails weather={weather} />
          </>
        )}
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading weather data...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;


