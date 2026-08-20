import React from "react";
import { getWeatherIcon } from "../services/weatherService";
import "./DailyForecast.css";

const DailyForecast = ({ forecast = [] }) => {
  // console.log(forecast);
  if (!forecast.length) return null;
  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString([], {
      day: "numeric",
      month: "short",
    });
  };
  return (
    <div className="daily-container">
      <h2 className="daily-title">5-Day Forecast</h2>

      <div className="daily-list">
        {forecast.map((day, index) => (
          <div className="daily-card" key={index}>
            <div className="daily-left">
              <h3>{day.day}, {formatDate(day.date)}</h3>
              
              <img
                src={getWeatherIcon(day.icon)}
                alt={day.description}
                className="daily-icon"
              />
            </div>

            <div className="daily-middle">
              <p className="daily-description">
                {day.description}
              </p>

              <p className="daily-rain">
                🌧 {day.rainChance}%
              </p>
            </div>

            <div className="daily-right">
              <h3>{day.maxTemp}°</h3>
              <p>{day.minTemp}°</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyForecast;