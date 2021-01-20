function Events() {}
function Event() {}

import {generateClickableText, generateImage} from '../utils/htmlutils.js';

/**
  * Get the events from the response object.
  *
  *
  * @return {events} a list of events
  **/
Events.fromResponse = function(response) {
  // Sort by desc time
  const events = new Events();
  events.events = response.data.api.events.sort(
      (a, b) => (b.elapsed - a.elapsed),
  ).map((element) => {
    const event = new Event();
    event.elapsed = element.elapsed;
    event.type = element.type;
    event.detail = element.detail;
    event.teamName = element.teamName;
    event.player = element.player;
    event.player_id = element.player_id;
    event.assist = element.assist;
    event.assist_id = element.assist_id;
    return event;
  });
  return events;
};

/**
  * Generate the html events from the ones being stored.
  *
  * @return {string} a list of html events as a list.
  *
  */
Events.prototype.generateHTMLevents = function() {
  return this.events.map((event) => {
    let display = '<li class="list-group-item">';
    console.log(event);
    if (event.type.localeCompare('Goal') == 0) {
      display += generateImage('../icons/football-ball.svg');
      display += ` (${event.elapsed}') Goal for ${event.teamName}, `;
      display += generateClickableText(`./player.html?id=${event.player_id}`, event.player);
      console.log(display);
      if (event.assist != null && event.assist != undefined) {
        display += 'scored with an assist from ';
        display += generateClickableText(`./player.html?id=${event.assist_id}`, event.assist);
      } else {
        display += ' scored';
      }
    } else if (event.type.localeCompare('Card') == 0) {
      if (event.detail.localeCompare('Yellow Card') == 0) {
        display += generateImage('../icons/yellow-card.svg');
      } else {
        display += generateImage('../icons/yred-card.svg');
      }
      display += ` (${event.elapsed}') ${event.detail} for `;
      display += generateClickableText(`./player.html?id=${event.player_id}`, event.player);
    } else if (event.type.localeCompare('subst') == 0) {
      display += generateImage('../icons/arrows.svg');
      display += `(${event.elapsed}') `;
      display += generateClickableText(`'./player.html?id=${event.player_id}'`, event.player);
      display += ' replaces ';
      display += generateClickableText(`./player.html?id=${event.assist_id}`, event.assist);
    } else {
      display += 'Not available';
    }
    display += '</li>';
    return display;
  }).join('\n');
};

export {Events};
