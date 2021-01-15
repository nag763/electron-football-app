const querystring = require('querystring');
const $ = require('jquery');

import {generateGetRequest} from './utils/httputils.js';
import {generateHTMLtr} from './utils/htmlutils.js';
import {Fixture} from './classes/fixture.js';

const query = querystring.parse(global.location.search);
const idToDisplay = JSON.parse(query['?id']);


const urlTeam = `teams/team/${idToDisplay}`;

generateGetRequest(urlTeam).then((response) => {
  const team = response.data.api.teams[0];
  const infosTable = $('#infos');

  $('#title').text(team.name);
  infosTable.append(generateHTMLtr(['Date fondation', team.founded]));
  infosTable.append(generateHTMLtr(['Pays', team.country]));
  infosTable.append(generateHTMLtr(['Logo', `<img src='${team.logo}'/>`]));
  infosTable.append(generateHTMLtr(['Stade', team.venue_name]));
  infosTable.append(generateHTMLtr(['Ville', team.venue_city]));
  infosTable.append(generateHTMLtr(['Capacité stade', team.venue_capacity]));
});

const urlLastFixtures = `fixtures/team/${idToDisplay}/last/5`;

generateGetRequest(urlLastFixtures).then((response) => {
  const table = $('#latestFixtures');
  response.data.api.fixtures.forEach((element) => {
    const fixture = new Fixture();
    fixture.league = element.league.name;
    fixture.homeTeamName = element.homeTeam.team_name;
    fixture.awayTeamName = element.awayTeam.team_name;
    fixture.goalsHomeTeam = element.goalsHomeTeam;
    fixture.goalsAwayTeam = element.goalsAwayTeam;
    fixture.eventDate = element.event_date;
    fixture.leagueName = element.league.name;
    fixture.leagueId = element.league_id;
    table.append(generateHTMLtr([fixture.eventHourTime(), fixture.homeTeamName, fixture.awayTeamName, fixture.fullscore(), `<a href='./onl_league.html?id=${fixture.leagueId}'>${fixture.leagueName}</a>`]));
  });
});

const urlNextFixtures = `fixtures/team/${idToDisplay}/next/5`;

generateGetRequest(urlNextFixtures).then((response) => {
  const table = $('#nextFixtures');
  response.data.api.fixtures.forEach((element) => {
    const fixture = new Fixture();
    fixture.league = element.league.name;
    fixture.homeTeamName = element.homeTeam.team_name;
    fixture.awayTeamName = element.awayTeam.team_name;
    fixture.eventDate = element.event_date;
    fixture.leagueName = element.league.name;
    fixture.leagueId = element.league_id;
    table.append(generateHTMLtr([fixture.eventHourTime(), fixture.homeTeamName, fixture.awayTeamName, `<a href='./onl_league.html?id=${fixture.leagueId}'>${fixture.leagueName}</a>`]));
  });
});

$('#go_back').click( () => {
  $(location).attr('href', './menu.html');
});
