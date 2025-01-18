let debounceTimeout;

document.getElementById("searchButton").addEventListener("click", function () {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        const city = document.getElementById("cityInput").value.trim();
        if (!city) {
            alert("Please enter a city name.");
            return;
        }

        const apiKey = "your_api_key_here"; // Replace with your OpenWeatherMap API key
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("City not found");
                }
                return response.json();
            })
            .then((data) => {
                document.getElementById("cityName").textContent = `City: ${data.name}`;
                document.getElementById("temperature").textContent = `Temperature: ${data.main.temp} °C`;
                document.getElementById("description").textContent = `Description: ${data.weather[0].description}`;
                document.getElementById("humidity").textContent = `Humidity: ${data.main.humidity}%`;
                document.getElementById("wind").textContent = `Wind Speed: ${data.wind.speed} m/s`;
            })
            .catch((error) => {
                alert(error.message);
            });
    }, 300);
});
