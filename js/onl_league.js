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
    $('#rankings').append(
        generateHTMLtable(rankingHeadersTable, table.map((team) => [team.rank, team.teamName, team.points, team.all.matchsPlayed, team.all.win, team.all.draw, team.all.lose, team.all.goalsFor, team.all.goalsAgainst, (team.all.goalsFor - team.all.goalsAgainst)])),
    );
  });
});


$('#go_back').click( () => {
  $(location).attr('href', './menu.html');
});
