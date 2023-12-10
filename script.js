'use strict';

const currentWeatherPrimary = document.querySelector('.current__primary');
const humidityLabel = document.querySelector('.conditions__label--humidity');
const windSpeedLabel = document.querySelector('.conditions__label--wind-speed');
const windDirectionLabel = document.querySelector(
  '.conditions__label--wind-direction'
);
const day0 = document.querySelector('.forecast--day0');
const day1 = document.querySelector('.forecast--day1');
const day2 = document.querySelector('.forecast--day2');
// const rainChanceLabel = document.querySelector('.conditions__label--rain');

// prettier-ignore
const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const now = new Date();
const dateDescription = `${days[now.getDay()].slice(
  0,
  3
)}, ${now.getDate()} ${months[now.getMonth()].slice(0, 3)}`;

const hours = `${now.getHours()}`.padStart(2, 0);
const minutes = `${now.getMinutes()}`.padStart(2, 0);

const time = `${hours}:${minutes}`;

const getIcon = function (condition) {
  let icon;

  switch (condition) {
    case 'Sunny':
      icon = '<i class="ph ph-sun icon--current"></i>';
      break;
    case 'Clear':
      icon = '<i class="ph ph-moon-stars icon--current"></i>';
    case 'Partly cloudy':
      icon = '<i class="ph ph-cloud-sun icon--current"></i>';
      break;
    case 'Cloudy':
    case 'Overcast':
      icon = '<i class="ph ph-cloud icon--current"></i>';
      break;
    case 'Mist':
    case 'Fog':
    case 'Freezing fog':
      icon = '<i class="ph ph-cloud-fog icon--current"></i>';
      break;
    case 'Patchy rain possible':
    case 'Patchy sleet possible':
    case 'Patchy freezing drizzle possible':
    case 'Patchy light drizzle':
    case 'Light drizzle':
    case 'Freezing drizzle':
    case 'Heavy freezing drizzle':
    case 'Patchy light rain':
    case 'Light rain':
    case 'Moderate rain at times':
    case 'Moderate rain':
    case 'Heavy rain at times':
    case 'Heavy rain':
    case 'Light freezing rain':
    case 'Moderate or heavy freezing rain':
    case 'Light sleet':
    case 'Moderate or heavy freezing rain':
    case 'Light sleet':
    case 'Moderate or heavy sleet':
    case 'Light rain shower':
    case 'Moderate or heavy rain shower':
    case 'Torrential rain shower':
    case 'Lights sleet showers':
    case 'Moderate or heavy sleet showers':
      icon = '<i class="ph ph-cloud-rain icon--current"></i>';
      break;
    case 'Patchy snow possible':
    case 'Blowing snow':
    case 'Blizzard':
    case 'Patchy light snow':
    case 'Light snow':
    case 'Patchy moderate snow':
    case 'Moderate snow':
    case 'Patchy heavy snow':
    case 'Heavy snow':
      icon = '<i class="ph ph-cloud-snow icon--current"></i>';
      break;
    case 'Ice pellets':
    case 'Light showers of ice pellets':
    case 'Moderate or heavy showers of ice pellets':
      icon = '<i class="ph ph-snowflake icon-current"></i>';
      break;
    case 'Thundery outbreaks possible':
    case 'Patchy light rain with thunder':
    case 'Moderate or heavy rain with thunder':
    case 'Patchy light snow with thunder':
    case 'Moderate or heavy snow with thunder':
      icon = '<i class="ph ph-cloud-lightning icon--current"></i>';
      break;
    default:
      icon = '<i class="ph ph-thermometer icon--current"></i>';
  }

  return icon;
};

const renderWeatherPrimary = function (data, date, time) {
  const html = `<p class="city">${data.location.name}</p>
    <p class="date">${date}</p>
    <p class="time">${time}</p>
    <div class="container--temp">
      <p class="current__temp">${Math.round(data.current.temp_c)}&deg;C</p>
      <!-- <p class="temp__unit"></p> -->
      <p class="temp__toggle">&deg;F</p>
    </div>
    <p class="conditions__description">${data.current.condition.text}</p>
    <p class="conditions__icon">
      ${getIcon(data.current.condition.text)}
    </p>`;

  currentWeatherPrimary.insertAdjacentHTML('afterbegin', html);
};

const renderWeatherSecondary = function (data) {
  const humidity = `<p class="conditions conditions--current conditions__value          conditions__value--humidity">${data.current.humidity}%</p>`;

  const windSpeed = `<p class="conditions conditions--current conditions__value conditions__value--wind"
    >${data.current.wind_kph}km/h</p>`;

  const windDirection = ` <p class="conditions conditions--current conditions__value conditions__value--wind-direction">${data.current.wind_dir}</p>`;

  //   const chanceOfRain = `<p class="conditions conditions--current conditions__value conditions__value--rain">${data.forecast.forecastday[0].day.daily_chance_of_rain}%</p>`;

  humidityLabel.insertAdjacentHTML('afterend', humidity);
  windSpeedLabel.insertAdjacentHTML('afterend', windSpeed);
  windDirectionLabel.insertAdjacentHTML('afterend', windDirection);
  //   rainChanceLabel.insertAdjacentHTML('afterend', chanceOfRain);
};

const renderCurrentWeather = function (data, date, time) {
  renderWeatherPrimary(data, date, time);
  renderWeatherSecondary(data);
};

// Get user's geolocation data
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const getCurrentWeather = async function () {
  try {
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    // Reverse geocode to get city name
    const responseGeo = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`,
      {
        mode: 'cors',
      }
    );
    if (!responseGeo) throw new Error('Problem getting location data');
    const dataGeo = await responseGeo.json();

    // Get weather data
    const res = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=a51af733c4b24157bfa21819230812&q=${dataGeo.city}&days=3&aqi=no&alerts=no`,
      {
        mode: 'cors',
      }
    );
    if (!res) throw new Error('No weather data for your location');
    const data = await res.json();
    console.log(data);

    renderCurrentWeather(data, dateDescription, time);
    getIcon(data.current.condition.text);
    getForecast(data);
  } catch (err) {
    console.error(`${err}`);
  }
};

const getForecast = function (data) {
  const dayAfterTmrw = `${days[now.getDay() + 2].slice(0, 3)}`;

  const todayHTML = `<p class="day day--day0">Today</p>
    <p class="max-temp max-temp--day0">${Math.round(
      data.forecast.forecastday[0].day.maxtemp_c
    )}&deg;</p>
    <p class="min-temp min-temp--day0">${Math.round(
      data.forecast.forecastday[0].day.mintemp_c
    )}&deg;</p>
    <p class="conditions conditions--forecast conditions--day0">${
      data.forecast.forecastday[0].day.condition.text
    }</p>`;

  const tmrwHTML = `<p class="day day--day1">Tomorrow</p>
  <p class="max-temp max-temp--day1">${Math.round(
    data.forecast.forecastday[1].day.maxtemp_c
  )}&deg;</p>
  <p class="min-temp min-temp--day1">${Math.round(
    data.forecast.forecastday[1].day.mintemp_c
  )}&deg;</p>
  <p class="conditions conditions--forecast conditions--day1">${
    data.forecast.forecastday[1].day.condition.text
  }
  </p>`;

  const dayAfterTmrwHTML = `<p class="day day--day2">${dayAfterTmrw}</p>
  <p class="max-temp max-temp--day2">${Math.round(
    data.forecast.forecastday[2].day.maxtemp_c
  )}&deg;</p>
  <p class="min-temp min-temp--day2">${Math.round(
    data.forecast.forecastday[2].day.mintemp_c
  )}&deg;</p>
  <p class="conditions conditions--forecast conditions--day2">${
    data.forecast.forecastday[2].day.condition.text
  }</p>`;

  day0.insertAdjacentHTML('afterbegin', todayHTML);
  day1.insertAdjacentHTML('afterbegin', tmrwHTML);
  day2.insertAdjacentHTML('afterbegin', dayAfterTmrwHTML);
};

getCurrentWeather();
