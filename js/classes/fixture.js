const dateFormat = require('dateformat');

import {
  generateClickableWithImage,
  generateClickableText,
} from '../utils/htmlutils.js';

const isDefined = (value) => value === undefined || value === null;

/**
  * Class Constructor.
  *
  */
function Fixture() {}

/**
  * Print the league as a precise info.
  *
  * @return {string} The league with its associed country
  */
Fixture.prototype.preciseLeague = function() {
  return `${this.country}, ${this.league}`;
};

/**
  * Print the full score of a match.
  *
  * @return {string} N/A if the goal numbers are undefined, otherwise the score
  */
Fixture.prototype.fullscore = function() {
  if ([this.goalsHomeTeam, this.goalsAwayTeam].every(isDefined)) {
    return 'N/A';
  } else {
    return `${this.goalsHomeTeam}-${this.goalsAwayTeam}`;
  }
};

/**
  * Print the event date as a easily understandable string for the user.
  *
  * @return {string} the time of the match if known
  */
Fixture.prototype.eventHourTime = function() {
  if (isDefined(this.eventDate)) {
    return dateFormat(this.eventDate, 'HH:MM - dd/mm');
  } else {
    return 'Unknown';
  }
};

/**
  * Returns the content of the fixture as a html table element.
  *
  * @return {array} an array of html elements to be inserted in a table
  */
Fixture.prototype.toTableData = function() {
  const tableData = new Array();
  if ([this.leagueId, this.leagueLogo].every(isDefined)) {
    tableData.push(this.preciseLeague());
  } else {
    tableData.push(
        generateClickableWithImage(`./league.html?id=${this.leagueId}`,
            this.leagueLogo,
            this.preciseLeague()),
    );
  }
  if ([this.homeTeamId, this.homeTeamLogo].every(isDefined)) {
    tableData.push(this.preciseLeague());
  } else {
    tableData.push(
        generateClickableWithImage(`./team.html?id=${this.homeTeamId}`,
            this.homeTeamLogo,
            this.homeTeamName),
    );
  }
  if ([this.awayTeamId, this.awayTeamLogo].every(isDefined)) {
    tableData.push(this.preciseLeague());
  } else {
    tableData.push(
        generateClickableWithImage(`./team.html?id=${this.awayTeamId}`,
            this.awayTeamLogo,
            this.awayTeamName),
    );
  }
  tableData.push(this.fullscore());
  tableData.push(this.eventHourTime());
  tableData.push(this.elapsedTime);
  tableData.push(this.status);
  tableData.push(
      generateClickableText(
          `./match.html?id=${this.fixtureId}`,
          'More informations'),
  );
  return tableData;
};

export {Fixture};
