const querystring = require('querystring');
const $ = require('jquery');

import {generateGetRequest} from './utils/httputils.js';
import {generateHTMLtr, generateHTMLtd, generateHTMLtable} from './utils/htmlutils.js';
import {Lineup} from './classes/lineups.js';

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
  const events = response.data.api.events.sort((a, b) => (b.elapsed - a.elapsed));
  if (events.length != 0) {
    events.forEach((event) => {
      let display;
      // All icons come from flaticon.com
      if (event.type.localeCompare('Goal') == 0) {
        if (event.assist == null) {
          display = `<img src='../icons/football-ball.svg' width='15px' height='15px'> (${event.elapsed}') Goal for ${event.teamName}, <a href='./player.html?id=${event.player_id}'>${event.player}</a> scored.`;
        } else {
          display = `<img src='../icons/football-ball.svg' width='15px' height='15px'> (${event.elapsed}') Goal for ${event.teamName}, <a href='./player.html?id=${event.player_id}'>${event.player}</a> scored with an assist from <a href='./player.html?id=${event.assist_id}'>${event.assist}</a>`;
        }
      } else if (event.type.localeCompare('Card') == 0) {
        if (event.detail.localeCompare('Yellow Card') == 0) {
          display = `<img src='../icons/yellow-card.svg' width='15px' height='15px'> (${event.elapsed}') ${event.detail} for <a href='./player.html?id=${event.player_id}'>${event.player}</a>`;
        } else {
          display = `<img src='../icons/red-card.svg' width='15px' height='15px'> (${event.elapsed}') ${event.detail} for <a href='./player.html?id=${event.player_id}'>${event.player}</a>`;
        }
      } else if (event.type.localeCompare('subst') == 0) {
        display = `<img src='../icons/arrows.svg' width='15px' height='15px'> (${event.elapsed}') <a href='./player.html?id=${event.player_id}'>${event.player}</a> replaces <a href='./player.html?id=${event.assist_id}'>${event.assist}</a>`;
      }
      $('#events').append(`<li class="list-group-item" style="background-color: #1a1a1a; border-color: #2b2b2b; color: #ffffff">${display}</li>`);
    });
  } else {
    $('#events').append(`<li class="list-group-item" style="background-color: #1a1a1a; border-color: #2b2b2b; color: #ffffff">Not available</li>`);
  }
});
