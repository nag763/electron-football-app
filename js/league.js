const querystring = require('querystring');
const $ = require('jquery');

import {generateGetRequest} from './utils/httputils.js';
import {generateHTMLtr, generateHTMLtd, generateHTMLtable} from './utils/htmlutils.js';

const query = querystring.parse(global.location.search);
const idToDisplay = JSON.parse(query['?id']);

const urlForInfo = `leagues/league/${idToDisplay}`;

const fs = require('fs');
const path = require('path');

let country;

generateGetRequest(urlForInfo).then((response) => {
  const leagueToDisplay = response.data.api.leagues[0];
  country = leagueToDisplay.country;

  $('#title').text(leagueToDisplay.name);
  $('#logo').attr('src', leagueToDisplay.logo);
  $('#subtitle').text(`${leagueToDisplay.type} played in ${country}`);
});

const urlForTable = `leagueTable/${idToDisplay}`;
const rankingHeadersTable = ['Rank', 'Team', 'Point', 'MP', 'Wins', 'Draw', 'Lose', 'GF', 'GA', 'Difference'];

generateGetRequest(urlForTable).then((response) => {
  response.data.api.standings.forEach((table) => {
    $('#rankings').append(
        generateHTMLtable(rankingHeadersTable, table.map((team) => [team.rank, `<a href='./team.html?id=${team.team_id}'><img src="${team.logo}" width=15 height=15/> ${team.teamName}</a>`, team.points, team.all.matchsPlayed, team.all.win, team.all.draw, team.all.lose, team.all.goalsFor, team.all.goalsAgainst, (team.all.goalsFor - team.all.goalsAgainst)], table.map((team) => team.team_id))),
    );
  });
});

const urlForRounds = `fixtures/rounds/${idToDisplay}`;

generateGetRequest(urlForRounds).then((response) => {
  response.data.api.fixtures.forEach((fixture, index) => {
    $('#next_rounds').append(`<li class="list-group-item" style="background-color: #1a1a1a; border-color: #2b2b2b; color: #ffffff"><a href='./fixtures.html?league=${idToDisplay}&fixture=${fixture}&mdnumber=${index}'>Match day ${index}</li>`);
  });
});

$('#go_back').click( () => {
  $(location).attr('href', './menu.html');
});


const profile = JSON.parse(function readProfile() {
  return fs.readFileSync(
      path.resolve(__dirname, ['..', 'profile.json'].join(path.sep)), 'utf-8')
      .trim();
}());

if (profile.favoriteLeagues == undefined || profile.favoriteLeagues == null) {
  profile.favoriteLeagues = new Array();
  $('#profiling').text('Add league to profile');
} else if (!profile.favoriteLeagues.map((league) => league.id).includes(idToDisplay)) {
  $('#profiling').text('Add league to profile');
} else {
  $('#profiling').text('Remove league from profile');
}

$('#profiling').click(() => {
  const textInTag = $('#profiling').text();
  const object = {'id': idToDisplay, 'name': `${country}, ${$('#title').text()}`};
  if (textInTag.localeCompare('Add league to profile') == 0) {
    $('#profiling').text('Remove league from profile');
    profile.favoriteLeagues.push(object);
  } else {
    $('#profiling').text('Add league to profile');
    const index = profile.favoriteLeagues.indexOf(object);
    profile.favoriteLeagues.splice(index, 1);
  }
  fs.writeFile('./profile.json', JSON.stringify(profile), (err) => {
    if (err) {
      return console.log(err);
    }
    console.log('Profile updated');
  });
});
