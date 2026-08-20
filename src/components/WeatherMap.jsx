import React, { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";
import "./WeatherMap.css";


/* =========================================================
   LEAFLET MARKER ICON FIX
========================================================= */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


/* =========================================================
   CUSTOM CURRENT LOCATION ICON
========================================================= */

const currentLocationIcon = L.divIcon({
  className: "current-location-marker",

  html: `
    <div class="current-location-dot">
      <div class="current-location-pulse"></div>
      <span>📍</span>
    </div>
  `,

  iconSize: [40, 40],

  iconAnchor: [20, 40],

  popupAnchor: [0, -40],
});


/* =========================================================
   CUSTOM DESTINATION ICON
========================================================= */

const destinationIcon = L.divIcon({
  className: "destination-marker",

  html: `
    <div class="destination-marker-pin">
      🏁
    </div>
  `,

  iconSize: [40, 40],

  iconAnchor: [20, 40],

  popupAnchor: [0, -40],
});


/* =========================================================
   OSRM
========================================================= */

const OSRM_URL =
  "https://router.project-osrm.org/route/v1/driving";


/* =========================================================
   ROUTE MAP CONTROLLER
========================================================= */

const RouteMapController = ({ route }) => {

  const map = useMap();

  useEffect(() => {

    if (!route || route.length === 0) {
      return;
    }

    const bounds = L.latLngBounds(route);

    map.fitBounds(bounds, {
      padding: [60, 60],
      maxZoom: 14,
    });

  }, [route, map]);

  return null;
};


/* =========================================================
   FORMAT DISTANCE
========================================================= */

const formatDistance = (meters) => {

  if (
    meters === null ||
    meters === undefined
  ) {
    return "--";
  }

  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }

  return `${(meters / 1000).toFixed(1)} km`;
};


/* =========================================================
   FORMAT TIME
========================================================= */

const formatDuration = (seconds) => {

  if (
    seconds === null ||
    seconds === undefined
  ) {
    return "--";
  }

  const totalMinutes =
    Math.max(1, Math.round(seconds / 60));

  if (totalMinutes < 60) {
    return `${totalMinutes} min`;
  }

  const hours =
    Math.floor(totalMinutes / 60);

  const minutes =
    totalMinutes % 60;

  if (minutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${minutes} min`;
};


/* =========================================================
   WEATHER MAP
========================================================= */

const WeatherMap = ({ weather }) => {

  const [showDirections, setShowDirections] =
    useState(false);

  const [userLocation, setUserLocation] =
    useState(null);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [locationError, setLocationError] =
    useState("");

  const [route, setRoute] =
    useState([]);

  const [routeDistance, setRouteDistance] =
    useState(null);

  const [routeDuration, setRouteDuration] =
    useState(null);

  const [routeLoading, setRouteLoading] =
    useState(false);

  const [routeError, setRouteError] =
    useState("");


  /* =======================================================
     NO WEATHER
  ======================================================= */

  if (!weather) {
    return null;
  }


  /* =======================================================
     DESTINATION COORDINATES
  ======================================================= */

  const latitude =
    Number(weather.latitude);

  const longitude =
    Number(weather.longitude);


  if (
    Number.isNaN(latitude) ||
    Number.isNaN(longitude)
  ) {

    return (
      <div className="weather-map">

        <h2>📍 Weather Map</h2>

        <div className="map-error">

          <p>
            Location coordinates are unavailable.
          </p>

        </div>

      </div>
    );
  }


  const destination = {
    lat: latitude,
    lng: longitude,
  };


  /* =======================================================
     GOOGLE MAPS URL
  ======================================================= */

  const googleMapsUrl =
    `https://www.google.com/maps/search/?api=1` +
    `&query=${latitude},${longitude}`;


  /* =======================================================
     FETCH ROAD ROUTE
  ======================================================= */

  const fetchRoute = async (
    origin,
    destinationLocation
  ) => {

    try {

      setRouteLoading(true);

      setRouteError("");

      setRoute([]);

      setRouteDistance(null);

      setRouteDuration(null);


      /*
        OSRM format:

        longitude,latitude;
        longitude,latitude
      */

      const coordinates =
        `${origin.lng},${origin.lat};` +
        `${destinationLocation.lng},${destinationLocation.lat}`;


      const url =
        `${OSRM_URL}/${coordinates}` +
        `?overview=full` +
        `&geometries=geojson`;


      const response =
        await fetch(url);


      if (!response.ok) {

        throw new Error(
          "Unable to connect to routing service."
        );
      }


      const data =
        await response.json();


      if (
        data.code !== "Ok" ||
        !data.routes ||
        data.routes.length === 0
      ) {

        throw new Error(
          "No driving route was found."
        );
      }


      const selectedRoute =
        data.routes[0];


      /* =================================================
         DISTANCE
      ================================================= */

      setRouteDistance(
        selectedRoute.distance
      );


      /* =================================================
         DURATION
      ================================================= */

      setRouteDuration(
        selectedRoute.duration
      );


      /* =================================================
         ROUTE COORDINATES

         OSRM:
         [longitude, latitude]

         Leaflet:
         [latitude, longitude]
      ================================================= */

      const routeCoordinates =
        selectedRoute.geometry.coordinates.map(
          ([lng, lat]) => [
            lat,
            lng,
          ]
        );


      setRoute(routeCoordinates);

    } catch (error) {

      console.error(
        "OSRM Route Error:",
        error
      );

      setRouteError(
        error.message ||
        "Unable to calculate route."
      );

    } finally {

      setRouteLoading(false);
    }
  };


  /* =======================================================
     GET CURRENT LOCATION
  ======================================================= */

  const handleDirections = () => {

    setShowDirections(true);

    setLocationError("");

    setRouteError("");


    if (!navigator.geolocation) {

      setLocationError(
        "Geolocation is not supported by your browser."
      );

      return;
    }


    setLocationLoading(true);


    navigator.geolocation.getCurrentPosition(

      async (position) => {

        const currentLocation = {

          lat:
            position.coords.latitude,

          lng:
            position.coords.longitude,
        };


        setUserLocation(
          currentLocation
        );


        setLocationLoading(false);


        /* =========================================
           FETCH ACTUAL ROAD ROUTE
        ========================================= */

        await fetchRoute(
          currentLocation,
          destination
        );
      },


      (error) => {

        console.error(
          "Geolocation Error:",
          error
        );


        setLocationLoading(false);


        if (error.code === 1) {

          setLocationError(
            "Location permission was denied. Please allow location access."
          );

        } else if (error.code === 2) {

          setLocationError(
            "Your current location could not be determined."
          );

        } else if (error.code === 3) {

          setLocationError(
            "Location request timed out."
          );

        } else {

          setLocationError(
            "Unable to detect your current location."
          );
        }
      },

      {
        enableHighAccuracy: true,

        timeout: 15000,

        maximumAge: 0,
      }
    );
  };


  /* =======================================================
     HIDE ROUTE
  ======================================================= */

  const hideDirections = () => {

    setShowDirections(false);

    setRoute([]);

    setRouteDistance(null);

    setRouteDuration(null);

    setRouteError("");
  };


  /* =======================================================
     GOOGLE NAVIGATION URL
  ======================================================= */

  const navigationUrl = userLocation

    ? `https://www.google.com/maps/dir/?api=1` +
      `&origin=${userLocation.lat},${userLocation.lng}` +
      `&destination=${latitude},${longitude}` +
      `&travelmode=driving`

    : `https://www.google.com/maps/dir/?api=1` +
      `&destination=${latitude},${longitude}` +
      `&travelmode=driving`;


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <div className="weather-map">


      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="map-header">

        <div>

          <h2>
            📍 Weather Map
          </h2>

          <p>
            {weather.city ||
              "Current Location"}
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


      {/* ===================================================
          MAP
      =================================================== */}

      <MapContainer

        center={[
          latitude,
          longitude,
        ]}

        zoom={11}

        scrollWheelZoom={true}

        className="map"

      >

        <TileLayer

          attribution="
            &copy; OpenStreetMap contributors
          "

          url="
            https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
          "

        />


        {/* =================================================
            DESTINATION
        ================================================= */}

        <Marker

          position={[
            latitude,
            longitude,
          ]}

          icon={destinationIcon}

        >

          <Popup>

            <div className="weather-popup">

              <h3>
                🏁{" "}
                {weather.city ||
                  "Weather Location"}
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


        {/* =================================================
            CURRENT LOCATION
        ================================================= */}

        {userLocation && (

          <Marker

            position={[
              userLocation.lat,
              userLocation.lng,
            ]}

            icon={currentLocationIcon}

          >

            <Popup>

              <strong>
                📍 Your Current Location
              </strong>

              <br />

              <small>
                Starting point
              </small>

            </Popup>

          </Marker>

        )}


        {/* =================================================
            ACTUAL DRIVING ROUTE
        ================================================= */}

        {route.length > 0 && (

          <>

            <Polyline

              positions={route}

              pathOptions={{
                color: "#0066ff",
                weight: 7,
                opacity: 0.9,
                lineCap: "round",
                lineJoin: "round",
              }}

            />

            <RouteMapController
              route={route}
            />

          </>

        )}

      </MapContainer>


      {/* ===================================================
          DIRECTIONS BUTTON
      =================================================== */}

      <div className="map-actions">

        {!showDirections ? (

          <button
            type="button"
            className="directions-button"
            onClick={handleDirections}
            disabled={locationLoading}
          >

            {locationLoading
              ? "📍 Detecting Location..."
              : "🧭 Get Directions"}

          </button>

        ) : (

          <button
            type="button"
            className="directions-button hide"
            onClick={hideDirections}
          >

            ✕ Hide Directions

          </button>

        )}

      </div>


      {/* ===================================================
          DIRECTIONS PANEL
      =================================================== */}

      {showDirections && (

        <div className="directions-panel">


          <div className="directions-header">

            <h3>
              🧭 Route to{" "}
              {weather.city ||
                "Selected Location"}
            </h3>

            <p>
              Actual road route calculated
              using OpenStreetMap routing.
            </p>

          </div>


          {/* =================================================
              FROM
          ================================================= */}

          <div className="route-location">

            <div className="route-icon current">
              📍
            </div>

            <div>

              <span>
                From
              </span>

              <strong>

                {locationLoading
                  ? "Detecting your location..."
                  : userLocation
                  ? "Your Current Location"
                  : "Location unavailable"}

              </strong>

            </div>

          </div>


          <div className="route-line">
            ↓
          </div>


          {/* =================================================
              TO
          ================================================= */}

          <div className="route-location">

            <div className="route-icon destination">
              🏁
            </div>

            <div>

              <span>
                To
              </span>

              <strong>
                {weather.city ||
                  "Selected Location"}
              </strong>

            </div>

          </div>


          {/* =================================================
              LOADING
          ================================================= */}

          {routeLoading && (

            <div className="route-loading">

              <div className="route-spinner"></div>

              <span>
                Finding actual driving route...
              </span>

            </div>

          )}


          {/* =================================================
              ROUTE ERROR
          ================================================= */}

          {routeError && (

            <div className="location-error">

              ⚠️{" "}
              {routeError}

            </div>

          )}


          {/* =================================================
              LOCATION ERROR
          ================================================= */}

          {locationError && (

            <div className="location-error">

              ⚠️{" "}
              {locationError}

            </div>

          )}


          {/* =================================================
              DISTANCE + TIME
          ================================================= */}

          {!routeLoading &&
            routeDistance !== null &&
            routeDuration !== null && (

              <div className="route-summary">


                <div className="summary-item">

                  <div className="summary-icon">
                    📏
                  </div>

                  <div className="summary-info">

                    <span>
                      Road Distance
                    </span>

                    <strong>
                      {formatDistance(
                        routeDistance
                      )}
                    </strong>

                  </div>

                </div>


                <div className="summary-divider"></div>


                <div className="summary-item">

                  <div className="summary-icon">
                    ⏱️
                  </div>

                  <div className="summary-info">

                    <span>
                      Estimated Driving Time
                    </span>

                    <strong>
                      {formatDuration(
                        routeDuration
                      )}
                    </strong>

                  </div>

                </div>

              </div>

            )}


          {/* =================================================
              RECALCULATE
          ================================================= */}

          {userLocation &&
            !routeLoading && (

              <button

                type="button"

                className="recalculate-button"

                onClick={handleDirections}

              >

                🔄 Recalculate Route

              </button>

            )}


          {/* =================================================
              GOOGLE NAVIGATION
          ================================================= */}

          <a

            href={navigationUrl}

            target="_blank"

            rel="noopener noreferrer"

            className="start-navigation"

          >

            🧭 Start Navigation

          </a>


        </div>

      )}

    </div>
  );
};


export default WeatherMap;