const querystring = require('querystring');
const $ = require('jquery');

import {generateGetRequest} from './utils/httputils.js';
import {generateHTMLtr, generateHTMLtd, generateHTMLtable} from './utils/htmlutils.js';
import {User} from './classes/user.js'
import {League} from './classes/league.js'

const query = querystring.parse(global.location.search);
const idToDisplay = JSON.parse(query['?id']);

const urlForInfo = `leagues/league/${idToDisplay}`;

let leagueDisplayed;

generateGetRequest(urlForInfo).then((response) => {
  leagueDisplayed = League.fromResponse(response);

  $('#title').text(leagueDisplayed.name);
  $('#logo').attr('src', leagueDisplayed.logo);
  $('#subtitle').text(leagueDisplayed.getDescription());

  $('#profiling').click(() => {
    if (User.isLeagueIdInProfile(leagueDisplayed.id)) {
      User.removeLeague(leagueDisplayed)
    } else {
      User.addLeague(leagueDisplayed)
    }
    $('#profiling').text(User.getActionAssociatedWithLeagueId(leagueDisplayed.id))
  }).text(User.getActionAssociatedWithLeagueId(leagueDisplayed.id));
});

const urlForTable = `leagueTable/${idToDisplay}`;
const rankingHeadersTable = ['Rank', 'Team', 'Point', 'MP', 'Wins', 'Draw', 'Lose', 'GF', 'GA', 'Difference'];

generateGetRequest(urlForTable).then((response) => {
  response.data.api.standings.forEach((table) => {
    $('#rankings').append(
        generateHTMLtable(rankingHeadersTable, table.map((team) => [team.rank, `<a href='./team.html?id=${team.team_id}'><img src="${team.logo}" width=15 height=15/> ${team.teamName}</a>`, team.points, team.all.matchsPlayed, team.all.win, team.all.draw, team.all.lose, team.all.goalsFor, team.all.goalsAgainst, (team.all.goalsFor - team.all.goalsAgainst)], table.map((team) => team.team_id))),
    );
  });
});

const urlForRounds = `fixtures/rounds/${idToDisplay}`;

generateGetRequest(urlForRounds).then((response) => {
  response.data.api.fixtures.forEach((fixture, index) => {
    $('#next_rounds').append(`<li class="list-group-item" style="background-color: #1a1a1a; border-color: #2b2b2b; color: #ffffff"><a href='./fixtures.html?league=${idToDisplay}&fixture=${fixture}&mdnumber=${index}'>Match day ${index}</li>`);
  });
});

$('#go_back').click( () => {
  $(location).attr('href', './menu.html');
});
