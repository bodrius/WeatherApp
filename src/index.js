import './stylesheet/fonts.css';
import './stylesheet/WorkFonts.css';
import './stylesheet/normalize.css';
import PNotify from 'pnotify/dist/es/PNotify.js';
import PNotifyButtons from 'pnotify/dist/es/PNotifyButtons.js';
import './components/BackgroundImg/BackgroundImg.css';
import '../node_modules/pnotify/dist/PNotifyBrightTheme.css';
import './stylesheet/styles.css';
import './components/Search/Search';
import './components/FavoriteList/FavoriteList';
import './components/WeatherInfo/WeatherInfo';
import './components/Quote/Quote';
import './components/DataWindow/DataWindow';
import './components/FiveDaysSmall/FiveDaysSmall';
import './components/MoreInfo/MoreInfo';
import './components/Schedule/Schedule';
import './components/Geolocation/Geolocation';
import './components/AnimationWeather/AnimationWeather';
import './components/CubeAnimation/CubeAnimation';
import './components/GlobalFunctionAndVariables/globalFunctionAndVariables';
import GlobalEmitter from './components/GlobalFunctionAndVariables/EventEmitter';
import quoteData from './components/Quote/data';
import services from './services';
import Loader from './components/Loader/loader';
import './components/Loader/loader.css';

document.addEventListener('DOMContentLoaded', searchWeatherData);
document.addEventListener('click', buildWeatherAnimayionHour);

Loader.show();

function searchWeatherData() {
  services
    .getCurrentCityForCurrentLocationCoord()
    .then(city => {
      if (services.blockSection === 'today') {
        services.getTodayWeather(city);
      } else if (services.blockSection === 'fiveDay') {
        services.getFiveDayWeather(city);
      }
      services.getImgBackground(city);
    })
    .catch(e => {
      if (services.blockSection === 'today') {
        services.getTodayWeather(services.city);
      } else if (services.blockSection === 'fiveDay') {
        services.getFiveDayWeather(services.city);
      }
      services.getImgBackground(services.city);
    })
    .finally(() => setTimeout(() => Loader.hide(), 1500));
}

function showQuote() {
  GlobalEmitter.emit(GlobalEmitter.ON_QUOTE_READY, {
    ...quoteData[Math.floor(Math.random() * quoteData.length)],
  });
}

function buildWeatherAnimayionHour(e) {
  GlobalEmitter.emit(GlobalEmitter.ON_WEATHER_READY, e.target.id);
  GlobalEmitter.emit(GlobalEmitter.ON_WEATHER_READY, e.target.dataset.weather);

}

setInterval(showQuote, 8000);
showQuote();
