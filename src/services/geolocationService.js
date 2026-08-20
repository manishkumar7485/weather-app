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
        let message = "Unable to retrieve your location.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied.";
            break;

          case error.POSITION_UNAVAILABLE:
            message = "Location unavailable.";
            break;

          case error.TIMEOUT:
            message = "Location request timed out.";
            break;

          default:
            message = "Unknown location error.";
        }

        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  });
};

export const getCityFromCoordinates = async ({
  latitude,
  longitude,
}) => {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch location details.");
    }

    const data = await response.json();

    console.log("BigDataCloud Response:", data);

    return {
      city:
        data.city ||
        data.locality ||
        data.localityInfo?.administrative?.[2]?.name ||
        "",

      state:
        data.principalSubdivision ||
        "",

      district:
        data.localityInfo?.administrative?.[3]?.name ||
        "",

      country:
        data.countryName ||
        "",

      countryCode:
        data.countryCode ||
        "",

      postcode:
        data.postcode ||
        "",

      latitude,
      longitude,
    };
  } catch (error) {
    console.error(error);

    throw new Error("Failed to retrieve city information.");
  }
};