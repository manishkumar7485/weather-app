import React, { useEffect, useState } from "react";
import "./LoadingScreen.css";

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const duration = 2500;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;

      const percentage = Math.min(
        Math.round((elapsed / duration) * 100),
        100
      );

      setProgress(percentage);

      if (percentage >= 100) {
        clearInterval(interval);

        setTimeout(() => {
          onComplete();
        }, 300);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="loading-screen">

      {/* Animated Weather Background */}

      <div className="loading-sun"></div>

      <div className="loading-cloud cloud-one"></div>
      <div className="loading-cloud cloud-two"></div>
      <div className="loading-cloud cloud-three"></div>

      <div className="rain rain-one"></div>
      <div className="rain rain-two"></div>
      <div className="rain rain-three"></div>
      <div className="rain rain-four"></div>
      <div className="rain rain-five"></div>
      <div className="rain rain-six"></div>


      {/* Loading Card */}

      <div className="loading-card">

        {/* Weather Icon */}

        <div className="loading-weather-icon">
          🌤️
        </div>


        {/* Title */}

        <h1>
          Weather Dashboard
        </h1>


        {/* Description */}

        <p className="loading-description">
          Getting the latest weather information...
        </p>


        {/* Progress */}

        <div className="loading-progress">

          <div
            className="loading-progress-bar"
            style={{
              width: `${progress}%`,
            }}
          ></div>

        </div>


        {/* Percentage */}

        <div className="loading-percentage">
          {progress}%
        </div>


        {/* Status */}

        <p className="loading-status">
          {progress < 100
            ? "Please wait"
            : "Ready!"}
        </p>

      </div>

    </div>
  );
};

export default LoadingScreen;