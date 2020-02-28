import renderDataInDom from '../src/components/WeatherInfo/WeatherInfo';
import PNotify from 'pnotify/dist/es/PNotify.js';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons.js';
import showTemperature from '../src/components/MoreInfo/MoreInfo';
import buildDataWindowLayout from './components/DataWindow/DataWindow.js';

import FiveDaysSmall from './components/FiveDaysSmall/FiveDaysSmall';
import GlobalEmitter from './components/GlobalFunctionAndVariables/EventEmitter.js';

const baseUrlForTodayWeather =
  'https://api.openweathermap.org/data/2.5/weather?APPID=8defc985a5e2c764076c53bf90c6c44e&units=metric&lang=en&q=';
const baseUrlForFiveDayWeather =
  'https://api.openweathermap.org/data/2.5/forecast?APPID=8defc985a5e2c764076c53bf90c6c44e&units=metric&lang=en&q=';

const makeUrlForDetectedCityFromCurrentCoord = (latitude, longitude) => {
  const APIKEY = '67daddc6-334a-4325-8705-7fd9afb2f209';
  return `https://graphhopper.com/api/1/geocode?reverse=true&point=${latitude},${longitude}&debug=true&key=${APIKEY}`;
};

export default {
  city: 'Kyiv',
  today: null,
  fiveDay: null,
  blockSection: 'today',

  getCurrentCityForCurrentLocationCoord() {
    const option = {
      maximumAge: 600000,
      timeout: 500,
    };

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, option);
    })
      .then(location => {
        const url = makeUrlForDetectedCityFromCurrentCoord(
          location.coords.latitude,
          location.coords.longitude,
        );

        return fetch(url)
          .then(response => response.json())
          .then(response => {
            this.city = response.hits[0].city;
            return response.hits[0].city;
          })
          .catch(err => {
            throw err;
          });
      })
      .catch(error => {
        throw error;
      });
  },

  getTodayWeather(city) {
    this.today = null;
    this.fiveDay = null;
    fetch(baseUrlForTodayWeather + city)
      .then(res => {
        //  console.log('getFiveDayWeather !!!!!!!!!!!!!!!!!!!!!!!!!', res);
        if (res.status === 404) {
          PNotify.error({
            title: 'NOTICE!',
            text: "Can't show such city!",
          });
        }
        return res.json();
      })
      .then(res => {
        this.today = res;
        this.blockSection = 'today';
        renderDataInDom(res);
        buildDataWindowLayout(res);
        console.log('getTodayWeather ', this);
        GlobalEmitter.emit(GlobalEmitter.ON_WEATHER_READY, res.weather[0].main);
      })

      .catch(err => {
        console.error('hellooo');
      });
  },

  getFiveDayWeather(city) {
    this.fiveDay = null;
    this.today = null;
    fetch(baseUrlForFiveDayWeather + city)
      .then(res => {
        //  console.log('getFiveDayWeather !!!!!!!!!!!!!!!!!!!!!!!!!', res);
        if (res.status === 404) {
          PNotify.error({
            title: 'NOTICE!',
            text: 'Please write correct city!',
          });
        }
        return res.json();
      })
      .then(res => {
        this.fiveDay = res;
        this.blockSection = 'fiveDay';
        FiveDaysSmall(res);
        GlobalEmitter.emit(GlobalEmitter.ON_GRAPH_READY, res);
        console.log('getFiveDayWeather', this);
        GlobalEmitter.emit(
          GlobalEmitter.ON_WEATHER_READY,
          res.list[0].weather[0].main,
        );
      })
      .catch(error => {
        console.error('error', error);
      });
  },

  getImgBackground(cityName) {
    const baseUrl = 'https://pixabay.com/api/';
    const key = '&key=15364832-46e4bda7ae3c94390e1b1153f';
    const requestParams = `?image_type=photo&orientation=horizontal&q=${cityName}&page=1&per_page=40`;

    return fetch(baseUrl + requestParams + key)
      .then(response => response.json())
      .then(parsedResponse => {
        //console.log('parsedResponse', parsedResponse);
        const rand = Math.floor(Math.random() * parsedResponse.hits.length);
        const mainDiv = document.querySelector('.background-image');
        mainDiv.style.backgroundImage = `url(${parsedResponse.hits[rand].largeImageURL})`;
      })
      .catch(error => {
        console.error('getImgBackground error', error);
      });
  },
};

// hello