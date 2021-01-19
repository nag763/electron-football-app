const dateFormat = require('dateformat');
const $ = require('jquery');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');

import {generateHTMLtr,generateHTMLtd} from './utils/htmlutils.js';
import {generateGetRequest} from './utils/httputils.js';
import {Fixture} from './classes/fixture.js';

const query = querystring.parse(global.location.search);

let dateDisplayed = new Date();

const profile = JSON.parse(function readProfile() {
  return fs.readFileSync(
      path.resolve(__dirname, ['..', 'profile.json'].join(path.sep)), 'utf-8')
      .trim();
}());


$('#datepicker').change(function(field) {
  dateDisplayed = new Date($(this).val());
  displayFixtures(getDateUrl(), getDateHeader());
});

$('#datepicker').attr('max', dateFormat(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), 'yyyy-mm-dd'))
    .attr('value', dateFormat(dateDisplayed, 'yyyy-mm-dd'));

$('#favs').click(() => {
  displayAllOrFavorites();
});

function getDateHeader() {
  return `Matchs being played on  ${dateFormat(dateDisplayed, 'dddd dd/mm/yyyy')}`;
}

function getDateUrl() {
  return `fixtures/date/${dateFormat(dateDisplayed, 'yyyy-mm-dd')}`;
}

let league;
let fixture;
let number;
let leagueFixtureUrl;
let leagueFixtureHeader;
let favorites;

const isMatchDay = function displayableIsMatchday() {
  if (['?league', 'fixture', 'mdnumber'].every((element) => element in query)) {
    return true;
  } else {
    return false;
  }
}();

if (isMatchDay) {
  league = JSON.parse(query['?league']);
  fixture = query['fixture'];
  number = JSON.parse(query['mdnumber']);
  leagueFixtureUrl = `fixtures/league/${league}/${fixture}`;
  leagueFixtureHeader = `Fixtures for Match Day ${number}`;
}

function displayFixtures(url, header) {
  $('#title').text(header);

  generateGetRequest(url).then((res) => {
    const jsonBody = res.data;
    $('#fixtures tr').remove();
    Array.from(jsonBody.api.fixtures).forEach((element) => {
      const fixture = new Fixture();
      fixture.country = element.league.country;
      fixture.league = element.league.name;
      fixture.leagueId = element.league_id;
      fixture.leagueLogo = element.league.logo;
      fixture.homeTeamName = element.homeTeam.team_name;
      fixture.homeTeamId = element.homeTeam.team_id;
      fixture.homeTeamLogo = element.homeTeam.logo;
      fixture.awayTeamName = element.awayTeam.team_name;
      fixture.awayTeamId = element.awayTeam.team_id;
      fixture.awayTeamLogo = element.awayTeam.logo;
      fixture.goalsHomeTeam = element.goalsHomeTeam;
      fixture.goalsAwayTeam = element.goalsAwayTeam;
      fixture.eventDate = element.event_date;
      fixture.elapsedTime = element.elapsed;
      fixture.status = element.status;
      fixture.fixtureId = element.fixture_id;
      // TODO : optimised ?
      $('#fixtures').append(generateHTMLtr(fixture.toTableData()));
    });
    filterFavoritesIfAppliable();
  });
}

if (isMatchDay) {
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

function displayAllOrFavorites() {
  const favs = $('#favs');
  if (favs.text().localeCompare('Only my favorites') == 0) {
    favs.text('Show all');
  } else {
    favs.text('Only my favorites');
  }
  filterFavoritesIfAppliable();
}

function filterFavoritesIfAppliable() {
  const favs = $('#favs');
  if (favs.text().localeCompare('Only my favorites') == 0) {
    const favorites = profile.favoriteTeams.concat(profile.favoriteLeagues).map((element) => element.name);
    $('#fixtures tr').filter(function() {
      const arrayOfDisplayed = $(this).children('td').slice(0, 3).map(function() {
        return $(this).text().trim();
      }).get();
      $(this).toggle(favorites.some((element) => arrayOfDisplayed.includes(element)));
    });
  } else {
    $('#fixtures tr').toggle(true);
  }
}

// Not mine, taken directly from w3s
$('#searchBar').on('keyup', function() {
  const value = $(this).val().toLowerCase();
  $('#fixtures tr').filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
  });
});
