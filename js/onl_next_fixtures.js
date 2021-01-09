const dateFormat = require('dateformat');
const path = require('path');
const $ = require('jquery');

import {generateHTMLtr, generateHTMLtd} from './utils/htmlutils.js';
import {generateGetRequest} from './utils/httputils.js';
import {Fixture} from './classes/fixture.js';

const dateDisplayed = new Date();

function displayFixtures(date) {
  const url = `fixtures/date/${dateFormat(dateDisplayed, 'yyyy-mm-dd')}`;

  $('#title').text(`Matchs being played on  ${dateFormat(dateDisplayed, 'dddd dd/mm/yyyy')}`);

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
}

displayFixtures(dateDisplayed);

$('#go_back').click( () => {
  $(location).attr('href', './menu.html');
});

$('#next').click( () => {
  $('#fixtures').empty();
  dateDisplayed.setDate(dateDisplayed.getDate() + 1);
  displayFixtures(dateDisplayed);
});

$('#previous').click( () => {
  $('#fixtures').empty();
  dateDisplayed.setDate(dateDisplayed.getDate() + - 1);
  displayFixtures(dateDisplayed);
});

// Not mine, taken directly from w3s
$('#searchBar').on('keyup', function() {
  const value = $(this).val().toLowerCase();
  $('#fixtures tr').filter(function() {
    $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
  });
});
