import React from "react";
import "./WeatherHighlights.css";

const WeatherHighlights = ({ weather }) => {
  if (!weather) return null;

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getWindDirection = (deg) => {
    const directions = [
      "N","NE","E","SE","S","SW","W","NW"
    ];

    return directions[
      Math.round(deg / 45) % 8
    ];
  };

  const cards = [
    {
      title: "Feels Like",
      icon: "🌡",
      value: `${weather.feelsLike}°C`,
    },
    {
      title: "Humidity",
      icon: "💧",
      value: `${weather.humidity}%`,
    },
    {
      title: "Pressure",
      icon: "📊",
      value: `${weather.pressure} hPa`,
    },
    {
      title: "Visibility",
      icon: "👁️",
      value: `${weather.visibility} km`,
    },
    {
      title: "Wind",
      icon: "💨",
      value: `${weather.windSpeed} m/s`,
      subtitle: getWindDirection(weather.windDirection),
    },
    {
      title: "Clouds",
      icon: "☁",
      value: `${weather.cloudiness}%`,
    },
    {
      title: "Sunrise",
      icon: "🌅",
      value: formatTime(weather.sunrise),
    },
    {
      title: "Sunset",
      icon: "🌇",
      value: formatTime(weather.sunset),
    },
  ];

  return (
    <div className="highlights">
      <h2>Today's Highlights</h2>

      <div className="highlight-grid">
        {cards.map((card, index) => (
          <div className="highlight-card" key={index}>
            <div className="highlight-icon">
              {card.icon}
            </div>

            <h4>{card.title}</h4>

            <h2>{card.value}</h2>

            {card.subtitle && (
              <small>{card.subtitle}</small>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherHighlights;