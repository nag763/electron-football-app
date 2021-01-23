/**
 * Lineup object used to modelize the teams lineups.
 */
function Lineup() {}

import {generateClickableText, generateHTMLtr} from '../utils/htmlutils.js';

/**
  * Set players info for given data.
  *
  * @param {object} data - data from response
  *
  * @return {object} a player object.
  */
function setPlayersInfo(data) {
  return {
    'id': data.player_id,
    'number': data.number,
    'name': data.player,
  };
}

/**
  * Generate an html TD for the given players.
  *
  * @param {object} player1 - the first player to display
  * @param {object} player2 - the second player to display
  *
  * @return {string} the content as a html tr with clickable elements.
  */
function generateTDForPlayers(player1, player2) {
  /**
   * Make a player clickable
   *
   * @param  {int} id - id of the player
   * @return {string} the href to the player.
   */
  function clickablePlayer(id) {
    return `./player.html?id=${id}`;
  }
  return [
    generateClickableText(clickablePlayer(player1.id), `(${player1.number}) ${player1.name}`),
    generateClickableText(clickablePlayer(player2.id), `(${player2.number}) ${player2.name}`),
  ];
}

/**
  * Generates the lineups from the given response.
  *
  * @param {object} response - the given response.
  *
  * @return {object} returns the line up object.
  */
Lineup.fromResponse = function(response) {
  const lineup = new Lineup();
  const teams = response.data.api.lineUps;
  const keys = Object.keys(teams);
  const homeTeamLineUp = teams[keys[0]];
  const awayTeamLineUp = teams[keys[1]];
  lineup.homeTeamName = keys[0];
  lineup.homeTeamId = homeTeamLineUp['startXI'][0].team_id;
  lineup.homeTeamCoach = homeTeamLineUp.coach;
  lineup.homeTeamPlayers = homeTeamLineUp['startXI'].map(setPlayersInfo);
  lineup.homeTeamBench = homeTeamLineUp['substitutes'].map(setPlayersInfo);

  lineup.awayTeamName = keys[1];
  lineup.awayTeamId = awayTeamLineUp['startXI'][0].team_id;
  lineup.awayTeamCoach = awayTeamLineUp.coach;
  lineup.awayTeamPlayers = awayTeamLineUp['startXI'].map(setPlayersInfo);
  lineup.awayTeamBench = awayTeamLineUp['substitutes'].map(setPlayersInfo);
  return lineup;
};

/**
  * Generates the html title containing the names of the teams.
  *
  * @return {string} clickable html.
  */
Lineup.prototype.generateHTMLTitle = function() {
  return `
  ${generateClickableText(`./team.html?id=${this.homeTeamId}`, this.homeTeamName)}
   -
  ${generateClickableText(`./team.html?id=${this.awayTeamId}`, this.awayTeamName)}
  `;
};

/**
  * Generates the starting xi as html content.
  *
  * @return {string} the startings xi in table rows.
  */
Lineup.prototype.generateHTMLStartingXITR = function() {
  const table = [];
  const NUMBER_OF_PLAYERS = 11;
  for (let i=0; i<NUMBER_OF_PLAYERS; i++) {
    table.push(
        generateHTMLtr(
            generateTDForPlayers(this.homeTeamPlayers[i], this.awayTeamPlayers[i])),
    );
  }
  return table.join('\n');
};

/**
  * Generates the benchs as html content.
  *
  * @return {string} the startings xi in table rows.
  */
Lineup.prototype.generateHTMLBenchTR = function() {
  const table = [];
  // TODO : Find a way to have the max (all) and not the min.
  const NUMBER_OF_SUBS = Math.min(this.homeTeamBench.length, this.awayTeamBench.length);
  for (let i=0; i<NUMBER_OF_SUBS; i++) {
    table.push(
        generateHTMLtr(
            generateTDForPlayers(this.homeTeamBench[i], this.awayTeamBench[i])),
    );
  }
  return table.join('\n');
};

export {Lineup};
