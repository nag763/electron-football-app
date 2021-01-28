const QUERY_STRING = require('querystring');
const $ = require('jquery');

import {generateGetRequest} from './utils/httputils.js';
import {Team} from './classes/team.js';
import {User} from './classes/user.js';


const QUERY = QUERY_STRING.parse(global.location.search);
const ID_TO_DISPLAY = JSON.parse(QUERY['?id']);
const URL_FOR_TEAM = `teams/team/${ID_TO_DISPLAY}`;
const URL_LATEST_FIXTURES = `fixtures/team/${ID_TO_DISPLAY}/last/5`;
const URL_NEXT_FIXTURES = `fixtures/team/${ID_TO_DISPLAY}/next/5`;

let team = new Team();

/**
* Display the squad for the given date.
*
* @param {string} date - date as form '2000-2001' or '2000'
*
*/
function displaySquad(date) {
  generateGetRequest(`players/squad/${ID_TO_DISPLAY}/${date}`).then((response) => {
    if (response.data.api.results == 0) {
      // Date like 2020
      if (date.length == 4) {
        displaySquad(`${parseInt(date)-1}-${date}`);
        // Date like 2020-2021
      } else if (date.length == 9) {
        displaySquad(date.substring(0, 4));
      }
    } else {
      team.setSquad(response);
      $('#squad').append(team.getSquadAsTr().join('\n'));
    }
  });
}

generateGetRequest(URL_FOR_TEAM).then((response) => {
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
}).catch((error) => {
  if (!navigator.onLine) {
    alert('You aren\'t connected to internet');
  }
});

generateGetRequest(URL_LATEST_FIXTURES).then((response) => {
  const table = $('#latestFixtures');
  team.setLatestFixtures(response);
  table.append(
      team.getLatestFixturesAsHTML().join('\n'),
  );
});

generateGetRequest(URL_NEXT_FIXTURES).then((response) => {
  const table = $('#nextFixtures');
  team.setNextFixtures(response);
  table.append(team.getNextFixturesAsHTML().join('\n'));
});


displaySquad(`${new Date().getFullYear()-1}-${new Date().getFullYear()}`);
