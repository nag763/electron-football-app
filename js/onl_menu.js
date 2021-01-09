const $ = require('jquery');

import {generateGetRequest} from './utils/httputils.js';

const enterKey = 13;
const pathSearchLeague = 'leagues/search/';
const pathSearchTeam = 'teams/search/';

$('#home_page').click( () => {
  $(location).attr('href', '../index.html');
});

$('#next_fixtures').click( () => {
  $(location).attr('href', './next_fixtures.html');
});

$('#searchLeague').keypress(function(e) {
  if (e.which == enterKey) {
    const userInput = $(this).val();
    $('#results').empty();
    if (2 < userInput.length) {
      generateGetRequest(pathSearchLeague.concat(userInput)).then((response) => {
        response.data.api.leagues.sort(function(a, b) {
          return b.season - a.season;
        }).forEach((element) => {
          $('#results').append(`<li><a href='./onl_league.html?id=${element.league_id}'>[${element.season}]${element.name}, ${element.country}</a></li>`);
        });
      });
    }
  }
});

$('#searchTeam').keypress(function(e) {
  if (e.which == enterKey) {
    const userInput = $(this).val();
    $('#results').empty();
    if (2 < userInput.length) {
      generateGetRequest(pathSearchTeam.concat(userInput)).then((response) => {
        response.data.api.teams.forEach((element) => {
          $('#results').append(`<li><a href='./onl_team.html?id=${element.team_id}'>${element.name}</a></li>`);
        });
      });
    }
  }
});
