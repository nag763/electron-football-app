const querystring = require('querystring');
const $ = require('jquery');

import {generateGetRequest} from './utils/httputils.js';
import {generateHTMLtr, generateHTMLtd, generateHTMLtable} from './utils/htmlutils.js';
import {Lineup} from './classes/lineups.js';
import {Events} from './classes/events.js';

const query = querystring.parse(global.location.search);
const idToDisplay = JSON.parse(query['?id']);

generateGetRequest(`lineups/${idToDisplay}`).then((response) => {
  const lineups = Lineup.fromResponse(response);
  $('#title').text('').append(lineups.generateHTMLTitle());
  $('#coachs').append(generateHTMLtr([lineups.homeTeamCoach, lineups.awayTeamCoach.coach]));
  $('#lineups').append(lineups.generateHTMLStartingXITR());
  $('#substitutes').append(lineups.generateHTMLBenchTR());
});


generateGetRequest(`events/${idToDisplay}`).then((response) => {
  const events = Events.fromResponse(response);
  $('#events').append(events.generateHTMLevents());
});
