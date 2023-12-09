'use strict';

const currentWeatherPrimary = document.querySelector('.current__primary');

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

const renderCurrentWeather = function (data, date, time) {
  const html = `<p class="city">${data.location.name}</p>
    <p class="date">${date}</p>
    <p class="time">${time}</p>
    <div class="container--temp">
      <p class="current__temp">${data.current.temp_c}&deg;C</p>
      <!-- <p class="temp__unit"></p> -->
      <p class="temp__toggle">&deg;F</p>
    </div>
    <p class="conditions__description">${data.current.condition.text}</p>
    <p class="conditions__icon">
      ${getIcon(data.current.condition.text)}
    </p>`;

  currentWeatherPrimary.insertAdjacentHTML('afterbegin', html);
};

// Get user's geolocation data
const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const getWeather = async function () {
  try {
    const pos = await getPosition();
    const { latitude: lat, longitude: lng } = pos.coords;

    // Reverse geocode to get city name
    const responseGeo = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
    );
    if (!responseGeo) throw new Error('Problem getting location data');
    const dataGeo = await responseGeo.json();

    // Get weather data
    const res = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=a51af733c4b24157bfa21819230812&q=${dataGeo.city}&days=3&aqi=no&alerts=no`
    );
    if (!res) throw new Error('No weather data for your location');
    const data = await res.json();
    console.log(data);

    renderCurrentWeather(data, dateDescription, time);
    getIcon(data.current.condition.text);
  } catch (err) {
    console.error(`${err}`);
  }
};

getWeather();

// getPosition().then(pos => console.log(pos));
