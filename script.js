// Select Elements
const iconEl = document.querySelector(".weather-icon");
const tempValueEl = document.querySelector(".temp-value p");
const tempDescEl = document.querySelector(".temp-desc p");
const locationEl = document.querySelector(".location p");
const notificationEl = document.querySelector(".notification");

// App Data
const weather = {};
weather.temperature = {
  unit: "celsius",
};
// App Constants
const KELVIN = 273;
const KEY = "a5cc697abb775d28d9656168d8765d49";

// Check if the browser suppots geolocation
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notificationEl.style.display = "block";
  notificationEl.innerHTML = `<p>Brower doesn't support Geolocation</p>`;
}

// Set user's location
function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  getWeatherData(latitude, longitude);
}

// Show error if geolocation access denied
function showError(error) {
  notificationEl.style.display = "block";
  notificationEl.innerHTML = `<p>${error.message}</p>`;
}

// Get Weather data from API
function getWeatherData(latitude, longitude) {
  const cors = "https://cors-anywhere.herokuapp.com/";
  let api = `${cors}http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${KEY}`;

  fetch(api)
    .then((res) => res.json())
    .then((data) => {
      weather.temperature.value = Math.floor(data.main.temp - KELVIN);
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      weather.city = data.name;
      weather.country = data.sys.country;
    })
    .then(() => displayWeatherData());
}

// Display Weather to the UI
function displayWeatherData() {
  iconEl.innerHTML = `<img src="./icons/${weather.iconId}.png" alt="weather icon" />`;
  tempValueEl.innerHTML = `${weather.temperature.value}&deg;<span>C</span>`;
  tempDescEl.innerHTML = weather.description;
  locationEl.innerHTML = `${weather.city}, ${weather.country}`;
}

// C to F converstion
function celsiusToFahrenheit(temperature) {
  return (temperature * 9) / 5 + 32;
}

// Click listener on Temparature
tempValueEl.addEventListener("click", () => {
  if (weather.temperature.value === undefined) return;

  if (weather.temperature.unit === "celsius") {
    let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
    fahrenheit = Math.floor(fahrenheit);

    tempValueEl.innerHTML = `${fahrenheit}&deg;<span>F</span>`;
    weather.temperature.unit = "fahrenheit";
  } else {
    tempValueEl.innerHTML = `${weather.temperature.value}&deg;<span>C</span>`;
    weather.temperature.unit = "celsius";
  }
});
