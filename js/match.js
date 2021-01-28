const QUERY_STRING = require('querystring');
const $ = require('jquery');

import {generateGetRequest} from './utils/httputils.js';
import {generateHTMLtr} from './utils/htmlutils.js';
import {Lineup} from './classes/lineups.js';
import {Events} from './classes/events.js';

const QUERY = QUERY_STRING.parse(global.location.search);
const ID_TO_DISPLAY = JSON.parse(QUERY['?id']);

generateGetRequest(`lineups/${ID_TO_DISPLAY}`).then((response) => {
  const lineups = Lineup.fromResponse(response);
  $('#title').text('').append(lineups.generateHTMLTitle());
  $('#coachs').append(generateHTMLtr([lineups.homeTeamCoach, lineups.awayTeamCoach]));
  $('#lineups').append(lineups.generateHTMLStartingXITR());
  $('#substitutes').append(lineups.generateHTMLBenchTR());
}).catch((error) => alert(error));


generateGetRequest(`events/${ID_TO_DISPLAY}`).then((response) => {
  const events = Events.fromResponse(response);
  $('#events').append(events.generateHTMLevents());
});
