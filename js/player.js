const querystring = require('querystring');
const $ = require('jquery');

const query = querystring.parse(global.location.search);
const idToDisplay = JSON.parse(query['?id']);

import {generateGetRequest} from './utils/httputils.js';

import {generateHTMLtr} from './utils/htmlutils.js';
import {Player} from './classes/player.js';

let statsAvailable;

generateGetRequest(`players/player/${idToDisplay}`).then((response) => {
  const PLAYER = Player.fromResponse(response);
  const STATS_AVAILABLE = PLAYER.stats;
  $('#playerName').text(PLAYER.getFullName());
  $('#desc').text(PLAYER.getBio());
  $('#statdesc');
  displayStats(STATS_AVAILABLE[0]);
  $('#select').append(PLAYER.availableStats.join('\n')).change(function() {
    displayStats(STATS_AVAILABLE[$('#select').val()]);
  });
});

function displayStats(stats) {
  $('#games tr, #substitutes tr, #cards tr, #goals tr, #passes tr, #shots tr, #penalties tr, #dribbles tr, #duels tr, #tackles tr, #fouls tr').remove();
  $('#statsdesc').text('').append(stats.getStatInfo());
  $('#games').append(stats.getGamesPlayedStatsAsTR());
  $('#substitutes').append(stats.getSubsAsTR());
  $('#cards').append(stats.getCardsAsTR());
  $('#goals').append(stats.getInvolvementsAsTR());
  $('#passes').append(stats.getPassesAsTR());
  $('#shots').append(stats.getShotsAsTR());
  $('#penalties').append(stats.getPensAsTR());
  $('#dribbles').append(stats.getDribblesAsTR());
  $('#duels').append(stats.getDuelsAsTR());
  $('#tackles').append(stats.getTacklesAsTR());
  $('#fouls').append(stats.getFoulsAsTR());
}
