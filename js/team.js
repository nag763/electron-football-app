const querystring = require('querystring');
const $ = require('jquery');

import {generateGetRequest} from './utils/httputils.js';
import {generateHTMLtr} from './utils/htmlutils.js';
import {Fixture} from './classes/fixture.js';
import {Team} from './classes/team.js';
import {User} from './classes/user.js';


const query = querystring.parse(global.location.search);
const idToDisplay = JSON.parse(query['?id']);
const urlTeam = `teams/team/${idToDisplay}`;

let team = new Team();

generateGetRequest(urlTeam).then((response) => {
  const infosTable = $('#infos');
  team = Team.fromResponse(response);
  $('#title').text(team.name);
  $('#clubName').text(team.name);
  $('#logo').attr('src', team.logo);
  $('#desc').text(team.getDesc());

  $('#profiling').click(() => {
    if (User.isTeamIdInProfile(team.id)) {
      User.removeTeam(team);
    } else {
      User.addTeam(team);
    }
    $('#profiling').text(User.getActionAssociatedWithTeamId(team.id));
  }).text(User.getActionAssociatedWithTeamId(team.id));
});

const urlLatestFixtures = `fixtures/team/${idToDisplay}/last/5`;

generateGetRequest(urlLatestFixtures).then((response) => {
  const table = $('#latestFixtures');
  team.setLatestFixtures(response);
  table.append(
      team.getLatestFixturesAsHTML().join('\n'),
  );
});

const urlNextFixtures = `fixtures/team/${idToDisplay}/next/5`;

generateGetRequest(urlNextFixtures).then((response) => {
  const table = $('#nextFixtures');
  team.setNextFixtures(response);
  table.append(team.getNextFixturesAsHTML().join('\n'));
});

function displaySquad(date) {
  generateGetRequest(`players/squad/${idToDisplay}/${date}`).then((response) => {
    if (response.data.api.results =! 0) {
      team.setSquad(response);
      $('#squad').append(team.getSquadAsTr().join('\n'));
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

displaySquad(`${new Date().getFullYear()-1}-${new Date().getFullYear()}`);
