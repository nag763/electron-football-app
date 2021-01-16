const $ = require('jquery');
const Parser = require('rss-parser');

import {
  generateGetRequest
} from './utils/httputils.js';

const enterKey = 13;
const pathSearchLeague = 'leagues/search/';
const pathSearchTeam = 'teams/search/';
const {
  shell
} = require('electron');
const fs = require('fs');

$('#home_page').click(() => {
  $(location).attr('href', '../index.html');
});

$('#next_fixtures').click(() => {
  $(location).attr('href', './next_fixtures.html');
});

$("#get_an_api_key").click(() => {
  shell.openExternal('https://www.api-football.com/')
})

$("#write_key").keypress((e) => {
  if (e.which == 13) {
    const userInput = $("#write_key").val();
    $("#write_key").val("");
    $("#write_key").attr("placeholder", "Key written!")
    fs.writeFile("./api.key", userInput, (err) => {
      if (err) {
        return console.log(err);
      };
      console.log('Key written');
    });
  }
})

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

$('#searchbar').keypress(function(e) {
  const userInput = $(this).val();
  if($('#searchbar').val().length == 0){
    $('#title').text('Latest news')
    getLatestRedditRSS();
  } else if (userInput.length < 2) {
    $('#title').text('You need to search with at least 2 characters, press enter to research.')
  } else {
    if (e.which == enterKey) {
      $('#latest_news li').remove();
      generateGetRequest(pathSearchTeam.concat(userInput)).then((response) => {
        response.data.api.teams.forEach((element) => {
          $('#latest_news').append(`<li class="list-group-item" style="background-color: #1a1a1a; border-color: #2b2b2b; color: #ffffff"><a href='./onl_team.html?id=${element.team_id}'>${element.name}</a></li>`);
        });
        generateGetRequest(pathSearchLeague.concat(userInput)).then((response) => {
          response.data.api.leagues.sort(function(a, b) {
            return b.season - a.season;
          }).forEach((element) => {
            $('#latest_news').append(`<li class="list-group-item" style="background-color: #1a1a1a; border-color: #2b2b2b; color: #ffffff"><a href='./onl_league.html?id=${element.league_id}'>[${element.season}]${element.name}, ${element.country}</a></li>`);
          });
        });
      });
    }
  }
});


async function getLatestRedditRSS(){

  const now = new Date();

  const parser = new Parser();
  const feed = await parser.parseURL('https://www.reddit.com/r/soccer/new.rss');
  $('#latest_news li').remove();
  feed.items.slice(0, 10).forEach(item => {
    const diffMs = (now - new Date(item.pubDate));
    // Yes, I stole that from internet
    const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000);
    $('#latest_news').append(
      `<li class="list-group-item" style="background-color: #1a1a1a; border-color: #2b2b2b; color: #ffffff">${item.title} (${diffMins} mns ago)</li>`
    );
  });

};

getLatestRedditRSS();
