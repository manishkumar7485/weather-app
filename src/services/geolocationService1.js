// services/geolocationService.js

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage = "Unable to retrieve your location.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user.";
            break;

          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;

          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;

          default:
            errorMessage = "An unknown geolocation error occurred.";
        }

        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  });
};

export const getCityFromCoordinates = async (coordinates) => {
  try {
    const apiKey =
      process.env.REACT_APP_OPENWEATHER_API_KEY ||
      "1bc5d446b342dce8d4069504af326b92";

    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${coordinates.latitude}&lon=${coordinates.longitude}&limit=1&appid=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("No location data found.");
    }

    // Debug response
    console.log("Reverse Geocoding Response:", data);

    const location = data[0];

    return {
      city: location.name || "",
      state:
        location.state ||
        location.region ||
        location.county ||
        location.province ||
        "",
      country: location.country || "",
      latitude: location.lat,
      longitude: location.lon,
      coordinates,
    };
  } catch (error) {
    console.error("Reverse Geocoding Error:", error);

    return {
      city: "",
      state: "",
      country: "",
      coordinates,
    };
  }
};