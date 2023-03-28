const API_KEY = 'your_api_key_here';
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const pastSearches = document.getElementById('past-searches');
const weatherResults = document.getElementById('weather-results');
let cities = [];

// Fetch weather data from API
async function getWeatherData(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Add a new city to the list of past searches
function addCityToList(city) {
  const button = document.createElement('button');
  button.innerText = city;
  button.addEventListener('click', () => {
    cityInput.value = city;
    searchForm.dispatchEvent(new Event('submit'));
  });
  pastSearches.appendChild(button);
}

// Display the weather data for a city
function displayWeatherData(city, data) {
  const forecasts = data.list.filter((forecast) => forecast.dt_txt.includes('12:00:00'));
  const cityTitle = document.createElement('h2');
  cityTitle.innerText = city;
  weatherResults.innerHTML = '';
  weatherResults.appendChild(cityTitle);
  forecasts.forEach((forecast) => {
    const forecastDiv = document.createElement('div');
    forecastDiv.classList.add('forecast');
    const date = document.createElement('p');
    date.innerText = new Date(forecast.dt_txt).toLocaleDateString();
    forecastDiv.appendChild(date);
    const icon = document.createElement('img');
    icon.src = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    forecastDiv.appendChild(icon);
    const temp = document.createElement('p');
    temp.innerText = `${Math.round(forecast.main.temp)} °C`;
    forecastDiv.appendChild(temp);
    const desc = document.createElement('p');
    desc.innerText = forecast.weather[0].description;
    forecastDiv.appendChild(desc);
    weatherResults.appendChild(forecastDiv);
  });
}

// Handle form submit event
searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const city = cityInput.value.trim();
  if (city === '') {
    return;
  }
  try {
    const data = await getWeatherData(city);
    cities = cities.filter((c) => c !== city);
    cities.unshift(city);
    while (pastSearches.firstChild) {
      pastSearches.removeChild(pastSearches.firstChild);
    }
    cities.forEach((c) => addCityToList(c));
    displayWeatherData(city, data);
  } catch (error) {
    console.error(error);
    alert('An error occurred while fetching weather data.');
  }
});

// Load past searches from local storage
if (localStorage.getItem('cities')) {
  cities = JSON.parse(localStorage.getItem('cities'));
  cities.forEach((c) => addCityToList(c));
}

// Save past searches to local storage when the page is closed
window.addEventListener('beforeunload', () => {
  localStorage.setItem('cities', JSON.stringify(cities));
});
