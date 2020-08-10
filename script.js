// Select Elements
const iconEl = document.querySelector(".weather-icon");
const tempValueEl = document.querySelector(".temp-value p");
const tempDescEl = document.querySelector(".temp-desc p");
const locationEl = document.querySelector(".location p");
const notificationEl = document.querySelector(".notification");
const searchEl = document.querySelector(".search-location input");
const datetimeEl = document.querySelector(".datetime p");

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
	setTimeout(() => {
		notificationEl.style.display = "none";
	}, 4000);
}

// Get Weather data from API (lat,lon)
function getWeatherData(latitude, longitude) {
	const cors = "https://cors-anywhere.herokuapp.com/";
	let api = `${cors}http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${KEY}`;

	fetch(api)
		.then((res) => res.json())
		.then((data) => {
			getDataFromApi(data);
		})
		.then(() => displayWeatherData());
}
// Event listener on search
searchEl.addEventListener("keypress", searchHandle);
function searchHandle(e) {
	if (e.key === "Enter") {
		const searchTxt = searchEl.value;
		getSearchData(searchTxt);
	}
}

// Get Weather data from API (search by city name)
function getSearchData(searchTxt) {
	const cors = "https://cors-anywhere.herokuapp.com/";
	let api = `${cors}http://api.openweathermap.org/data/2.5/weather?q=${searchTxt},${searchTxt}&appid=${KEY}`;

	if (searchEl.value !== "") {
		fetch(api)
			.then((res) => {
				if (res.ok) return res.json();
				else throw new Error("Invalid city name");
			})
			.then((data) => {
				getDataFromApi(data);
			})
			.then(() => displayWeatherData())
			.catch((error) => showError(error));
	} else {
		const error = new Error("Please enter a city name");
		showError(error);
	}
}

// Get API data and store in object
function getDataFromApi(data) {
	weather.temperature.value = Math.floor(data.main.temp - KELVIN);
	weather.description = data.weather[0].description;
	weather.iconId = data.weather[0].icon;
	weather.city = data.name;
	weather.country = data.sys.country;
}

// Display Weather to the UI
function displayWeatherData() {
	datetimeEl.innerHTML = `${showDateTime()}`;
	iconEl.innerHTML = `<img src="./icons/${weather.iconId}.png" alt="weather icon" />`;
	tempValueEl.innerHTML = `${weather.temperature.value}&deg;<span>C</span>`;
	tempDescEl.innerHTML = weather.description;
	locationEl.innerHTML = `${weather.city}, ${weather.country}`;

	searchEl.value = "";
}

// Show Date Time
function showDateTime() {
	const days = [
		"Sunday",
		"Monday",
		"Tuesday",
		"Wednesday",
		"Thursday",
		"Friday",
		"Saturday",
	];
	const months = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	const datetime = new Date();
	const hours =
		datetime.getHours() > 12
			? datetime.getHours() - 12
			: datetime.getHours();
	const am_pm = datetime.getHours() >= 12 ? "PM" : "AM";

	// 12:31pm, Monday, August 10, 2020
	return `
		${hours}:${datetime.getMinutes()} ${am_pm}, 
		${days[datetime.getDay()]}, ${months[datetime.getMonth()]}, 
		${datetime.getDate()}, ${datetime.getFullYear()}
	`;
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
