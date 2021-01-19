const querystring = require('querystring');
const $ = require('jquery');
const fs = require('fs');
const path = require('path');

import {
  generateGetRequest,
} from './utils/httputils.js';
import {
  generateHTMLtr,
} from './utils/htmlutils.js';
import {
  Fixture,
} from './classes/fixture.js';

const query = querystring.parse(global.location.search);
const idToDisplay = JSON.parse(query['?id']);


const urlTeam = `teams/team/${idToDisplay}`;

generateGetRequest(urlTeam).then((response) => {
  const team = response.data.api.teams[0];
  const infosTable = $('#infos');
  $('#title').text(team.name);
  $('#clubName').text(team.name);
  $('#logo').attr('src', team.logo);
  $('#desc').text(`
  Founded in ${team.founded}, ${team.name} is a club playing in ${team.country}.
  Its stadium, ${team.venue_name}, has a capacity of ${team.venue_capacity} seats.
  `);
});

const urlLatestFixtures = `fixtures/team/${idToDisplay}/last/5`;

generateGetRequest(urlLatestFixtures).then((response) => {
  const table = $('#latestFixtures');
  response.data.api.fixtures.forEach((element) => {
    const fixture = new Fixture();
    fixture.league = element.league.name;
    fixture.homeTeamName = element.homeTeam.team_name;
    fixture.homeTeamId = element.homeTeam.team_id;
    fixture.leagueLogo = element.league.logo;
    fixture.homeTeamLogo = element.homeTeam.logo;
    fixture.awayTeamName = element.awayTeam.team_name;
    fixture.awayTeamId = element.awayTeam.team_id;
    fixture.awayTeamLogo = element.awayTeam.logo;
    fixture.eventDate = element.event_date;
    fixture.leagueName = element.league.name;
    fixture.leagueId = element.league_id;
    table.append(generateHTMLtr([fixture.eventHourTime(), `<a href='./team.html?id=${fixture.homeTeamId}'><img src="${fixture.homeTeamLogo}" width=15 height=15/> ${fixture.homeTeamName}</a>`, `<a href='./team.html?id=${fixture.awayTeamId}'><img src="${fixture.awayTeamLogo}" width=15 height=15/> ${fixture.awayTeamName}</a>`, fixture.fullscore(), `<a href='./league.html?id=${fixture.leagueId}'><img src="${fixture.leagueLogo}" width=15 height=15/> ${fixture.leagueName}</a>`]));
  });
});

const urlNextFixtures = `fixtures/team/${idToDisplay}/next/5`;

generateGetRequest(urlNextFixtures).then((response) => {
  const table = $('#nextFixtures');
  response.data.api.fixtures.forEach((element) => {
    const fixture = new Fixture();
    fixture.league = element.league.name;
    fixture.homeTeamName = element.homeTeam.team_name;
    fixture.homeTeamId = element.homeTeam.team_id;
    fixture.leagueLogo = element.league.logo;
    fixture.homeTeamLogo = element.homeTeam.logo;
    fixture.awayTeamName = element.awayTeam.team_name;
    fixture.awayTeamId = element.awayTeam.team_id;
    fixture.awayTeamLogo = element.awayTeam.logo;
    fixture.eventDate = element.event_date;
    fixture.leagueName = element.league.name;
    fixture.leagueId = element.league_id;
    table.append(generateHTMLtr([fixture.eventHourTime(), `<a href='./team.html?id=${fixture.homeTeamId}'><img src="${fixture.homeTeamLogo}" width=15 height=15/> ${fixture.homeTeamName}</a>`, `<a href='./team.html?id=${fixture.awayTeamId}'><img src="${fixture.awayTeamLogo}" width=15 height=15/> ${fixture.awayTeamName}</a>`, `<a href='./league.html?id=${fixture.leagueId}'><img src="${fixture.leagueLogo}" width=15 height=15/> ${fixture.leagueName}</a>`]));
  });
});

function displaySquad(date) {
  generateGetRequest(`players/squad/${idToDisplay}/${date}`).then((response) => {
    if (response.data.api.results =! 0) {
      const players = response.data.api.players;
      players.sort((a, b) => (a.lastname.localeCompare(b.lastname))).forEach((player) => {
        $('#squad').append(generateHTMLtr([`<a href=./player.html?id=${player.player_id}>${player.firstname} ${player.lastname}</a>`, `${player.position}`, `${player.nationality}`, `${player.age}`, `${player.birth_place}`, player.height, player.weight]));
      });
    } else {
      // Date like 2020
      if (date.length == 4) {
        displaySquad(`${parseInt(data)-1}-${date}`);
      // Date like 2020-2021
      } else if (date.length == 9) {
        displaySquad(date.substring(0, 4));
      }
    }
  });
}

displaySquad('2020-2021');

const profile = JSON.parse(function readProfile() {
  return fs.readFileSync(
      path.resolve(__dirname, ['..', 'profile.json'].join(path.sep)), 'utf-8')
      .trim();
}());

if (profile.favoriteTeams == undefined || profile.favoriteTeams == null) {
  profile.favoriteTeams = new Array();
  $('#profiling').text('Add team to profile');
} else if (!profile.favoriteTeams.map((team) => team.id).includes(idToDisplay)) {
  $('#profiling').text('Add team to profile');
} else {
  $('#profiling').text('Remove team from profile');
}

$('#profiling').click(() => {
  const textInTag = $('#profiling').text();
  const object = {'id': idToDisplay, 'name': $('#clubName').text()};
  if (textInTag.localeCompare('Add team to profile') == 0) {
    $('#profiling').text('Remove team from profile');
    profile.favoriteTeams.push(object);
  } else {
    $('#profiling').text('Add team to profile');
    const index = profile.favoriteTeams.indexOf(object);
    profile.favoriteTeams.splice(index, 1);
  }
  fs.writeFile('./profile.json', JSON.stringify(profile), (err) => {
    if (err) {
      return console.log(err);
    }
    console.log('Profile updated');
  });
});
