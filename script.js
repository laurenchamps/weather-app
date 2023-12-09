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
const time = `${now.getHours()}:${now.getMinutes()}`;

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
      <i class="ph ph-cloud icon--current"></i>
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
    const city = dataGeo.city;

    // Get weather data
    const res = await fetch(
      `http://api.weatherapi.com/v1/forecast.json?key=a51af733c4b24157bfa21819230812&q=${dataGeo.city}&days=3&aqi=no&alerts=no`
    );
    if (!res) throw new Error('No weather data for your location');
    const data = await res.json();
    console.log(data);

    renderCurrentWeather(data, dateDescription, time);
  } catch (err) {
    console.error(`${err}`);
  }
};

getWeather();

// getPosition().then(pos => console.log(pos));
