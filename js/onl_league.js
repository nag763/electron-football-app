const querystring = require('querystring');
const $ = require('jquery');

import {generateGetRequest} from './utils/httputils.js';
import {generateHTMLtr, generateHTMLtd, generateHTMLtable} from './utils/htmlutils.js';

const query = querystring.parse(global.location.search);
const idToDisplay = JSON.parse(query['?id']);

const urlForInfo = `leagues/league/${idToDisplay}`;

generateGetRequest(urlForInfo).then((response) => {
  const leagueToDisplay = response.data.api.leagues[0];

  $('#title').text(leagueToDisplay.name);
  $('#logo').attr('src', leagueToDisplay.logo);
  $('#subtitle').text(`${leagueToDisplay.type} played in ${leagueToDisplay.country}`);
});

const urlForTable = `leagueTable/${idToDisplay}`;
const rankingHeadersTable = ['Rank', 'Team', 'Point', 'MP', 'Wins', 'Draw', 'Lose', 'GF', 'GA', 'Difference'];

generateGetRequest(urlForTable).then((response) => {
  response.data.api.standings.forEach((table) => {
    $('#rankings').append(
        generateHTMLtable(rankingHeadersTable, table.map((team) => [team.rank, `<a href='./onl_team.html?id=${team.team_id}'>${team.teamName}</a>`, team.points, team.all.matchsPlayed, team.all.win, team.all.draw, team.all.lose, team.all.goalsFor, team.all.goalsAgainst, (team.all.goalsFor - team.all.goalsAgainst)], table.map((team) => team.team_id))),
    );
  });
});

const urlForRounds = `fixtures/rounds/${idToDisplay}`;

generateGetRequest(urlForRounds).then((response) => {
  response.data.api.fixtures.forEach((fixture, index) => {
    $('#next_rounds').append(`<li class="list-group-item" style="background-color: #1a1a1a; border-color: #2b2b2b; color: #ffffff"><a href='./next_fixtures.html?league=${idToDisplay}&fixture=${fixture}&mdnumber=${index}'>Match day ${index}</li>`);
  });
});

$('#go_back').click( () => {
  $(location).attr('href', './menu.html');
});
