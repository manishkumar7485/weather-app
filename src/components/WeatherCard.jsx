import React from 'react';
import { getWeatherIcon } from '../services/weatherService';
import './WeatherCard.css';

const WeatherCard = ({ weather }) => {
  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="weather-card">
      <div className="weather-header">
        <div className="location">
          <h2 className="city-name">{weather.city}</h2>
          <p className="country">{weather.country}</p>
        </div>
        <div className="weather-icon">
          <img 
            src={getWeatherIcon(weather.icon)} 
            alt={weather.description}
            className="weather-image"
          />
        </div>
      </div>
      
      <div className="weather-main">
        <div className="temperature">
          <span className="temp-value">{weather.temperature}</span>
          <span className="temp-unit">°C</span>
        </div>
        <div className="weather-description">
          <p className="description">{weather.description}</p>
          <p className="feels-like">Feels like {weather.feelsLike}°C</p>
        </div>
      </div>
      
      <div className="weather-times">
        <div className="time-info">
          <span className="time-label">Sunrise</span>
          <span className="time-value">{formatTime(weather.sunrise)}</span>
        </div>
        <div className="time-info">
          <span className="time-label">Sunset</span>
          <span className="time-value">{formatTime(weather.sunset)}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;


