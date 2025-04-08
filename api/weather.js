const axios = require('axios');

module.exports = async (req, res) => {
    const { 'weather-type': weatherType , 
                'location':    location } = req.query;
    const apiKey = process.env.OPENWEATHERMAP_APIKEY; 
    const apiUrl = `https://api.openweathermap.org/data/2.5/${weatherType}?q=${location}&units=metric&appid=${apiKey}`;

    res.setHeader('Access-Control-Allow-Origin', 'https://puth2314.github.io'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); 

    try {
      const response = await axios.get(apiUrl);
      res.status(200).json(response.data);
    } catch (error) {
        if (error.response && error.response.status === 404) {
          res.status(404).json({ error: error.response.data });
        } else {
          res.status(500).json({ error: `Unexpected error occurred while fetching data.` });
        }
    }
};
