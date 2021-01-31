const $ = require('jquery');
const RSS_PARSER = require('rss-parser');
const {shell} = require('electron');

import {User} from './classes/user.js';
import {generateGetRequest} from './utils/httputils.js';
import {generateClikableLi} from './utils/htmlutils.js';
import {ErrorHandler} from './utils/errorhandler.js';

const ENTER_KEY = 13;
const URL_SEARCH_LEAGUE = 'leagues/search/';
const URL_SEARCH_TEAM = 'teams/search/';
const URL_SEARCH_PLAYER = 'players/search/';

/**
* Get the latest news from the reddit rss flux.
*/
async function getLatestRedditRSS() {
  const now = new Date();

  const PARSER = new RSS_PARSER();
  $('#title').text('Latest news');
  const feed = await PARSER.parseURL('https://www.reddit.com/r/soccer/new.rss');
  $('#latest_news li').remove();
  $('#latest_news').append(feed.items.slice(0, 10).map((item) => {
    const diffMs = (now - new Date(item.pubDate));
    // Yes, I stole that from internet
    const diffHrs = Math.floor((diffMs % 86400000) / 3600000);
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
    let content = '<li class="list-group-item">';
    if (diffHrs != 0) {
      content += `${item.title} (${diffHrs} hours and ${diffMins} mns ago)`;
    } else {
      content += `${item.title} (${diffMins} mns ago)`;
    }
    content += ` <i class="fa fa-link" aria-hidden="true" id=${item.link}></i></li>`;
    return content;
  }).join('\n'));
  $('.fa-link').on('click', function() {
    shell.openExternal($(this).attr('id')); // eslint-disable-line no-invalid-this
  });
}

$('#next_fixtures').click(() => {
  $(location).attr('href', './fixtures.html');
});

$('#get_an_api_key').click(() => {
  shell.openExternal('https://www.api-football.com/');
});

$('#write_key').keypress((e) => {
  if (e.which == ENTER_KEY) {
    const userInput = $('#write_key').val();
    User.setKey(userInput);
  }
});

$('#searchbar').keypress(function(e) {
  const userInput = $('#searchbar').val();
  if ($('#searchbar').val().length == 0) {
    getLatestRedditRSS();
  } else if (userInput.length < 2) {
    $('#title').text('You need to search with at least 2 characters, press enter to research.');
  } else {
    if (e.which == ENTER_KEY) {
      $('#latest_news li').remove();

      generateGetRequest(URL_SEARCH_TEAM.concat(userInput)).then((response) => {
        const teams = response.data.api.teams;
        $('#latest_news').append(teams.map((element) =>
          generateClikableLi(`./team.html?id=${element.team_id}`, element.name),
        ).join('\n'));
      }).catch((error) => ErrorHandler.onResponse(error));

      generateGetRequest(URL_SEARCH_LEAGUE.concat(userInput)).then((response) => {
        const leagues = response.data.api.leagues.sort(
            (a, b) => (b.season - a.season),
        );
        $('#latest_news').append(leagues.map((league) =>
          generateClikableLi(`./league.html?id=${league.league_id}`, `[${league.season}] ${league.name}, ${league.country}`),
        ).join('\n'));
      });

      generateGetRequest(URL_SEARCH_PLAYER.concat(userInput)).then((response) => {
        const players = response.data.api.players;
        $('#latest_news').append(players.map((player) =>
          generateClikableLi(`./player.html?id=${player.player_id}`, `${player.firstname} ${player.lastname}`),
        ).join('\n'));
      });
      $('#title').text('Search results');
    }
  }
});

$('#lock').click(() => {
  const state = $('#lock');
  const apiKeyField = $('#write_key');
  if (state.attr('class').localeCompare('fa fa-lock') == 0) {
    state.attr('class', 'fa fa-unlock');
    apiKeyField.removeAttr('disabled');
  } else {
    state.attr('class', 'fa fa-lock');
    apiKeyField.attr('disabled', 'disabled');
  }
},
);


getLatestRedditRSS();
