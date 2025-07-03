const apiKey = "cfc5d19e7be1b862621b0f64a8fd1461"; // Replace with your actual OpenWeatherMap API key
let currentUnit = "metric"; // or "imperial"

function toggleUnits() {
  currentUnit = currentUnit === "metric" ? "imperial" : "metric";
  const city = document.getElementById("cityInput").value;
  if (city) {
    getWeather();
  }
}

function getWeather() {
  const city = document.getElementById("cityInput").value;
  if (!city) return alert("Enter a city name!");
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${currentUnit}`;
  fetchWeather(url, city);
}

function getWeatherByLocation() {
  navigator.geolocation.getCurrentPosition((pos) => {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnit}`;
    fetchWeather(url, "Current Location");
  });
}

async function fetchWeather(url, label = "") {
  const loader = document.getElementById("loaderContainer");
  const weatherInfo = document.getElementById("weatherInfo");

  try {
    loader.style.display = "block";
    const res = await fetch(url);
    const data = await res.json();
    setBackgroundByWeather(data.weather[0].main);
    loader.style.display = "none";
    if (data.cod !== 200) {
      weatherInfo.innerHTML = `<p>Error: ${data.message}</p>`;
      return;
    }
  

  function setBackgroundByWeather(condition) {
  const body = document.body;
  switch (condition.toLowerCase()) {
    case "clear":
      body.style.background = "linear-gradient(135deg, #f9d423, #ff4e50)"; // sunny
      break;
    case "clouds":
      body.style.background = "linear-gradient(135deg, #bdc3c7, #2c3e50)";
      break;
    case "rain":
    case "drizzle":
      body.style.background = "linear-gradient(135deg, #4b79a1, #283e51)";
      break;
    case "snow":
      body.style.background = "linear-gradient(135deg, #e6dada, #274046)";
      break;
    case "thunderstorm":
      body.style.background = "linear-gradient(135deg, #141E30, #243B55)";
      break;
    case "mist":
    case "fog":
    case "haze":
      body.style.background = "linear-gradient(135deg, #757F9A, #D7DDE8)";
      break;
    default:
      body.style.background = "linear-gradient(135deg, #2c3e50, #3498db)"; // default
  }
}


    const iconCode = data.weather[0].icon;
    const iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    const unit = currentUnit === "metric" ? "°C" : "°F";
    const feelsLike = data.main.feels_like;
    const timezoneOffset = data.timezone;
    const localTime = new Date(Date.now() + timezoneOffset * 1000);
    const formattedTime = localTime.toUTCString().slice(0, -4);

    weatherInfo.innerHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <p>🌡 Temp: ${data.main.temp} ${unit}</p>
      <p>🤒 Feels Like: ${feelsLike} ${unit}</p>
      <p class="weather-description">
      <img src="${iconURL}" alt="${data.weather[0].description}" />
      ${data.weather[0].description}
      </p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>🌬 Wind: ${data.wind.speed} ${currentUnit === "metric" ? "m/s" : "mph"}</p>
      <p>🕒 Local Time: ${formattedTime}</p>
    `;
  } catch (err) {
    loader.style.display = "none";
    weatherInfo.innerHTML = `<p>Something went wrong. Please try again.</p>`;
    console.error(err);
  }
}
