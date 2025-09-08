import React from 'react';
import './WeatherDetails.css';

const WeatherDetails = ({ weather }) => {
  const getWindDirection = (degrees) => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
  };

  const details = [
    { label: 'Humidity', value: `${weather.humidity}%`, icon: '💧' },
    { label: 'Pressure', value: `${weather.pressure} hPa`, icon: '📊' },
    { label: 'Wind Speed', value: `${weather.windSpeed} m/s`, icon: '💨' },
    { label: 'Wind Direction', value: getWindDirection(weather.windDirection), icon: '🧭' },
    { label: 'Visibility', value: `${weather.visibility} km`, icon: '👁️' }
  ];

  return (
    <div className="weather-details">
      <h3 className="details-title">Weather Details</h3>
      <div className="details-grid">
        {details.map((detail, index) => (
          <div key={index} className="detail-item">
            <div className="detail-icon">{detail.icon}</div>
            <div className="detail-content">
              <span className="detail-label">{detail.label}</span>
              <span className="detail-value">{detail.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherDetails;


