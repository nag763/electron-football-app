const QUERY_STRING = require('querystring');
const $ = require('jquery');

import {generateGetRequest} from './utils/httputils.js';
import {generateHTMLtr} from './utils/htmlutils.js';
import {Lineup} from './classes/lineups.js';
import {Events} from './classes/events.js';
import {ErrorHandler} from './utils/errorhandler.js';

const QUERY = QUERY_STRING.parse(global.location.search);
const ID_TO_DISPLAY = JSON.parse(QUERY['?id']);
console.log(QUERY['homeTeamLogo']);
const ID_LOGO_HT = QUERY['homeTeamLogo'];
const ID_LOGO_AT = QUERY['awayTeamLogo'];

$('#logos').text('').append(`<img src="${ID_LOGO_HT}"/><img src="${ID_LOGO_AT}"/>`);

generateGetRequest(`lineups/${ID_TO_DISPLAY}`).then((response) => {
  const lineups = Lineup.fromResponse(response);

  $('#title').text('').append(lineups.generateHTMLTitle());
  $('#coachs').append(generateHTMLtr([lineups.homeTeamCoach, lineups.awayTeamCoach]));
  $('#lineups').append(lineups.generateHTMLStartingXITR());
  $('#substitutes').append(lineups.generateHTMLBenchTR());
}).catch((error) => ErrorHandler.onResponse(error, true));


generateGetRequest(`events/${ID_TO_DISPLAY}`).then((response) => {
  const events = Events.fromResponse(response);
  $('#events').append(events.generateHTMLevents() || '<li class="list-group-item">Not available</li>');
});
