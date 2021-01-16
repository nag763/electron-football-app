const querystring = require('querystring');
const $ = require('jquery');

import {
  generateGetRequest
} from './utils/httputils.js';
import {
  generateHTMLtr
} from './utils/htmlutils.js';
import {
  Fixture
} from './classes/fixture.js';

const query = querystring.parse(global.location.search);
const idToDisplay = JSON.parse(query['?id']);


const urlTeam = `teams/team/${idToDisplay}`;

generateGetRequest(urlTeam).then((response) => {
  const team = response.data.api.teams[0];
  const infosTable = $('#infos');

  $('#title').text(team.name);
  $('#clubName').text(team.name);
  $('#logo').attr('src', team.logo);
  $('#desc').text(`
  Founded in ${team.founded}, ${team.name} is a club playing in ${team.country}.
  Its stadium, ${team.venue_name}, has a capacity of ${team.venue_capacity} seats.
  `);
});

const urlLatestFixtures = `fixtures/team/${idToDisplay}/last/5`;

generateGetRequest(urlLatestFixtures).then((response) => {
  const table = $('#latestFixtures');
  response.data.api.fixtures.forEach((element) => {
    console.log(element);
    const fixture = new Fixture();
    fixture.league = element.league.name;
    fixture.homeTeamName = element.homeTeam.team_name;
    fixture.homeTeamId = element.homeTeam.team_id;
    fixture.awayTeamName = element.awayTeam.team_name;
    fixture.awayTeamId = element.awayTeam.team_id;
    fixture.goalsHomeTeam = element.goalsHomeTeam;
    fixture.goalsAwayTeam = element.goalsAwayTeam;
    fixture.eventDate = element.event_date;
    fixture.leagueName = element.league.name;
    fixture.leagueId = element.league_id;
    table.append(generateHTMLtr([fixture.eventHourTime(), `<a href='./onl_team.html?id=${fixture.homeTeamId}'>${fixture.homeTeamName}</a>`, `<a href='./onl_team.html?id=${fixture.awayTeamId}'>${fixture.awayTeamName}</a>`, fixture.fullscore(), `<a href='./onl_league.html?id=${fixture.leagueId}'>${fixture.leagueName}</a>`]));
  });
});

const urlNextFixtures = `fixtures/team/${idToDisplay}/next/5`;

generateGetRequest(urlNextFixtures).then((response) => {
  const table = $('#nextFixtures');
  response.data.api.fixtures.forEach((element) => {
    const fixture = new Fixture();
    fixture.league = element.league.name;
    fixture.homeTeamName = element.homeTeam.team_name;
    fixture.homeTeamId = element.homeTeam.team_id;
    fixture.awayTeamName = element.awayTeam.team_name;
    fixture.awayTeamId = element.awayTeam.team_id;
    fixture.eventDate = element.event_date;
    fixture.leagueName = element.league.name;
    fixture.leagueId = element.league_id;
    table.append(generateHTMLtr([fixture.eventHourTime(), `<a href='./onl_team.html?id=${fixture.homeTeamId}'>${fixture.homeTeamName}</a>`, `<a href='./onl_team.html?id=${fixture.awayTeamId}'>${fixture.awayTeamName}</a>`, `<a href='./onl_league.html?id=${fixture.leagueId}'>${fixture.leagueName}</a>`]));
  });
});

$('#go_back').click(() => {
  $(location).attr('href', './menu.html');
});
