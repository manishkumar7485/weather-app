import React, { useEffect, useState } from "react";
import "./LoadingScreen.css";

import { WiDayCloudy } from "react-icons/wi";

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
          onComplete?.();
        }, 300);
      }
    }, 30);

    return () => {
      clearInterval(interval);
    };
  }, [onComplete]);

  return (
    <div className="loading-screen">

      {/* ==================================================
          SUN
      ================================================== */}

      <div
        className="loading-sun"
        aria-hidden="true"
      />


      {/* ==================================================
          CLOUD 1
      ================================================== */}

      <div
        className="loading-cloud cloud-one"
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
        >
          <path
            fill="rgb(156, 158, 161)"
            opacity="0.09"
            d="M112 256C112 167.6 183.6 96 272 96C319.1 96 361.4 116.4 390.7 148.7C401.3 145.6 412.5 144 424 144C490.3 144 544 197.7 544 264C544 277.2 541.9 289.9 537.9 301.8C579.5 322.9 608 366.1 608 416C608 486.7 550.7 544 480 544L176 544C96.5 544 32 479.5 32 400C32 343.2 64.9 294.1 112.7 270.6C112.3 265.8 112 260.9 112 256zM272 144C210.1 144 160 194.1 160 256C160 264.4 160.9 272.6 162.7 280.5C165.4 292.6 158.4 304.8 146.6 308.6C107.9 321 80 357.3 80 400C80 453 123 496 176 496L480 496C524.2 496 560 460.2 560 416C560 378.6 534.3 347.1 499.5 338.4C492 336.5 485.9 331.2 483 324.1C480.1 317 480.9 308.9 485 302.4C492 291.3 496 278.2 496 264.1C496 224.3 463.8 192.1 424 192.1C412.9 192.1 402.5 194.6 393.2 199C382.7 204 370.1 200.7 363.4 191.2C343.1 162.6 309.7 144.1 272.1 144.1z"
          />
        </svg>
      </div>


      {/* ==================================================
          CLOUD 2
      ================================================== */}

      <div
        className="loading-cloud cloud-two"
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
        >
          <path
            fill="rgb(47, 51, 109)"
            opacity="0.42"
            d="M112 256C112 167.6 183.6 96 272 96C319.1 96 361.4 116.4 390.7 148.7C401.3 145.6 412.5 144 424 144C490.3 144 544 197.7 544 264C544 277.2 541.9 289.9 537.9 301.8C579.5 322.9 608 366.1 608 416C608 486.7 550.7 544 480 544L176 544C96.5 544 32 479.5 32 400C32 343.2 64.9 294.1 112.7 270.6C112.3 265.8 112 260.9 112 256zM272 144C210.1 144 160 194.1 160 256C160 264.4 160.9 272.6 162.7 280.5C165.4 292.6 158.4 304.8 146.6 308.6C107.9 321 80 357.3 80 400C80 453 123 496 176 496L480 496C524.2 496 560 460.2 560 416C560 378.6 534.3 347.1 499.5 338.4C492 336.5 485.9 331.2 483 324.1C480.1 317 480.9 308.9 485 302.4C492 291.3 496 278.2 496 264.1C496 224.3 463.8 192.1 424 192.1C412.9 192.1 402.5 194.6 393.2 199C382.7 204 370.1 200.7 363.4 191.2C343.1 162.6 309.7 144.1 272.1 144.1z"
          />
        </svg>
      </div>


      {/* ==================================================
          CLOUD 3
      ================================================== */}

      <div
        className="loading-cloud cloud-three"
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
        >
          <path
            fill="rgb(255, 255, 255)"
            opacity="0.10"
            d="M112 256C112 167.6 183.6 96 272 96C319.1 96 361.4 116.4 390.7 148.7C401.3 145.6 412.5 144 424 144C490.3 144 544 197.7 544 264C544 277.2 541.9 289.9 537.9 301.8C579.5 322.9 608 366.1 608 416C608 486.7 550.7 544 480 544L176 544C96.5 544 32 479.5 32 400C32 343.2 64.9 294.1 112.7 270.6C112.3 265.8 112 260.9 112 256zM272 144C210.1 144 160 194.1 160 256C160 264.4 160.9 272.6 162.7 280.5C165.4 292.6 158.4 304.8 146.6 308.6C107.9 321 80 357.3 80 400C80 453 123 496 176 496L480 496C524.2 496 560 460.2 560 416C560 378.6 534.3 347.1 499.5 338.4C492 336.5 485.9 331.2 483 324.1C480.1 317 480.9 308.9 485 302.4C492 291.3 496 278.2 496 264.1C496 224.3 463.8 192.1 424 192.1C412.9 192.1 402.5 194.6 393.2 199C382.7 204 370.1 200.7 363.4 191.2C343.1 162.6 309.7 144.1 272.1 144.1z"
          />
        </svg>
      </div>


      {/* ==================================================
          RAIN
      ================================================== */}

      <div className="rain rain-one" />
      <div className="rain rain-two" />
      <div className="rain rain-three" />
      <div className="rain rain-four" />
      <div className="rain rain-five" />
      <div className="rain rain-six" />


      {/* ==================================================
          LOADING CARD
      ================================================== */}

      <div className="loading-card">

        {/* Weather Icon */}

        <div
          className="loading-weather-icon"
          aria-hidden="true"
        >
          <WiDayCloudy />
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

        <div
          className="loading-progress"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={progress}
        >
          <div
            className="loading-progress-bar"
            style={{
              width: `${progress}%`,
            }}
          />
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