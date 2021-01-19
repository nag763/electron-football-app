const dateFormat = require('dateformat');
const $ = require('jquery');
const querystring = require('querystring');

import {generateHTMLtr, generateHTMLtd} from './utils/htmlutils.js';
import {generateGetRequest} from './utils/httputils.js';
import {Fixture} from './classes/fixture.js';
import {User} from './classes/user.js';

const query = querystring.parse(global.location.search);

/** Date displayed, on window open is current date. **/
let dateDisplayed = new Date();

/** Corresponding date header for renderer. **/
function getDateHeader(){
  return `Matchs being played on  ${dateFormat(dateDisplayed, 'dddd dd/mm/yyyy')}`
}

/** Url for the date. **/
function getDateUrl(){
  return `fixtures/date/${dateFormat(dateDisplayed, 'yyyy-mm-dd')}`
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
    $('#fixtures').append(fixtures.map(fixture =>
      generateHTMLtr(fixture.toTableData()))
    );
    filterFavoritesIfAppliable();
  });
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
      const arrayOfDisplayed = $(this).children('td').slice(0, 3).map(function() {
        return $(this).text().trim();
      }).get();
      $(this).toggle(favorites.some((element) => arrayOfDisplayed.includes(element)));
    });
  } else {
    $('#fixtures tr').toggle(true);
  }
}

$('#datepicker').change(function(field) {
  dateDisplayed = new Date($(this).val());
  displayFixtures(getDateUrl(), getDateHeader());
}).attr('max', dateFormat(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), 'yyyy-mm-dd'))
  .attr('value', dateFormat(dateDisplayed, 'yyyy-mm-dd'));

$('#favs').click(() => {
  switchBetweenFavsAndAll();
});

// Not mine, taken directly from w3s
$('#searchBar').on('keyup', function() {
  const value = $(this).val().toLowerCase();
  $('#fixtures tr').filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
  });
});

/** Define if the current element to display is match day or not. **/
const isMatchDay = function displayableIsMatchday() {
  if (['?league', 'fixture', 'mdnumber'].every((element) => element in query)) {
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
let favorites;


if (isMatchDay) {
  league = JSON.parse(query['?league']);
  fixture = query['fixture'];
  number = JSON.parse(query['mdnumber']);
  leagueFixtureUrl = `fixtures/league/${league}/${fixture}`;
  leagueFixtureHeader = `Fixtures for Match Day ${number}`;
}

if (isMatchDay) {
  switchBetweenFavsAndAll()
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
