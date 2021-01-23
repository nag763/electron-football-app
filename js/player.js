const QUERY_STRING = require('querystring');
const $ = require('jquery');

const QUERY = QUERY_STRING.parse(global.location.search);
const ID_TO_DISPLAY = JSON.parse(QUERY['?id']);

import {generateGetRequest} from './utils/httputils.js';
import {Player} from './classes/player.js';

/**
* Display the stats in the view.
*
* @param {object} stats - the stats to display.
*/
function displayStats(stats) {
  $('#games tr, #substitutes tr, #cards tr, #goals tr, #passes tr, #shots tr')
      .add('#penalties tr, #dribbles tr, #duels tr, #tackles tr, #fouls tr')
      .remove();
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

generateGetRequest(`players/player/${ID_TO_DISPLAY}`).then((response) => {
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
