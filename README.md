# 🌦️ MyCityWeather

A modern, responsive weather application built with **React** that provides real-time weather information, hourly and 5-day forecasts, air quality data, weather highlights, an interactive map, animated weather backgrounds, and dark/light theme support.

---

## 🚀 Features

### 🌍 Current Location Weather

* Detects the user's current location using the Browser Geolocation API.
* Gracefully falls back to a default city if location permission is denied.
* Displays city, state, district, country, and postal code using the BigDataCloud Reverse Geocoding API.

### 🔍 Search Weather

* Search weather by city name.
* Dynamic URL routing for searched cities.
* Instant weather updates.

### 🌤 Current Weather

* Temperature
* Weather description
* Weather icon
* Feels Like temperature
* Humidity
* Pressure
* Wind Speed
* Visibility
* Sunrise & Sunset

### ⏰ Hourly Forecast

* Hour-by-hour forecast
* Temperature
* Weather icon
* Rain probability
* Weather description

### 📅 5-Day Forecast

* Daily weather forecast
* Maximum & Minimum temperature
* Weather condition
* Rain probability

### 🌱 Air Quality Index (AQI)

* AQI Level
* PM2.5
* PM10
* CO
* NO₂
* SO₂
* O₃

### 📊 Weather Highlights

* Feels Like
* Humidity
* Pressure
* Visibility
* Wind Speed
* Wind Direction
* Cloud Coverage
* Sunrise
* Sunset

### 🗺 Interactive Weather Map

* Displays the selected city's location on an interactive Leaflet map.
* Uses OpenStreetMap tiles.
* Weather marker with city information.

### 🎨 Animated Weather Background

Background changes automatically based on current weather conditions:

* ☀️ Sunny
* ☁️ Cloudy
* 🌧 Rain
* ⛈ Thunderstorm
* ❄️ Snow
* 🌫 Fog
* 🌙 Night

Includes animated effects such as:

* Floating weather icons
* Rain animation
* Snowfall
* Lightning
* Twinkling stars

### 🌗 Dark / Light Theme

* One-click theme switch.
* Theme preference stored in Local Storage.
* Smooth transitions between themes.

### 📱 Fully Responsive

Optimized for:

* Desktop
* Laptop
* Tablet
* Mobile

---

# 🛠 Tech Stack

### Frontend

* React
* JavaScript (ES6+)
* React Router DOM
* Axios
* CSS3

### APIs

* OpenWeather Current Weather API
* OpenWeather Forecast API
* OpenWeather Air Pollution API
* BigDataCloud Reverse Geocoding API

### Maps

* React Leaflet
* Leaflet
* OpenStreetMap

---

# 📦 Installation

Clone the repository

```bash
git clone https://github.com/yourusername/MyCityWeather.git
```

Navigate to the project

```bash
cd MyCityWeather
```

Install dependencies

```bash
npm install
```

Start the development server

```bash
npm start
```

Open your browser

```
http://localhost:3000
```

---

# 🔑 Environment Variables

Create a `.env` file in the project root.

```env
REACT_APP_OPENWEATHER_API_KEY=YOUR_API_KEY
```

Restart the development server after updating the `.env` file.

---

# 📂 Project Structure

```text
src
│
├── assets
│
├── components
│   ├── AirQualityCard.jsx
│   ├── DailyForecast.jsx
│   ├── HourlyForecast.jsx
│   ├── SearchBar.jsx
│   ├── ThemeToggle.jsx
│   ├── WeatherBackground.jsx
│   ├── WeatherCard.jsx
│   ├── WeatherDetails.jsx
│   ├── WeatherHighlights.jsx
│   └── WeatherMap.jsx
│
├── context
│   └── ThemeContext.jsx
│
├── services
│   ├── geolocationService.js
│   └── weatherService.js
│
├── App.jsx
├── index.css
└── main.jsx
```

---

# 📡 APIs Used

### OpenWeather

Current Weather

```
https://api.openweathermap.org/data/2.5/weather
```

5-Day Forecast

```
https://api.openweathermap.org/data/2.5/forecast
```

Air Quality

```
https://api.openweathermap.org/data/2.5/air_pollution
```

Weather Icons

```
https://openweathermap.org/img/wn/
```

### BigDataCloud

Reverse Geocoding

```
https://api.bigdatacloud.net/data/reverse-geocode-client
```

---

# 📸 Application Features

* 🌍 Current Location Detection
* 🔍 Search by City
* 🌤 Live Weather
* 📅 5-Day Forecast
* ⏰ Hourly Forecast
* 🌱 Air Quality Index
* 📊 Weather Highlights
* 🗺 Interactive Weather Map
* 🎨 Animated Weather Background
* 🌙 Dark / Light Theme
* 📱 Responsive UI

---

# 🚀 Build for Production

```bash
npm run build
```

The optimized production files will be generated in the `build` folder.

---

# 🚀 Deployment

This project can be deployed to:

* GitHub Pages
* Netlify
* Vercel
* Firebase Hosting
* Render

---

# 🔮 Future Improvements

* Weather Alerts
* Weather Notifications
* Favorite Cities
* Recent Searches
* Temperature Charts
* Weather History
* Sunrise & Sunset Animation
* UV Index
* Moon Phase
* Multi-language Support

---

## 🌐 Live Demo

You can try the deployed application here:

**🔗 Live Weather App:**
**https://manishkumar7485.github.io/weather-app/#/weather**

Or simply click the link below:

👉 **MyCityWeather Live Demo**
https://manishkumar7485.github.io/weather-app/#/weather

---

## 📸 Preview

Explore the application to experience:

* 🌍 Current Location Weather
* 🔍 Search by City
* 🌤 Live Weather Updates
* ⏰ Hourly Forecast
* 📅 5-Day Forecast
* 🌱 Air Quality Index (AQI)
* 📊 Weather Highlights
* 🗺 Interactive Weather Map
* 🎨 Animated Weather Background
* 🌙 Dark & Light Theme
* 📱 Fully Responsive Design

---


# 👨‍💻 Author

**Manish Kumar**

Built with ❤️ using React, JavaScript, OpenWeather API, Leaflet, and BigDataCloud.
