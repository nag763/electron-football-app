const dateFormat = require('dateformat');
const $ = require('jquery');
const QUERY_STRING = require('querystring');

import {generateHTMLtr} from './utils/htmlutils.js';
import {generateGetRequest} from './utils/httputils.js';
import {Fixture} from './classes/fixture.js';
import {User} from './classes/user.js';
import {ErrorHandler} from './utils/errorhandler.js';

const QUERY = QUERY_STRING.parse(global.location.search);

let dateDisplayed = new Date();


/**
 * Get the date header to display.
 *
 * @return {string} the date header to display.
 */
function getDateHeader() {
  return `Matchs being played on  ${dateFormat(dateDisplayed, 'dddd dd/mm/yyyy')}`;
}


/**
 * Get the url endpoint to request for the given date.
 *
 * @return {string} the date url as string
 */
function getDateUrl() {
  return `fixtures/date/${dateFormat(dateDisplayed, 'yyyy-mm-dd')}`;
}

/** Display the fixtures.
  *
  * @param {string} url - end point to fetch data from
  * @param {string} header - header to display at the same time of the fixture
  */
async function displayFixtures(url, header) {
  $('#title').text(header);

  generateGetRequest(url).then((res) => {
    $('#fixtures tr').remove();
    const fixtures = Fixture.fromResponse(res);
    $('#fixtures').append(fixtures.map((fixture) =>
      generateHTMLtr(fixture.toTableData())),
    );
    filterFavoritesIfAppliable();
  }).catch((error) => ErrorHandler.onResponse(error));
}

/**
  * Switch between displaying only the favorites or all fixtures.
  *
  */
function switchBetweenFavsAndAll() {
  const favs = $('#favs');
  if (favs.text().localeCompare('My favorites') == 0) {
    favs.text('All');
  } else {
    favs.text('My favorites');
  }
  filterFavoritesIfAppliable();
}

/**
  * Display only favorite teams if appliable.
  */
function filterFavoritesIfAppliable() {
  const favs = $('#favs');
  if (favs.text().localeCompare('My favorites') == 0) {
    const favorites = User.getFavoritesText();
    $('#fixtures tr').filter(function() {
      // The league and teams infos are only on the 3 first tds
      const arrayOfDisplayed = $(this).children('td').slice(0, 3).map(function() { // eslint-disable-line no-invalid-this
        return $(this).text().trim(); // eslint-disable-line no-invalid-this
      }).get();
      $(this).toggle(favorites.some((element) => arrayOfDisplayed.includes(element))); // eslint-disable-line no-invalid-this
    });
  } else {
    $('#fixtures tr').toggle(true);
  }
}

$('#datepicker').change(function(field) {
  dateDisplayed = $(this).val(); // eslint-disable-line no-invalid-this
  displayFixtures(getDateUrl(), getDateHeader());
}).attr('max', dateFormat(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), 'yyyy-mm-dd'))
    .attr('value', dateFormat(dateDisplayed, 'yyyy-mm-dd'));

$('#favs').click(() => {
  switchBetweenFavsAndAll();
});

// Not mine, taken directly from w3s
$('#searchBar').on('keyup', function() {
  const value = $(this).val().toLowerCase(); // eslint-disable-line no-invalid-this
  $('#fixtures tr').filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1); // eslint-disable-line no-invalid-this
  });
});

/** Define if the current element to display is match day or not. **/
const isMatchDay = function displayableIsMatchday() {
  if (['?league', 'fixture', 'mdnumber'].every((element) => element in QUERY)) {
    return true;
  } else {
    return false;
  }
}();

let league;
let fixture;
let number;
let leagueFixtureUrl;
let leagueFixtureHeader;

if (isMatchDay) {
  league = JSON.parse(QUERY['?league']);
  fixture = QUERY['fixture'];
  number = JSON.parse(QUERY['mdnumber']);
  leagueFixtureUrl = `fixtures/league/${league}/${fixture}`;
  leagueFixtureHeader = `Fixtures for Match Day ${number}`;
}

if (isMatchDay) {
  switchBetweenFavsAndAll();
  displayFixtures(leagueFixtureUrl, leagueFixtureHeader);
  $('#next').add('#previous').add('#favs').toggle();
} else {
  displayFixtures(getDateUrl(), getDateHeader());

  $('#next').click(() => {
    $('#fixtures').empty();
    dateDisplayed.setDate(dateDisplayed.getDate() + 1);
    displayFixtures(getDateUrl(), getDateHeader());
  });

  $('#previous').click(() => {
    $('#fixtures').empty();
    dateDisplayed.setDate(dateDisplayed.getDate() + -1);
    displayFixtures(getDateUrl(), getDateHeader());
  });
}
