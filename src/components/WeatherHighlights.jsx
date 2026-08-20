import React from "react";
import "./WeatherHighlights.css";

const WeatherHighlights = ({ weather }) => {
  // console.log(weather)
  if (!weather) return null;

  const formatTime = (date) => {
    if (!date) return "--";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "--";
    }

    return parsedDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getWindDirection = (deg) => {
    if (deg === undefined || deg === null) {
      return "--";
    }

    const directions = [
      "N",
      "NE",
      "E",
      "SE",
      "S",
      "SW",
      "W",
      "NW",
    ];

    return directions[
      Math.round(deg / 45) % 8
    ];
  };

  const cards = [
    {
      title: "Feels Like",
      icon: "🌡️",
      value:
        weather.feelsLike !== undefined
          ? `${weather.feelsLike}°C`
          : "--",
    },

    {
      title: "Humidity",
      icon: "💧",
      value:
        weather.humidity !== undefined
          ? `${weather.humidity}%`
          : "--",
    },

    {
      title: "Pressure",
      icon: "📊",
      value:
        weather.pressure !== undefined
          ? `${weather.pressure} hPa`
          : "--",
    },

    {
      title: "Visibility",
      icon: "👁️",
      value:
        weather.visibility !== undefined
          ? `${weather.visibility} km`
          : "--",
    },

    {
      title: "Wind",
      icon: "💨",
      value:
        weather.windSpeed !== undefined
          ? `${weather.windSpeed} m/s`
          : "--",

      subtitle:
        weather.windDirection !== undefined
          ? getWindDirection(weather.windDirection)
          : "--",
    },

    {
      title: "Clouds",
      icon: "☁️",
      value:
        weather.cloudiness !== undefined
          ? `${weather.cloudiness}%`
          : "--",
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
    <section className="highlights">

      <div className="highlights-header">
        <h2>Today's Highlights</h2>

        {weather.city && (
          <span className="highlight-location">
            📍 {weather.city}
          </span>
        )}
      </div>

      <div className="highlight-grid">

        {cards.map((card) => (
          <div
            className="highlight-card"
            key={card.title}
          >

            <div className="highlight-icon">
              {card.icon}
            </div>

            <h4>
              {card.title}
            </h4>

            <h2>
              {card.value}
            </h2>

            {card.subtitle && (
              <small>
                {card.subtitle}
              </small>
            )}

          </div>
        ))}

      </div>

    </section>
  );
};

export default WeatherHighlights;