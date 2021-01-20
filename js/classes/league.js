import {generateHTMLtable, generateClickableWithImage, generateClickableText}
  from '../utils/htmlutils.js';

/** League object used to modelize the league infos. **/
function League() {}

/**
  * Returns a league from a response.
  *
  * @param {json} response - response object from the given endpoint.
  *
  * @return {league} the league gotten from the response
  */
League.fromResponse = function(response) {
  const data = response.data.api.leagues[0];
  const league = new League();
  league.id = data.league_id;
  league.country = data.country;
  league.name = data.name;
  league.type = data.type;
  league.logo = data.logo;
  return league;
};

/**
  * Set the tables of the league from the response
  *
  * @param {json} response - response object from the given endpoint.
  */
League.prototype.setTablesFromResponse = function(response) {
  this.tables = new Array();
  response.data.api.standings.forEach((standing) => this.tables.push(standing));
};

/**
  * Set the rounds of the league from the response
  *
  * @param {json} response - response object from the given endpoint.
  */
League.prototype.settRoundsFromResponse = function(response) {
  this.rounds = new Array();
  response.data.api.fixtures.forEach((round) => this.rounds.push(round));
};

/**
  * Generate the html table for each element in the tables of the league.
  *
  * @return {string} the html tables
  */
League.prototype.generateHTMLTablesForStandings = function() {
  const rankingHeadersTable = ['Rank', 'Team', 'Point', 'MP', 'Wins',
    'Draw', 'Lose', 'GF', 'GA', 'Difference'];
  return this.tables.map((table) => {
    const htmlTD = table.map((team) => {
      const htmlTR = new Array();
      htmlTR.push(team.rank);
      htmlTR.push(generateClickableWithImage(`./team.html?id=${team.id}`, team.logo, team.teamName));
      htmlTR.push(team.points);
      htmlTR.push(team.all.matchsPlayed);
      htmlTR.push(team.all.win);
      htmlTR.push(team.all.draw);
      htmlTR.push(team.all.lose);
      htmlTR.push(team.all.goalsFor);
      htmlTR.push(team.all.goalsAgainst);
      htmlTR.push((team.all.goalsFor - team.all.goalsAgainst));
      return htmlTR;
    });
    return generateHTMLtable(rankingHeadersTable, htmlTD);
  });
};

/**
  * Generate html list for each round.
  *
  * @return {string} the corresponding html to display for each round.
  */
League.prototype.generateHTMLForRounds = function(response) {
  return this.rounds.map((round, index) =>
    `<li class='list-group-item'>
    ${generateClickableText(`./fixtures.html?league=${this.id}&fixture=${round}&mdnumber=${index+1}`,
      `Match day ${index+1}`)}
    </li>
    `,
  ).join('\n');
};


/**
  * Returns the description from the league.
  *
  * @return {string} the league type and the associed country
  */
League.prototype.getDescription = function() {
  return `${this.type} played in ${this.country}`;
};

/**
  * Get full name of the league.
  *
  * @return {string} the league country and league name
  */
League.prototype.getFullName = function() {
  return `${this.country}, ${this.name}`;
};


/**
* Get the league as a short json.
*
* @return {json} the league id and league full name
*/
League.prototype.toShortJSON = function() {
  return {'id': this.id, 'name': this.getFullName()};
};

export {League};
