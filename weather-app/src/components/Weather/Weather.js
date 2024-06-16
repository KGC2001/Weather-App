// src/components/Weather.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Weather.css';

const Weather = () => {
  const [location, setLocation] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [timeData, setTimeData] = useState(null);
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const weatherApiKey = '38fb871669543dcffae61c774161d73a'; // Replace with your OpenWeather API key
  const timeZoneApiKey = 'DV41RZK9OGA8'; // Replace with your TimeZoneDB API key

  const fetchTime = useCallback(async (lat, lon) => {
    try {
      const timeResponse = await axios.get(
        `http://api.timezonedb.com/v2.1/get-time-zone?key=${timeZoneApiKey}&format=json&by=position&lat=${lat}&lng=${lon}`
      );
      setTimeData(timeResponse.data);
    } catch (err) {
      setError('Unable to fetch time data');
      setTimeData(null);
    }
  }, [timeZoneApiKey]);
  const fetchWeather = useCallback(async (location) => {
    try {
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${weatherApiKey}`
      );
      setWeatherData(weatherResponse.data);
      fetchTime(weatherResponse.data.coord.lat, weatherResponse.data.coord.lon);
      setError('');
    } catch (err) {
      setError('Location not found');
      setWeatherData(null);
      setTimeData(null);
    }
  },[fetchTime]);



  const handleSearch = () => {
    if (location) {
      fetchWeather(location);
    }
  };

  const handleDarkModeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  useEffect(() => {
    // Fetch weather for default location on initial render
    fetchWeather('new york');
  }, [fetchWeather]);

  return (
    <div className={`weather-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter city name ...."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
        <button onClick={handleDarkModeToggle}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      {error && <p className="error">{error}</p>}
      {weatherData && timeData && (
        <div className="weather-info">
          <h2>{weatherData.name}</h2>
          <p>{new Date(timeData.formatted).toLocaleString()}</p>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Humidity: {weatherData.main.humidity}%</p>
          <p>Wind Speed: {weatherData.wind.speed} m/s</p>
          <p>{weatherData.weather[0].description}</p>
        </div>
      )}
    </div>

  );
};

export default Weather;
