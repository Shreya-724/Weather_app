const elements = {
  cityInput: document.getElementById("cityInput"),
  searchBtn: document.getElementById("searchBtn"),
  geoBtn: document.getElementById("geoBtn"),
  message: document.getElementById("message"),
  weatherCard: document.getElementById("weatherCard"),
  location: document.getElementById("location"),
  description: document.getElementById("description"),
  icon: document.getElementById("icon"),
  temp: document.getElementById("temp"),
  feels: document.getElementById("feels"),
  humidity: document.getElementById("humidity"),
  wind: document.getElementById("wind"),
};

function showMessage(text) {
  elements.message.textContent = text;
}
function clearMessage() {
  elements.message.textContent = "";
}
function showCard() {
  elements.weatherCard.classList.remove("hidden");
}
function hideCard() {
  elements.weatherCard.classList.add("hidden");
}

async function fetchWeather(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather not found");
    return await res.json();
  } catch (err) {
    throw err;
  }
}

function updateUI(data) {
  const desc = data.weather[0].description;
  const iconCode = data.weather[0].icon;

  elements.location.textContent = `${data.name}, ${data.sys.country}`;
  elements.description.textContent = desc.charAt(0).toUpperCase() + desc.slice(1);
  elements.icon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  elements.temp.textContent = `${Math.round(data.main.temp)}°C`;
  elements.feels.textContent = `Feels like ${Math.round(data.main.feels_like)}°C`;
  elements.humidity.textContent = data.main.humidity;
  elements.wind.textContent = data.wind.speed;

  showCard();
}

async function searchCity() {
  clearMessage();
  hideCard();
  const city = elements.cityInput.value.trim();
  if (!city) return showMessage("Enter a city name");

  try {
    const data = await fetchWeather(`/api/weather?city=${encodeURIComponent(city)}`);
    updateUI(data);
  } catch {
    showMessage("City not found. Try again.");
  }
}

async function searchByGeo() {
  clearMessage();
  hideCard();
  if (!navigator.geolocation) return showMessage("Geolocation not supported.");

  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;
    try {
      const data = await fetchWeather(`/api/weather?lat=${latitude}&lon=${longitude}`);
      updateUI(data);
    } catch {
      showMessage("Unable to fetch weather for your location.");
    }
  }, () => showMessage("Permission denied or unavailable."));
}

elements.searchBtn.addEventListener("click", searchCity);
elements.cityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") searchCity();
});
elements.geoBtn.addEventListener("click", searchByGeo);
