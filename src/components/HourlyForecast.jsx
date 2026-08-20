import React from "react";
import "./HourlyForecast.css";

const HourlyForecast = ({
  forecast = [],
}) => {

  if (!forecast.length) {
    return null;
  }
  // console.log("Hourly data from jsx page :", forecast)

  return (

    <div className="hourly-container">

      <div className="hourly-header">

        <h2>
          24-Hour Forecast
        </h2>

      </div>


      <div className="hourly-scroll">

        {forecast
          .slice(0, 24)
          .map((hour, index) => (

            <div
              className="hour-card"
              key={
                hour.date || `${hour.time}-${index}`
              }
            >

              {/* Time */}

              <p className="hour-time">
                {hour.time}
              </p>

              {/* Weather Icon */}

              {hour.icon && (

                <img
                  src={hour.icon}
                  alt={
                    hour.description ||
                    "Weather"
                  }
                  className="hour-icon"
                />

              )}


              {/* Temperature */}

              <p className="hour-temp">
                {hour.temperature}°
              </p>


              {/* Feels Like */}

              <p className="hour-feels">
                Feels {hour.feelsLike}°
              </p>


              {/* Rain Chance */}

              <p className="hour-rain">

                🌧 {hour.rainChance}%

              </p>


              {/* Description */}

              <p className="hour-desc">

                {hour.description}

              </p>


              {/* Humidity */}

              {/* <p className="hour-extra">

                💧 {hour.humidity}%

              </p> */}


              {/* Wind */}

              {/* <p className="hour-extra">

                💨 {hour.windSpeed} km/h

              </p> */}

            </div>

          ))}

      </div>

    </div>

  );
};

export default HourlyForecast;