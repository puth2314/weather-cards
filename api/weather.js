const axios = require('axios');

module.exports = async (req, res) => {
  const { city } = req.query;
  const apiKey = process.env.OPENWEATHERMAP_APIKEY; 
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?` + `q=${city}` + `&appid=${apiKey}` + `&units=metric`;

//   res.setHeader('Access-Control-Allow-Origin', 'https://puth2314.github.io');  
  res.setHeader('Access-Control-Allow-Origin', '*');  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); 

  try {
    const response = await axios.get(apiUrl);
    res.status(200).json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ error: 'City not found. Please check the city name and try again.' });
    }
    res.status(500).json({ error: 'Error fetching weather data!' });
  }
};