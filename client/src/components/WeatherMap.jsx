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


/* ==========================================
   Fix Leaflet Marker Icons
========================================== */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


/* ==========================================
   Weather Map
========================================== */

const WeatherMap = ({ weather }) => {

  if (!weather) {
    return null;
  }


  /* ==========================================
     Validate Coordinates
  ========================================== */

  const latitude = Number(weather.latitude);
  const longitude = Number(weather.longitude);


  if (
    Number.isNaN(latitude) ||
    Number.isNaN(longitude)
  ) {
    return (
      <div className="weather-map">

        <h2>
          📍 Weather Map
        </h2>

        <div className="map-error">
          <p>
            Location coordinates are unavailable.
          </p>
        </div>

      </div>
    );
  }


  /* ==========================================
     Google Maps Location URL
  ========================================== */

  const googleMapsUrl =
    `https://www.google.com/maps/search/?api=1` +
    `&query=${latitude},${longitude}`;


  /* ==========================================
     Google Maps Directions URL
  ========================================== */

  const directionsUrl =
    `https://www.google.com/maps/dir/?api=1` +
    `&destination=${latitude},${longitude}` +
    `&travelmode=driving`;


  return (
    <div className="weather-map">

      {/* ======================================
          Header
      ====================================== */}

      <div className="map-header">

        <div>

          <h2>
            📍 Weather Map
          </h2>

          <p>
            {weather.city || "Current Location"}
          </p>

        </div>


        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="maps-button"
        >
          🗺️ Open Maps
        </a>

      </div>


      {/* ======================================
          Leaflet Map
      ====================================== */}

      <MapContainer
        center={[
          latitude,
          longitude,
        ]}
        zoom={11}
        scrollWheelZoom={false}
        className="map"
      >

        {/* OpenStreetMap */}

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        {/* Weather Marker */}

        <Marker
          position={[
            latitude,
            longitude,
          ]}
        >

          <Popup>

            <div className="weather-popup">

              <h3>
                📍{" "}
                {weather.city ||
                  "Current Location"}
              </h3>


              {weather.country && (
                <p>
                  {weather.country}
                </p>
              )}


              <div className="popup-weather">

                <strong>
                  🌡️{" "}
                  {weather.temperature ?? "--"}°C
                </strong>

                <span>
                  {weather.description ||
                    "Weather information"}
                </span>

              </div>


              <div className="popup-details">

                <span>
                  💧{" "}
                  {weather.humidity ?? "--"}%
                </span>

                <span>
                  💨{" "}
                  {weather.windSpeed ?? "--"} m/s
                </span>

                <span>
                  ☁️{" "}
                  {weather.cloudiness ?? "--"}%
                </span>

              </div>

            </div>

          </Popup>

        </Marker>

      </MapContainer>


      {/* ======================================
          Directions Button
      ====================================== */}

      <div className="map-actions">

        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="directions-button"
        >
          📍 Get Directions
        </a>

      </div>

    </div>
  );
};


export default WeatherMap;