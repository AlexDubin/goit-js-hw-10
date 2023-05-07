import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries.js';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const updateCountryList = countries => {
  countryList.innerHTML = '';
  if (countries.length > 10) {
    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else {
    const countryListItems = countries
      .map(
        country =>
          `<li>
            <img class="country-flag" src="${country.flags.svg}" alt="${country.name.official} flag">
            <span>${country.name.official}</span>
          </li>`
      )
      .join('');
    countryList.innerHTML = countryListItems;
  }
};

const updateCountryInfo = country => {
  const languages = Object.values(country.languages)
    .map(language => language.name || language)
    .join(', ');
  countryList.style.display = 'none';
    countryInfo.innerHTML = `
  <div class="country-container" >
    <img class="country-flag-container" src="${country.flags.svg}" alt="${country.name.official} flag">
    <h2>${country.name.official}</h2>
  </div>
    <p><strong>Capital:</strong> ${country.capital}</p>
    <p><strong>Population:</strong> ${country.population}</p>
    <p><strong>Languages:</strong> ${languages}</p>
  `;
};

const countrySearch = debounce(() => {
  const searchValue = searchBox.value.trim();
  if (searchValue) {
    fetchCountries(searchValue)
      .then(countries => {
        if (countries.length === 0) {
          Notiflix.Notify.failure('Oops, there is no country with that name.');
        } else if (countries.length === 1) {
          updateCountryInfo(countries[0]);
        } else {
          updateCountryList(countries);
        }
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name.');
        console.error(error);
      });
  } else {
    countryList.innerHTML = '';
    countryList.style.display = 'block';
    countryInfo.innerHTML = '';
  }
}, DEBOUNCE_DELAY);

searchBox.addEventListener('input', countrySearch);
