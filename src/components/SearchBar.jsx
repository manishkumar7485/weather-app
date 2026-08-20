import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";

const SearchBar = ({ onSearch, onLocationClick, loading }) => {
  const [city, setCity] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const cityName = city.trim();

    if (!cityName || loading) return;

    navigate(`/weather/`, { replace: true });
    onSearch(cityName);
    setCity("");
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name..."
        className="search-input"
        disabled={loading}
      />

      <button
        type="submit"
        className="search-button"
        disabled={loading || !city.trim()}
        title="Search"
      >
        {loading ? (
          <div className="button-spinner"></div>
        ) : (
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        )}
      </button>

      <button
        type="button"
        className="location-button"
        onClick={() => {
          navigate("/weather");
          onLocationClick();
        }}
        disabled={loading}
        title="Use My Location"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>

        <span className="location-text">My Location</span>
      </button>
    </form>
  );
};

export default SearchBar;