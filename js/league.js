const QUERY_STRING = require('querystring');
const $ = require('jquery');

import {generateGetRequest} from './utils/httputils.js';
import {User} from './classes/user.js';
import {League} from './classes/league.js';

const QUERY = QUERY_STRING.parse(global.location.search);
const ID_TO_DISPLAY = JSON.parse(QUERY['?id']);

const URL_FOR_INFO = `leagues/league/${ID_TO_DISPLAY}`;
const URL_FOR_ROUNDS = `fixtures/rounds/${ID_TO_DISPLAY}`;
const URL_FOR_TABLE = `leagueTable/${ID_TO_DISPLAY}`;

// Fetching the league info
generateGetRequest(URL_FOR_INFO).then((response) => {
  const LEAGUE = League.fromResponse(response);

  $('#title').text(LEAGUE.name);
  $('#logo').attr('src', LEAGUE.logo);
  $('#subtitle').text(LEAGUE.getDescription());

  $('#profiling').click(() => {
    if (User.isLeagueIdInProfile(LEAGUE.id)) {
      User.removeLeague(LEAGUE);
    } else {
      User.addLeague(LEAGUE);
    }
    $('#profiling').text(User.getActionAssociatedWithLeagueId(LEAGUE.id));
  }).text(User.getActionAssociatedWithLeagueId(LEAGUE.id));

  generateGetRequest(URL_FOR_TABLE).then((response) => {
    LEAGUE.setTablesFromResponse(response);
    LEAGUE.generateHTMLTablesForStandings().forEach((table) => {
      $('#rankings').append(table);
    });
  });

  generateGetRequest(URL_FOR_ROUNDS).then((response) => {
    LEAGUE.settRoundsFromResponse(response);
    $('#next_rounds').append(LEAGUE.generateHTMLForRounds());
  });
});
