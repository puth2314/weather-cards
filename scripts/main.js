const mainContainer = document.querySelector('main');
const locationForm  = document.querySelector('form');
const locationInput = document.querySelector('input');
const resultsContainer  = document.getElementById('results-container');
const locationContainer = document.getElementById('location-container');
const weatherContainer  = document.getElementById('weather-container');
const detailsContainer  = document.getElementById('details-container');
const forecastContainer = document.getElementById('forecast-container');
const errorContainer    = document.getElementById('error-container');

locationForm.addEventListener('submit', function (submitEvent) {
    submitEvent.preventDefault();
    getWeather(locationInput.value, 'weather');
});

// const apiKey = '';
// const weatherApiUrl = `https://api.openweathermap.org/data/2.5/`;
const weatherApiUrl = 'https://weather-website-ten-zeta.vercel.app/api/weather'

function getWeather(location, weatherType) {
    // const weatherApiQuery = `${weatherType}?q=${location}&units=metric&appid=${apiKey}`;
    const weatherApiQuery = `?location=${location}&weather-type=${weatherType}`;
    fetch(weatherApiUrl + weatherApiQuery)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            const errorCode = data.cod.toString();
            if (errorCode !== '200') {
              const error = new Error(data.message);
              error.code = errorCode;
              throw error;
            }

            if (weatherType === 'weather') {
                displayWeather(data);
                getWeather(location, 'forecast');
            } else if (weatherType === 'forecast') {
                displayForecast(data.list);
            } else {
              throw new Error(`Invalid weatherType, must be either 'weather' or 'forecast'.`)
            }

            showContainer(  errorContainer, false);
            showContainer(resultsContainer,  true);
            // mainContainer.style.height = `400px`;

        })
        .catch(err => {

            mainContainer.classList.add('shaking-anim');
            setTimeout(() => {
                mainContainer.classList.remove('shaking-anim');
            }, 300);

            let errorMessage, errorAlert;
            if (err.code === '404') {
                errorAlert   = `Oops,location not found.`;                
                errorMessage = `Oops, location "<i>${locationInput.value}</i>" was not found.`;
                // errorMessage = `Are you sure "${locationInput.value}" is a valid location?`;
            } else {
                errorAlert   = `Oops, unexpected error while fetching ${weatherType} data.`;
                errorMessage = `${err.code}: ${err.message}`;
            }
            errorContainer.querySelector('figcaption').innerHTML = errorMessage;
            // alert(errorAlert);

            showContainer(resultsContainer, false);
            showContainer(  errorContainer,  true);
            // mainContainer.style.height = `500px`;

        })
        .finally(() => {  
            locationInput.value = '';
        });
}

function displayWeather(weatherData) {
    const locationName        = weatherData.name;    
    const locationCountryCode = weatherData.sys.country;
    const weatherIconCode     = weatherData.weather[0].icon;
    const weatherTemperature  = parseInt(weatherData.main.temp);
    const weatherDescription  = weatherData.weather[0].description;
    const detailsClouds       = weatherData.clouds.all;
    const detailsWindSpeed    = parseInt(weatherData.wind.speed);

    locationContainer.querySelector('span').innerText       = locationName;
    locationContainer.querySelector('img').src              = `https://flagsapi.com/${locationCountryCode}/shiny/48.png`; 
    weatherContainer.querySelector('p').innerText           = `${weatherTemperature}°C`;
    weatherContainer.querySelector('img').src               = `https://openweathermap.org/img/wn/${weatherIconCode}@4x.png`;
    weatherContainer.querySelector('figcaption').innerText  = capitalizeWords(weatherDescription);
    detailsContainer.querySelector('#clouds').innerText     = `${detailsClouds}%`;
    detailsContainer.querySelector('#wind-speed').innerText = `${detailsWindSpeed}km/h`;
} 

function displayForecast(forecastData) {
    forecastContainer.innerHTML = '';

    forecastData = forecastData.slice(0, 8);
    forecastData.forEach(item => {
        const forecastDateTime    = new Date(item.dt * 1000);
        const forecastHour        = forecastDateTime.getHours();
        const forecastIconCode    = item.weather[0].icon; 
        const forecastTemperature = parseInt(item.main.temp);

        const forecastFigure  = document.createElement('figure');
        const forecastCaption = document.createElement('figcaption');
        const forecastImage   = document.createElement('img');
        forecastCaption.textContent = `${forecastHour}:00`;
        forecastImage.src = `https://openweathermap.org/img/wn/${forecastIconCode}.png`;
        forecastFigure.appendChild(forecastCaption);
        forecastFigure.appendChild(forecastImage);

        const forecastTempSpan = document.createElement('span');
        forecastTempSpan.textContent = `${forecastTemperature}°C`;  

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.appendChild(forecastFigure);
        forecastItem.appendChild(forecastTempSpan);

        forecastContainer.appendChild(forecastItem)
    });
}

function capitalizeWords(str) {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
        .join(' '); 
}

function showContainer(container, boolToShow) {
    if (boolToShow) {
        requestAnimationFrame(() => {
            container.classList.remove('hidden');
            container.classList.add('fade-anim');
            setTimeout(() => {
                container.classList.remove('fade-anim');
            }, 1000);
        });
    } else {
        container.classList.add('hidden');
        // container.classList.remove('fade-anim');
    }
}

function initWebsite() {
  getWeather('Sydney', 'weather');
}

// initWebsite();
