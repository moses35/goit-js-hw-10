import './css/styles.css';

import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const header = document.querySelector('head');
const inputField = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;
const styles =
  '<style> .list {display: flex; gap: 10px; margin-bottom: 10px; padding = 0; align-items: center} .text{margin: 0; padding: 0; font-weight:500; font-size: 20px}  .country-list{padding:0;} .info{list-style: none; padding:0;} .infoText{font-weight:500}</style>';
header.insertAdjacentHTML('beforeend', styles);

inputField.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

//input change
function onInputChange() {
  if (inputField.value.trim() !== '') {
    fetchCountries(inputField.value)
      .then(renderListOfCountries)
      .catch(onFetchError);
  } else {
    countryList.innerHTML = '';
    countryInfo.innerHTML = '';
  }
}

//render list of countries
function renderListOfCountries(countries) {
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else {
    if (countries.length >= 2 && countries.length <= 10) {
      countryInfo.innerHTML = '';
      const markup = createListMarkup(countries);
      countryList.innerHTML = markup;
    } else {
      const markup = createListMarkup(countries);
      const countrieMarkup = countriesInfoMarkup(countries);
      countryList.innerHTML = markup;
      countryInfo.innerHTML = countrieMarkup;
    }
  }
}

//create country list
function createListMarkup(countries) {
  return countries
    .map(({ name, flags }) => {
      return `<li class="list">
      <img width="30" height="30" src = "${flags.svg}" alt="${name.official}"/>
      <p class="text">${name.common}</p></li>`;
    })
    .join('');
}

//create country info
function countriesInfoMarkup(countries) {
  return countries
    .map(({ capital, population, languages }) => {
      return `<ul class="info">
      <li><span class="infoText">Capital:</span> ${capital}</li>
      <li><span class="infoText">Population:</span> ${population}</li>
      <li><span class="infoText">Languages:</span> ${Object.values(
        languages
      )}</li>
      </ul>`;
    })
    .join('');
}

function onFetchError() {
  Notiflix.Notify.failure('Oops, there is no country with that name');
}
