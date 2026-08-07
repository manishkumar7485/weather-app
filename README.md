# 🌦️ MyCityWeather

**MyCityWeather** is a modern, responsive weather application built with **React** that provides real-time weather information, hourly and 5-day forecasts, air quality data, weather highlights, interactive maps, animated weather backgrounds, beautiful charts, and an AI-powered weather assistant called **Nimbus AI**.

---

## 🌐 Live Demo

🚀 **Try the application here**

👉 **https://manishkumar7485.github.io/weather-app/#/weather**

---

# ✨ Features

## 🌍 Current Location Weather

- Detects the user's current location using the Browser Geolocation API.
- Gracefully falls back to a default city if location permission is denied.
- Displays:
  - City
  - State
  - District
  - Country
  - Postal Code
- Reverse Geocoding powered by **BigDataCloud API**.

---

## 🔍 Search Weather

- Search weather by city name.
- Dynamic city routing.
- Instant weather updates.
- Refresh-safe navigation.

---

## 🌤 Current Weather

Displays detailed weather information including:

- 🌡 Temperature
- 🤗 Feels Like Temperature
- 🌤 Weather Description
- ☁ Weather Icon
- 💧 Humidity
- 🌬 Wind Speed
- 🧭 Wind Direction
- 👁 Visibility
- 📈 Pressure
- ☁ Cloud Coverage
- 🌅 Sunrise
- 🌇 Sunset

---

## ⏰ Hourly Forecast

- Hourly weather forecast
- Temperature
- Weather icons
- Rain probability
- Weather condition
- Humidity
- Wind speed

---

## 📅 5-Day Forecast

- Daily forecast
- Maximum & Minimum temperature
- Weather condition
- Rain probability

---

## 🌱 Air Quality Index (AQI)

Displays detailed air pollution information.

- AQI Level
- PM2.5
- PM10
- CO
- NO
- NO₂
- O₃
- SO₂
- NH₃

---

## 📊 Weather Highlights

Includes:

- Temperature
- Feels Like
- Humidity
- Pressure
- Wind Speed
- Wind Direction
- Visibility
- Cloud Coverage
- Sunrise
- Sunset

---

## 📈 Weather Analytics

Interactive weather charts built using **Recharts**.

Features:

- Temperature Trend
- Hourly Temperature Chart
- Responsive Graphs
- Smooth Animations

---

## 🗺 Interactive Weather Map

Built using **React Leaflet** and **OpenStreetMap**.

Features:

- Interactive map
- Current city marker
- Latitude & Longitude
- Zoom controls

---

## 🎨 Animated Weather Background

Dynamic animated backgrounds based on weather conditions.

Supported backgrounds:

- ☀ Sunny
- ☁ Cloudy
- 🌧 Rain
- ⛈ Thunderstorm
- ❄ Snow
- 🌫 Fog
- 🌙 Night

Animations include:

- Floating weather icons
- Rainfall
- Snowfall
- Lightning
- Twinkling stars

---

## 🤖 Nimbus AI

**Nimbus AI** is your smart weather companion.

### Features

- 💬 Floating AI Chat
- 🌦 Dynamic weather suggestions
- 🌡 Temperature insights
- 🌱 Air Quality explanation
- 🌧 Rain prediction
- ☂ Umbrella recommendations
- 🌅 Sunrise & Sunset information
- 🏃 Outdoor activity suggestions
- ⌨ Typing indicator
- 📜 Auto scrolling messages
- 🕒 Chat timestamps
- 📱 Responsive chat interface

> **Note:** AI integration is currently under development. The chatbot UI is fully functional and ready for API integration.

---

## 🌗 Dark / Light Theme

- One-click theme toggle
- Smooth transition
- Theme saved using Local Storage

---

## 📱 Fully Responsive

Optimized for:

- 🖥 Desktop
- 💻 Laptop
- 📱 Tablet
- 📲 Mobile
- 📏 Small Mobile Devices

---

# 🛠 Tech Stack

## Frontend

- React
- JavaScript (ES6+)
- React Router DOM
- Axios
- CSS3

---

## APIs

### OpenWeather API

- Current Weather
- 5-Day Forecast
- Air Pollution API
- Weather Icons

### BigDataCloud API

- Reverse Geocoding

---

## Maps

- React Leaflet
- Leaflet
- OpenStreetMap

---

## Charts

- Recharts

---

## Icons

- React Icons

---

# 📦 Installation

Clone the repository

```bash
git clone https://github.com/manishkumar7485/weather-app.git
```

Navigate into the project

```bash
cd weather-app
```

Install dependencies

```bash
npm install
```

Run the development server

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

REACT_APP_OPENWEATHER_BASE_URL=https://api.openweathermap.org/data/2.5

REACT_APP_OPENWEATHERAIR_BASE_URL=https://api.openweathermap.org/data/2.5/air_pollution

REACT_APP_BIGDATA_URL=https://api.bigdatacloud.net/data/reverse-geocode-client
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
│   ├── AIChat
│   ├── FloatingChatButton
│   ├── AirQualityCard
│   ├── DailyForecast
│   ├── HourlyForecast
│   ├── SearchBar
│   ├── ThemeToggle
│   ├── WeatherBackground
│   ├── WeatherCard
│   ├── WeatherChart
│   ├── WeatherHighlights
│   └── WeatherMap
│
├── context
│   └── ThemeContext.jsx
│
├── services
│   ├── geolocationService.js
│   ├── weatherService.js
│   └── chatService.js
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

Forecast

```
https://api.openweathermap.org/data/2.5/forecast
```

Air Pollution

```
https://api.openweathermap.org/data/2.5/air_pollution
```

Weather Icons

```
https://openweathermap.org/img/wn/
```

---

### BigDataCloud

Reverse Geocoding

```
https://api.bigdatacloud.net/data/reverse-geocode-client
```

---

# 📸 Application Features

- 🌍 Current Location Weather
- 🔍 Search by City
- 🌤 Live Weather
- 📈 Temperature Charts
- ⏰ Hourly Forecast
- 📅 5-Day Forecast
- 🌱 Air Quality Index
- 📊 Weather Highlights
- 🗺 Interactive Weather Map
- 🎨 Animated Weather Background
- 🤖 Nimbus AI Assistant
- 🌙 Dark / Light Theme
- 📱 Fully Responsive UI

---

# 🚀 Build for Production

```bash
npm run build
```

The optimized production build will be generated inside the **build** folder.

---

# 🚀 Deployment

This project can be deployed to:

- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting
- Render

---

# 🔮 Future Enhancements

- 🌩 Weather Alerts
- 🔔 Push Notifications
- ⭐ Favorite Cities
- 🕒 Recent Searches
- 📈 Advanced Weather Analytics
- 🌙 Moon Phase
- ☀ UV Index
- 🌐 Multi-language Support
- 🎤 Voice Assistant
- 🔊 Text-to-Speech
- 💾 Chat History
- 📸 Weather Image Recognition

---

# 👨‍💻 Author

**Manish Kumar**

---

# 🌦️ Nimbus AI

> **Nimbus AI**  
> **Powered by MyCityWeather**

Your intelligent weather companion for quick, friendly, and personalized weather insights.

---

## ⭐ Support

If you found this project helpful, don't forget to ⭐ **star the repository** on GitHub!