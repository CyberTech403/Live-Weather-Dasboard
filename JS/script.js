const apiKey = 'a10c90c77e7ee0f9f2cbd3110345a6fb';

const fetchWeatherData = async (url) => {
  const response = await fetch(url);
  return response.json();
};

const getWeatherData = async (city) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  return await fetchWeatherData(apiUrl);
};

const getFiveDayForecast = async (city) => {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
  return await fetchWeatherData(apiUrl);
};

const displayCurrentWeather = (weatherData) => {
  const { name, main, wind, weather } = weatherData;
  document.getElementById('city-name-display').textContent = name;
  document.getElementById('current-date').textContent = dayjs().format('DD-MMM-YYYY');
  document.getElementById('current-time').textContent = dayjs().format('h:mm:ss A');
  document.getElementById('temperature').textContent = main?.temp ? `${Math.round(main.temp)}°C` : 'Temperature data not available';
  document.getElementById('humidity').textContent = main?.humidity;
  document.getElementById('wind').textContent = wind?.speed;
  document.getElementById('weather-icon').innerHTML = `<img src="https://openweathermap.org/img/w/${weather[0].icon}.png" alt="Weather Icon" width=85ox">`;
};

const displayFiveDayForecast = (forecastData) => {
  const forecastContainer = document.getElementById('forecast');
  forecastContainer.innerHTML = '';
  
  for (let i = 0; i < forecastData.list.length; i += 8) {
    const dayData = forecastData.list[i];
    const { dt_txt, main, weather } = dayData;
    const iconUrl = `https://openweathermap.org/img/w/${weather[0].icon}.png`;

    const listItem = document.createElement('div');
    listItem.classList.add('forecast-five-day');
    listItem.innerHTML = `
      <p>Date: ${dayjs(dt_txt).format('DD/MM/YYYY')}</p>
      <p>Temperature: ${main.temp}&#176C</p>
      <p>Humidity: ${main.humidity}%</p>
      <img src="${iconUrl}" alt="Weather Icon">
    `;
    forecastContainer.appendChild(listItem);
  }
};

const displaySearchHistory = () => {
  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  const recentSearchElement = document.getElementById('recent-search');
  recentSearchElement.innerHTML = '';

  searchHistory.forEach((city) => {
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-secondary', 'mb-1');
    button.textContent = city;
    button.addEventListener('click', () => handleSearch(city));
    recentSearchElement.appendChild(button);
  });
};

const handleSearch = async (userInput) => {
  const currentWeatherData = await getWeatherData(userInput);
  displayCurrentWeather(currentWeatherData);

  const fiveDayForecastData = await getFiveDayForecast(userInput);
  displayFiveDayForecast(fiveDayForecastData);

  const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  if (!searchHistory.includes(userInput)) {
    searchHistory.unshift(userInput);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }

  displaySearchHistory();
};

const setDefaultCity = (city) => handleSearch(city);

document.addEventListener('DOMContentLoaded', () => setDefaultCity('London'));
document.getElementById('clear-history-button').addEventListener('click', () => {
  localStorage.removeItem('searchHistory');
  displaySearchHistory();
});

document.getElementById('search-button').addEventListener('click', () => {
  const userInput = document.getElementById('user-search-input').value;
  if (userInput) {
    handleSearch(userInput);
  }
});

const recentSearchContainer = document.getElementById('recent-search');
const newRecentSearch = document.createElement('div');
newRecentSearch.textContent = "Your Recent Search";
recentSearchContainer.appendChild(newRecentSearch);

const updateClock = () => {
  document.getElementById('current-time').textContent = dayjs().format('h:mm:ss A');
};

setInterval(updateClock, 1000);
