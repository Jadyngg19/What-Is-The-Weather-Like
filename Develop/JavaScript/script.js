document.addEventListener("DOMContentLoaded", function() {

  const API_KEY = "52de64d1b3a04d9998a9dcb1948bc9cc";
  const API_URL = "https://api.openweathermap.org/data/2.5/forecast";

  // Get references to HTML elements
  const searchForm = document.querySelector("#search-form");
  const cityInput = document.querySelector("#city-input");
  const pastSearches = document.querySelector("#past-searches");
  const weatherResults = document.querySelector("#weather-results");
  const todayForecast = document.querySelector("#current-weather"); 
  const forecastHeaderDiv = document.querySelector("#forecast-header"); 

  function clearLocalStorageOnPageReload() {
    localStorage.clear();
  }
  
  window.onbeforeunload = clearLocalStorageOnPageReload;  

  // Check for past searches stored in localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const pastCity = localStorage.key(i);
    const pastSearch = document.createElement("p");
    pastSearch.textContent = pastCity;
    pastSearch.addEventListener("click", function() {
      // If past search is clicked, perform new search for that city
      cityInput.value = pastCity;
      searchForm.dispatchEvent(new Event("submit"));
    });
    pastSearches.appendChild(pastSearch);
  }

  // Event listener for form submission
  searchForm.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission behavior

    const city = cityInput.value.trim(); // Get city value from input and trim whitespace

    // Make API call to OpenWeather API
    fetch(`${API_URL}?q=${city}&units=imperial&appid=${API_KEY}`)
      .then(response => response.json())
      .then(data => {
        // Check if city has been searched before
        if (!localStorage.getItem(city)) {
          // If city has not been searched before, add it to past searches list
          const pastSearch = document.createElement("p");
          pastSearch.setAttribute("style", "width: fit-content; background-color: #da3a3a; cursor: pointer; border-radius: 5px; padding: 4px; color: white;"); 
          pastSearch.textContent = city;
          pastSearch.addEventListener("click", function() {
            // If past search is clicked, retrieve weather data from localStorage and render to weather results div
            const weatherData = JSON.parse(localStorage.getItem(city));
            renderWeatherData(weatherData);
          });
          pastSearches.appendChild(pastSearch);
        }

        // Save weather data to localStorage
        localStorage.setItem(city, JSON.stringify(data));

        // Render weather data to weather results div
        renderWeatherData(data);
      })
      .catch(error => console.log(error));

    // Clear input field after search
    cityInput.value = "";
  }); 

  function renderWeatherData(data) {
    // Clear weather results div
    weatherResults.innerHTML = "";
    todayForecast.innerHTML = ""; 
    forecastHeaderDiv.innerHTML = ""; 

    // Create current day weather div
    const currentWeatherDiv = document.createElement("div");
    currentWeatherDiv.classList.add("current");
    currentWeatherDiv.setAttribute("style", "display: block;")

    // Get current day weather data
    const currentWeather = data.list[0];
    const currentWeatherDate = new Date(currentWeather.dt * 1000);
    const currentWeatherIconURL = `https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`;

    // Create HTML elements to display current day weather data

    // Header
    const cityHeader = document.createElement("div");
    const currentWeatherCity = document.createElement("h1");
    const cityName = data.city.name;
    currentWeatherCity.textContent = cityName; 
    currentWeatherCity.setAttribute("style", "display: inline-block;"); 
    cityHeader.appendChild(currentWeatherCity);

    const currentWeatherDateH1 = document.createElement("h1");
    currentWeatherDateH1.textContent = `(${currentWeatherDate.toLocaleDateString()})`;
    currentWeatherDateH1.setAttribute("style", "display: inline-block; margin-left: 5px; margin-right: 5px;"); 
    cityHeader.appendChild(currentWeatherDateH1); 

    const currentWeatherIconImg = document.createElement("img");
    currentWeatherIconImg.src = currentWeatherIconURL;
    currentWeatherIconImg.setAttribute("style", "display: inline-block; transform: translateY(15px);");
    cityHeader.appendChild(currentWeatherIconImg); 
    currentWeatherDiv.appendChild(cityHeader); 

    const currentWeatherLine = document.createElement("hr"); 
    currentWeatherDiv.appendChild(currentWeatherLine); 

    const currentWeatherTempP = document.createElement("p");
    currentWeatherTempP.textContent = `Temp: ${Math.round(currentWeather.main.temp)}°F`;
    currentWeatherDiv.appendChild(currentWeatherTempP); 

    const currentWeatherWindP = document.createElement("p"); 
    currentWeatherWindP.textContent = `Wind: ${currentWeather.wind.speed} MPH`;
    currentWeatherDiv.appendChild(currentWeatherWindP); 

    const currentWeatherHumP = document.createElement("p"); 
    currentWeatherHumP.textContent = `Humidity: ${currentWeather.main.humidity}%`;
    currentWeatherDiv.appendChild(currentWeatherHumP); 
    currentWeatherDiv.setAttribute("style", "padding: 5px;"); 

    // Append current day weather div to the weather results div
    todayForecast.appendChild(currentWeatherDiv); 
    todayForecast.setAttribute("style", "display: flex; justify-content: left;"); 

    const forecastHeader = document.createElement("h2"); 
    forecastHeader.textContent = "5-Day Forecast:"; 
    forecastHeaderDiv.setAttribute("style", "display: block; text-align: center; margin-top: 10px;"); 
    forecastHeader.setAttribute("style", "display: block; margin-top: 45px;"); 
    forecastHeaderDiv.appendChild(forecastHeader); 

    // Loop through forecast data and create HTML elements to display
    for (let i = 1; i <= 5; i++) {
      const forecastWeatherDiv = document.createElement("div");
      forecastWeatherDiv.classList.add("forecast");
      forecastWeatherDiv.setAttribute("style", "display: block; padding: 5px;");
  
      // Get forecast weather data
      const forecastWeather = data.list[i];
      const forecastWeatherDate = new Date((forecastWeather.dt + 86400 * i) * 1000); // add 86400 seconds (1 day) for each iteration
      const forecastWeatherIconURL = `https://openweathermap.org/img/w/${forecastWeather.weather[0].icon}.png`;
  
      // Create HTML elements to display forecast weather data
      const forecastWeatherHeader = document.createElement("h4");
      forecastWeatherHeader.textContent = forecastWeatherDate.toLocaleDateString();
      forecastWeatherDiv.appendChild(forecastWeatherHeader);
  
      const forecastWeatherIconImg = document.createElement("img");
      forecastWeatherIconImg.src = forecastWeatherIconURL;
      forecastWeatherIconImg.setAttribute("style", "display: inline-block; transform: translateY(15px);");
      forecastWeatherDiv.appendChild(forecastWeatherIconImg); 
  
      const forecastWeatherTempP = document.createElement("p");
      forecastWeatherTempP.textContent = `Temp: ${Math.round(forecastWeather.main.temp)}°F`;
      forecastWeatherDiv.appendChild(forecastWeatherTempP);
  
      const forecastWeatherWindP = document.createElement("p");
      forecastWeatherWindP.textContent = `Wind: ${forecastWeather.wind.speed} MPH`;
      forecastWeatherDiv.appendChild(forecastWeatherWindP);
  
      const forecastWeatherHumP = document.createElement("p");
      forecastWeatherHumP.textContent = `Humidity: ${forecastWeather.main.humidity}%`;
      forecastWeatherDiv.appendChild(forecastWeatherHumP);
  
      // Append forecast weather div to the weather results div
      weatherResults.appendChild(forecastWeatherDiv); 
    };     
  } 
});
