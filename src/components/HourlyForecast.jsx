import React from "react";
import { getWeatherIcon } from "../services/weatherService";
import "./HourlyForecast.css";

const HourlyForecast = ({ forecast = [] }) => {
  if (!forecast.length) return null;

  return (
    <div className="hourly-container">
      <div className="hourly-header">
        <h2>24-Hour Forecast</h2>
      </div>

      <div className="hourly-scroll">
        {forecast.map((hour, index) => (
          <div className="hour-card" key={index}>
            <p className="hour-time">{hour.time}</p>

            <img
              src={getWeatherIcon(hour.icon)}
              alt={hour.description}
              className="hour-icon"
            />

            <p className="hour-temp">{hour.temperature}°</p>

            <p className="hour-rain">
              🌧 {hour.rainChance}%
            </p>

            <p className="hour-desc">
              {hour.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HourlyForecast;