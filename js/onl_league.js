const querystring = require('querystring');
const $ = require('jquery');

import {generateGetRequest} from './utils/httputils.js';
import {generateHTMLtr, generateHTMLtd, generateHTMLtable} from './utils/htmlutils.js';

const query = querystring.parse(global.location.search);
const idToDisplay = JSON.parse(query['?id']);

const urlForInfo = `leagues/league/${idToDisplay}`;

generateGetRequest(urlForInfo).then((response) => {
  const leagueToDisplay = response.data.api.leagues[0];
  const infosTable = $('#infos');

  $('#title').text(leagueToDisplay.name);
  infosTable.append(generateHTMLtr(['Country', `${leagueToDisplay.country} <img src='${leagueToDisplay.flag}'/>`]));
  infosTable.append(generateHTMLtr(['Type', leagueToDisplay.type]));
  infosTable.append(generateHTMLtr(['Season', leagueToDisplay.season]));
  infosTable.append(generateHTMLtr(['logo', `<img src='${leagueToDisplay.logo}'/>`]));
});

const urlForTable = `leagueTable/${idToDisplay}`;
const rankingHeadersTable = ['Rank', 'Team', 'Point', 'MP', 'Wins', 'Draw', 'Lose', 'GF', 'GA', 'Difference'];

generateGetRequest(urlForTable).then((response) => {
  response.data.api.standings.forEach((table) => {
    console.log(table);
    $('#rankings').append(
        generateHTMLtable(rankingHeadersTable, table.map((team) => [team.rank, `<a href='./onl_team.html?id=${team.team_id}'>${team.teamName}</a>`, team.points, team.all.matchsPlayed, team.all.win, team.all.draw, team.all.lose, team.all.goalsFor, team.all.goalsAgainst, (team.all.goalsFor - team.all.goalsAgainst)], table.map((team) => team.team_id))),
    );
  });
});

const urlForRounds = `fixtures/rounds/${idToDisplay}`;

generateGetRequest(urlForRounds).then((response) => {
  response.data.api.fixtures.forEach((fixture, index) => {
    $('#rounds').append(`<li><a href='./next_fixtures.html?league=${idToDisplay}&fixture=${fixture}&mdnumber=${index}'>Match day ${index}</li>`);
  });
});

$('#go_back').click( () => {
  $(location).attr('href', './menu.html');
});
