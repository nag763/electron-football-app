const querystring = require('querystring');
const $ = require('jquery');


const query = querystring.parse(global.location.search);
const idToDisplay = JSON.parse(query['?id']);

import {generateGetRequest} from './utils/httputils.js';

import {generateHTMLtr} from './utils/htmlutils.js';

let statsAvailable;

generateGetRequest(`players/player/${idToDisplay}`).then(response => {
  statsAvailable = response.data.api.players.sort((a, b) => (-a.season.localeCompare(b.season)));
  const playerInfo = statsAvailable[0];
  $('#playerName').text(`${playerInfo.firstname} ${playerInfo.lastname}`)
  $('#desc').text(`
    ${playerInfo.firstname} ${playerInfo.lastname} is a ${playerInfo.age} years old player of ${playerInfo.team_name} who also represent ${playerInfo.nationality}.
    His position on the field is ${playerInfo.position}, his height is ${playerInfo.height} and his weight is ${playerInfo.weight}.
     He is borned in ${playerInfo.birth_place} (${playerInfo.birth_country}) on the ${playerInfo.birth_date}.
    `)
  displayStats(statsAvailable[0])
  statsAvailable.forEach((element, index) => {
    $('#select').append(`<option value="${index}">${element.league}, ${element.team_name} ${element.season}</option>`)
  })
})

function displayStats(stats){
  $('#games tr, #substitutes tr, #cards tr, #goals tr, #passes tr, #shots tr, #penalties tr, #dribbles tr, #duels tr, #tackles tr, #fouls tr').remove()
  $('#statsdesc').text('').append(` <a href='./league.html?id=${stats.league_id}'>${stats.league}</a>, <a href='./team.html?id=${stats.team_id}'>${stats.team_name} ${stats.season}</a>, rated ${stats.rating}`)
  $('#games').append(generateHTMLtr([stats.games.appearences, stats.games.minutes_played, stats.games.lineups, stats.captain]))
  $('#substitutes').append(generateHTMLtr([stats.substitutes.in, stats.substitutes.out, stats.substitutes.bench]))
  $('#cards').append(generateHTMLtr([stats.cards.yellow, stats.cards.yellowred, stats.cards.red]))
  $('#goals').append(generateHTMLtr([stats.goals.total, stats.goals.conceded, stats.goals.assists, stats.goals.saves]))
  $('#passes').append(generateHTMLtr([stats.passes.total, stats.passes.key, stats.passes.accuracy]))
  $('#shots').append(generateHTMLtr([stats.shots.total, stats.shots.on]))
  $('#penalties').append(generateHTMLtr([stats.penalty.won, stats.penalty.commited, stats.penalty.success, stats.penalty.missed, stats.penalty.saved]))
  $('#dribbles').append(generateHTMLtr([stats.dribbles.attempts, stats.dribbles.success]))
  $('#duels').append(generateHTMLtr([stats.duels.total, stats.duels.won]))
  $('#tackles').append(generateHTMLtr([stats.tackles.total, stats.tackles.blocks, stats.tackles.interceptions]))
  $('#fouls').append(generateHTMLtr([stats.fouls.drawn, stats.fouls.committed]))
}

$('#select').change(function(){
  displayStats(statsAvailable[$('#select').val()])
})
