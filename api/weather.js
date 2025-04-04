const axios = require('axios');

module.exports = async (req, res) => {
  const { city } = req.query;  // The city is sent as a query parameter
  const apiKey = process.env.OPENWEATHERAPP_APIKEY;  // Store your OpenWeatherMap API key in environment variables

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(apiUrl);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching weather data' });
  }
};