# MyCityWeather (React + javascript)

MyCityWeather is a simple weather app that shows current conditions for your location or any searched city. It uses the OpenWeatherMap API and the browser Geolocation API.

## Features

- Current location weather with permission handling and graceful fallback
- Search by city name (e.g., Hyderabad, Bhopal)
- Summary card plus detailed metrics: feels like, humidity, pressure, wind, visibility, sunrise/sunset
- Loading and error states

## Tech Stack

- React + javascript (Create React App)
- Axios for API requests
- OpenWeatherMap Current Weather + Geocoding APIs

## Prerequisites

- Node.js 16+ and npm
- An OpenWeatherMap API key: `https://openweathermap.org/api`

## Quick Start

1. Install dependencies:
   - `npm install`
2. Configure your OpenWeatherMap API key (see Configuration below).
3. Start the dev server:
   - `npm start`
4. Open `http://localhost:3000`.

## Configuration (OpenWeatherMap API Key)

This project currently has the API key defined directly in code. Update the key in these files:

- `src/services/weatherService.ts` (constant `API_KEY`)
- `src/services/geolocationService.ts` (reverse geocoding URL `appid` param)

Replace the placeholder with your key.

Example locations:

- `src/services/weatherService.ts` → `const API_KEY = 'YOUR_KEY_HERE'`
- `src/services/geolocationService.ts` → reverse geocoding URL `...&appid=YOUR_KEY_HERE`

Optional (recommended): switch to environment variables.

1) Create a `.env` file in the project root:

```
REACT_APP_OPENWEATHER_API_KEY=your_api_key
```

2) Refactor the services to read `process.env.REACT_APP_OPENWEATHER_API_KEY` instead of hardcoding. Restart `npm start` after changing `.env`.

## Scripts

- `npm start`: Run the app in development mode
- `npm test`: Run tests in watch mode
- `npm run build`: Create a production build in `build/`

## Project Structure

```
weather-app/
  src/
    components/
      SearchBar.jsx
      WeatherCard.jsx
      WeatherDetails.jsx
    services/
      geolocationService.js
      weatherService.js
    App.jsx
```

## Usage

- On load, the app requests location. If granted, it shows your local weather; if denied or unavailable, it falls back to Hyderabad (you can search any city).
- Use the search bar to fetch another city.

## Troubleshooting

- 401 Invalid API key: Verify your key in the service files or `.env`.
- 404 City not found: Check spelling or try a different city.
- Geolocation denied/unavailable: Grant permission in the browser or use search.

## Build & Deploy

Create an optimized production build:

```
npm run build
```

Serve the `build/` directory with any static host (Netlify, Vercel, GitHub Pages, etc.).
