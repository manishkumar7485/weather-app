import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./WeatherMap.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const WeatherMap = ({ weather }) => {
  if (!weather) return null;

  return (
    <div className="weather-map">
      <h2>📍 Weather Map</h2>

      <MapContainer
        center={[weather.latitude, weather.longitude]}
        zoom={11}
        scrollWheelZoom={false}
        className="map"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={[weather.latitude, weather.longitude]}
        >
          <Popup>
            <strong>{weather.city}</strong>
            <br />

            {weather.temperature}°C
            <br />

            {weather.description}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default WeatherMap;