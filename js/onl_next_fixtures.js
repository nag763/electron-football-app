const dateFormat = require('dateformat');
const path = require('path');
const $ = require('jquery');

import {generateHTMLtr, generateHTMLtd, displayScore} from './utils/htmlutils.js';
import {generateGetRequest} from './utils/httputils.js';
import {Fixture} from './classes/fixture.js';

const url = `https://api-football-v1.p.rapidapi.com/v2/fixtures/date/${dateFormat(new Date(), 'yyyy-mm-dd')}`;

generateGetRequest(url).then((res) => {
  const jsonBody = res.data;
  Array.from(jsonBody.api.fixtures).forEach((element) => {
    const fixture = new Fixture();
    fixture.country = element.league.country;
    fixture.league = element.league.name;
    fixture.homeTeamName = element.homeTeam.team_name;
    fixture.awayTeamName = element.awayTeam.team_name;
    fixture.goalsHomeTeam = element.goalsHomeTeam;
    fixture.goalsAwayTeam = element.goalsAwayTeam;
    fixture.eventDate = element.event_date;
    fixture.elapsedTime = element.elapsed;
    fixture.status = element.status;
    // TODO : optimised ?
    $('#fixtures').append(generateHTMLtr(fixture.toTableData()));
  });
},
);

$('#go_back').click( () => {
  $(location).attr('href', './menu.html');
});

// Not mine, taken directly from w3s
$(document).ready(function() {
  $('#searchBar').on('keyup', function() {
    const value = $(this).val().toLowerCase();
    $('#fixtures tr').filter(function() {
      console.log($(this).text());
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});
