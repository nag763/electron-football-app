const querystring = require('querystring');
const $ = require('jquery');

import {generateGetRequest} from './utils/httputils.js';
import {generateHTMLtr, generateHTMLtd, generateHTMLtable} from './utils/htmlutils.js';
import {User} from './classes/user.js';
import {League} from './classes/league.js';

const query = querystring.parse(global.location.search);
const idToDisplay = JSON.parse(query['?id']);

const urlForInfo = `leagues/league/${idToDisplay}`;
const urlForRounds = `fixtures/rounds/${idToDisplay}`;
const urlForTable = `leagueTable/${idToDisplay}`;

// Fetching the league info
generateGetRequest(urlForInfo).then((response) => {
  const leagueDisplayed = League.fromResponse(response);

  $('#title').text(leagueDisplayed.name);
  $('#logo').attr('src', leagueDisplayed.logo);
  $('#subtitle').text(leagueDisplayed.getDescription());

  $('#profiling').click(() => {
    if (User.isLeagueIdInProfile(leagueDisplayed.id)) {
      User.removeLeague(leagueDisplayed);
    } else {
      User.addLeague(leagueDisplayed);
    }
    $('#profiling').text(User.getActionAssociatedWithLeagueId(leagueDisplayed.id));
  }).text(User.getActionAssociatedWithLeagueId(leagueDisplayed.id));

  generateGetRequest(urlForTable).then((response) => {
    leagueDisplayed.setTablesFromResponse(response);
    leagueDisplayed.generateHTMLTablesForStandings().forEach((table) => {
      $('#rankings').append(table);
    });
  });

  generateGetRequest(urlForRounds).then((response) => {
    leagueDisplayed.settRoundsFromResponse(response);
    $('#next_rounds').append(leagueDisplayed.generateHTMLForRounds());
  });
});
