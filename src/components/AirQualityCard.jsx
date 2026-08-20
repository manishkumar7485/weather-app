import React from "react";
import "./AirQualityCard.css";

const AirQualityCard = ({ airQuality }) => {
  if (!airQuality) return null;

  const getColor = (aqi) => {
    switch (aqi) {
      case 1:
        return "#4CAF50";
      case 2:
        return "#8BC34A";
      case 3:
        return "#FFC107";
      case 4:
        return "#FF9800";
      case 5:
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  return (
    <div className="aqi-card">
      <div className="aqi-header">
        <h2>🌍 Air Quality</h2>

        <span
          className="aqi-badge"
          style={{ backgroundColor: getColor(airQuality.aqi) }}
        >
          {airQuality.quality}
        </span>
      </div>

      <div className="aqi-score">
        <h1>{airQuality.aqi}</h1>
        <p>AQI Index</p>
      </div>

      <div className="pollutants">
        <div className="pollutant">
          <span>PM2.5</span>
          <strong>{airQuality.pm2_5}</strong>
        </div>

        <div className="pollutant">
          <span>PM10</span>
          <strong>{airQuality.pm10}</strong>
        </div>

        <div className="pollutant">
          <span>O₃</span>
          <strong>{airQuality.o3}</strong>
        </div>

        <div className="pollutant">
          <span>NO₂</span>
          <strong>{airQuality.no2}</strong>
        </div>

        <div className="pollutant">
          <span>SO₂</span>
          <strong>{airQuality.so2}</strong>
        </div>

        <div className="pollutant">
          <span>CO</span>
          <strong>{airQuality.co}</strong>
        </div>
      </div>
    </div>
  );
};

export default AirQualityCard;