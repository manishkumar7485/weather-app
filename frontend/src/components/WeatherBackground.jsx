import "./WeatherBackground.css";

const WeatherBackground = ({ weather }) => {
  if (!weather) return null;

  const icon = weather.icon || "01d";

  let background = "sunny";

  switch (icon) {
    case "01d":
      background = "sunny";
      break;

    case "01n":
      background = "night";
      break;

    case "02d":
    case "03d":
    case "04d":
    case "02n":
    case "03n":
    case "04n":
      background = "cloudy";
      break;

    case "09d":
    case "09n":
    case "10d":
    case "10n":
      background = "rain";
      break;

    case "11d":
    case "11n":
      background = "storm";
      break;

    case "13d":
    case "13n":
      background = "snow";
      break;

    case "50d":
    case "50n":
      background = "fog";
      break;

    default:
      background = "sunny";
  }

  const iconUrl = `https://openweathermap.org/img/wn/${icon}@4x.png`;

  return (
    <div className={`weather-background ${background}`}>
      {[0, 1, 2].map((i) => (
        <img
          key={i}
          src={iconUrl}
          alt=""
          className={`weather-bg-icon icon-${i}`}
        />
      ))}

      {background === "rain" &&
        [...Array(150)].map((_, i) => (
          <span
            key={i}
            className="rain-drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${0.6 + Math.random()}s`,
            }}
          />
        ))}

      {background === "snow" &&
        [...Array(100)].map((_, i) => (
          <span
            key={i}
            className="snow-flake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}

      {background === "night" &&
        [...Array(120)].map((_, i) => (
          <span
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}

      {background === "storm" && (
        <div className="lightning"></div>
      )}

      <div className="overlay"></div>
    </div>
  );
};

export default WeatherBackground;