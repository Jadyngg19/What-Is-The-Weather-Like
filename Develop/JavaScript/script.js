document.addEventListener("DOMContentLoaded", function() {

const API_KEY = "52de64d1b3a04d9998a9dcb1948bc9cc";
const API_URL = "https://api.openweathermap.org/data/2.5/forecast";

// Get references to HTML elements
const searchForm = document.querySelector("#search-form");
const cityInput = document.querySelector("#city-input");
const pastSearches = document.querySelector("#past-searches");
const weatherResults = document.querySelector("#weather-results");

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
        pastSearch.textContent = city;
        pastSearch.addEventListener("click", function() {
          // If past search is clicked, perform new search for that city
          cityInput.value = city;
          searchForm.dispatchEvent(new Event("submit"));
        });
        pastSearches.appendChild(pastSearch);
        localStorage.setItem(city, true);
      }

      // Clear weather results div
      weatherResults.innerHTML = "";

      // Loop through forecast data and create HTML elements to display
      for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        const date = new Date(forecast.dt * 1000);
        const iconURL = `https://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;

        const forecastDiv = document.createElement("div");
        forecastDiv.classList.add("forecast");

        const dateP = document.createElement("p");
        dateP.textContent = date.toLocaleDateString();
        forecastDiv.appendChild(dateP);

        const iconImg = document.createElement("img");
        iconImg.src = iconURL;
        forecastDiv.appendChild(iconImg);

        const tempP = document.createElement("p");
        tempP.textContent = `${Math.round(forecast.main.temp)}°F`;
        forecastDiv.appendChild(tempP);

        const descP = document.createElement("p");
        descP.textContent = forecast.weather[0].description;
        forecastDiv.appendChild(descP);

        weatherResults.appendChild(forecastDiv);
      }
    })
    .catch(error => console.log(error));

  // Clear input field after search
  cityInput.value = "";
  }); 
});
