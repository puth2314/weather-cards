const form = document.getElementById('weather-form');
const cityInput = document.getElementById('city');
const weatherInfo = document.getElementById('weather-info');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const city = cityInput.value;
  getWeather(city);
});

async function getWeather(city) {
  const apiUrl = `https://weather-website-ten-zeta.vercel.app/api/weather?city=${city}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.cod === '404') {
      weatherInfo.innerHTML = '<p>City not found!</p>';
      return;
    }

    const { main, weather } = data;
    const temp = main.temp;
    const description = weather[0].description;
    const humidity = main.humidity;

    weatherInfo.innerHTML = `
      <h2>${city}</h2>
      <p>Temperature: ${temp}°C</p>
      <p>Weather: ${description}</p>
      <p>Humidity: ${humidity}%</p>
    `;
  } catch (error) {
    weatherInfo.innerHTML = '<p>Error fetching weather data!</p>';
  }
}
