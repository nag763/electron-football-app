import {
  generateHTMLtr, generateClickableWithImage,
} from '../utils/htmlutils.js';
import {Fixture} from './fixture.js';
import {Player} from './player.js';

/**
  * An object to modelize a team.
  */
function Team() {}


/**
 * Create a team object from the given response.
 *
 * @param {type} response - response from the api.
 * @return {team} a team object.
 */
Team.fromResponse = function(response) {
  const TEAM_INFO = response.data.api.teams[0];
  const team = new Team();
  team.id = TEAM_INFO.team_id;
  team.name = TEAM_INFO.name;
  team.logo = TEAM_INFO.logo;
  team.founded = TEAM_INFO.founded;
  team.country = TEAM_INFO.country;
  team.venueName = TEAM_INFO.venue_name;
  team.venueCapacity = TEAM_INFO.venue_capacity;
  return team;
};


/**
 * Get description of the team.
 *
 * @return {string} description of the team.
 */
Team.prototype.getDesc = function() {
  return `
  Founded in ${this.founded}, ${this.name} is a club playing in ${this.country}.
  Its stadium, ${this.venueName}, has a capacity of ${this.venueCapacity} seats.
  `;
};

/**
 * Set the latest fixtures for the team.
 *
 * @param {object} response - the response from the api.
 */
Team.prototype.setLatestFixtures = function(response) {
  this.latestFixtures = Fixture.fromResponse(response);
};


/**
 * Get the latest fixtures as html tr.
 *
 * @return {array} returns the latest fixtures as html tr.
 */
Team.prototype.getLatestFixturesAsHTML = function() {
  return this.latestFixtures.map((fixture) =>
    generateHTMLtr(
        [
          fixture.eventHourTime(),
          generateClickableWithImage(`./team.html?id=${fixture.homeTeamId}`, fixture.homeTeamLogo, fixture.homeTeamName),
          generateClickableWithImage(`./team.html?id=${fixture.awayTeamId}`, fixture.awayTeamLogo, fixture.awayTeamName),
          fixture.fullscore(),
          generateClickableWithImage(`./league.html?id=${fixture.leagueId}`, fixture.leagueLogo, fixture.league),
        ],
    ),
  );
};

/**
* Set the next fixtures for the team.
*
* @param {object} response - the response from the api.
*/
Team.prototype.setNextFixtures = function(response) {
  this.nextFixtures = Fixture.fromResponse(response);
};


/**
 * Get the latest fixtures as html tr.
 *
 * @return {array} the next fixtures as an array of string.
 */
Team.prototype.getNextFixturesAsHTML = function() {
  return this.nextFixtures.map((fixture) =>
    generateHTMLtr(
        [
          fixture.eventHourTime(),
          generateClickableWithImage(`./team.html?id=${fixture.homeTeamId}`, fixture.homeTeamLogo, fixture.homeTeamName),
          generateClickableWithImage(`./team.html?id=${fixture.awayTeamId}`, fixture.awayTeamLogo, fixture.awayTeamName),
          generateClickableWithImage(`./league.html?id=${fixture.leagueId}`, fixture.leagueLogo, fixture.league),
        ],
    ),
  );
};

/**
* Set the squad for the team.
*
* @param {object} response - the response from the api.
*/
Team.prototype.setSquad = function(response) {
  this.squad = response.data.api.players.map((element) => {
    const player = new Player();
    player.id = element.player_id;
    player.picture = `https://media.api-sports.io/football/players/${player.id}.png`;
    player.fullname = `${element.firstname} ${element.lastname}`;
    player.position = element.position;
    player.nationality = element.nationality;
    player.age = element.age || 'Unknown';
    player.birthPlace = element.birth_place || 'Unknown';
    player.height = element.height || 'Unknown';
    player.weight = element.weight || 'Unknown';
    return player;
  }).sort(function(a, b) {
    return a.fullname.localeCompare(b.fullname);
  });
};


/**
 * Get the squad as html tr.
 *
 * @return {array} the squad as an array of html string.
 */
Team.prototype.getSquadAsTr = function() {
  return this.squad.map((player) =>
    generateHTMLtr(
        [
          generateClickableWithImage(`./player.html?id=${player.id}`, player.picture, player.fullname),
          player.position,
          player.nationality,
          player.age,
          player.birthPlace,
          player.height,
          player.weight,
        ],
    ),
  );
};

/**
* Get the team as a short json.
*
* @return {json} the team id and team name
*/
Team.prototype.toShortJSON = function() {
  return {'id': this.id, 'name': this.name};
};

export {Team};
