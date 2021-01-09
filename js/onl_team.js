const querystring = require('querystring');
const $ = require('jquery');

import {generateGetRequest} from './utils/httputils.js';
import {generateHTMLtr} from './utils/htmlutils.js';

const query = querystring.parse(global.location.search);
const idToDisplay = JSON.parse(query['?id']);


const url = `teams/team/${idToDisplay}`;

generateGetRequest(url).then((response) => {
  const team = response.data.api.teams[0];
  const infosTable = $('#infos');

  $('#title').text(team.name);
  infosTable.append(generateHTMLtr(['Date fondation', team.founded]));
  infosTable.append(generateHTMLtr(['Pays', team.country]));
  infosTable.append(generateHTMLtr(['Logo', `<img src='${team.logo}'/>`]));
  infosTable.append(generateHTMLtr(['Stade', team.venue_name]));
  infosTable.append(generateHTMLtr(['Ville', team.venue_city]));
  infosTable.append(generateHTMLtr(['Capacité stade', team.venue_capacity]));
});

$('#go_back').click( () => {
  $(location).attr('href', './menu.html');
});
