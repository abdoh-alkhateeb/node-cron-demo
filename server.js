const express = require('express');
const cron = require('node-cron');

const app = express();

const host = 'localhost';
const port = 3000;

let weatherData = null;

async function fetchWeather() {
  try {
    const response = await fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=30.0626&longitude=31.2497&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day&timezone=Africa%2FCairo'
    );

    if (!response.ok) throw new Error('Failed to fetch data');

    const data = await response.json();

    weatherData = data;

    console.log('Weather data updated:', new Date().toISOString());
  } catch (error) {
    console.error('Error fetching weather:', error.message);
  }
}

cron.schedule('*/5 * * * *', () => {
  console.log('Running scheduled task...');
  fetchWeather();
});

app.get('/weather', (req, res) => {
  if (!weatherData)
    return res.status(503).json({ message: 'Weather data not yet available' });

  res.json(weatherData);
});

app.listen(port, host, () => {
  console.log(`Server listening at http://${host}:${port}`);
  fetchWeather();
});
