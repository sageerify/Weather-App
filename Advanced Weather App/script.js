const apiKey = "your_api_key_here"; // Replace with OpenWeatherMap API key
let unit = "metric";

document.getElementById("searchButton").addEventListener("click", () => {
    const city = document.getElementById("cityInput").value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        alert("Please enter a city name.");
    }
});

document.getElementById("geoButton").addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            fetchWeatherByLocation(latitude, longitude);
        }, () => {
            alert("Unable to access your location.");
        });
    } else {
        alert("Geolocation is not supported by your browser.");
    }
});

document.querySelectorAll('input[name="unit"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
        unit = e.target.value;
        const city = document.getElementById("cityName").textContent.split(": ")[1];
        if (city && city !== "--") {
            fetchWeather(city);
        }
    });
});

function fetchWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${unit}&appid=${apiKey}`;

    fetch(apiUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error("City not found");
            }
            return response.json();
        })
        .then(displayCurrentWeather)
        .catch((error) => alert(error.message));

    fetch(forecastUrl)
        .then((response) => {
            if (!response.ok) {
                throw new Error("City not found");
            }
            return response.json();
        })
        .then(displayForecast)
        .catch((error) => alert(error.message));
}

function fetchWeatherByLocation(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;

    fetch(apiUrl)
        .then((response) => response.json())
        .then(displayCurrentWeather)
        .catch((error) => alert(error.message));

    fetch(forecastUrl)
        .then((response) => response.json())
        .then(displayForecast)
        .catch((error) => alert(error.message));
}

function displayCurrentWeather(data) {
    document.getElementById("cityName").textContent = `City: ${data.name}`;
    document.getElementById("temperature").textContent = `Temperature: ${data.main.temp}°${unit === "metric" ? "C" : "F"}`;
    document.getElementById("description").textContent = `Description: ${data.weather[0].description}`;
    document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById("wind").textContent = `Wind Speed: ${data.wind.speed} ${unit === "metric" ? "m/s" : "mph"}`;
}

function displayForecast(data) {
    const forecastContainer = document.getElementById("forecastContainer");
    forecastContainer.innerHTML = "";
    const forecasts = data.list.filter((_, index) => index % 8 === 0);
    forecasts.forEach((forecast) => {
        const card = document.createElement("div");
        card.className = "forecast-card";
        card.innerHTML = `
            <p>${new Date(forecast.dt_txt).toLocaleDateString()}</p>
            <p>${forecast.main.temp}°${unit === "metric" ? "C" : "F"}</p>
            <p>${forecast.weather[0].description}</p>
        `;
        forecastContainer.appendChild(card);
    });
}
