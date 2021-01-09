const dateFormat = require('dateformat');

function Fixture(country, league, leagueId, homeTeamName, homeTeamId, awayTeamName, awayTeamId, goalsHomeTeam, goalsAwayTeam, eventDate, elapsedTime, status) {
  this.country = country;
  this.league = league;
  this.leagueId = leagueId;
  this.homeTeamName = homeTeamName;
  this.homeTeamId = homeTeamId;
  this.awayTeamName = awayTeamName;
  this.awayTeamId = awayTeamId;
  this.goalsHomeTeam = goalsHomeTeam;
  this.goalsAwayTeam = goalsAwayTeam;
  this.eventDate = eventDate;
  this.elapsedTime = elapsedTime;
  this.status = status;
}

Fixture.prototype.preciseLeague = function() {
  return `${this.country}, ${this.league}`;
};

Fixture.prototype.fullscore = function() {
  if ([this.goalsHomeTeam, this.goalsAwayTeam].some((element) => null == element)) {
    return 'N/A';
  } else {
    return `${this.goalsHomeTeam}-${this.goalsAwayTeam}`;
  }
};

Fixture.prototype.eventHourTime = function() {
  return dateFormat(this.eventDate, 'HH:MM - dd/mm');
};

Fixture.prototype.toTableData = function() {
  const tableData = new Array();
  if (this.leagueId == undefined) {
    tableData.push(this.preciseLeague());
  } else {
    tableData.push(`<a href='./onl_league.html?id=${this.leagueId}'>${this.preciseLeague()}</a>`);
  }
  if (this.homeTeamId == undefined) {
    tableData.push(this.homeTeamName);
  } else {
    tableData.push(`<a href='./onl_team.html?id=${this.homeTeamId}'>${this.homeTeamName}</a>`);
  }
  if (this.awayTeamId == undefined) {
    tableData.push(this.awayTeamName);
  } else {
    tableData.push(`<a href='./onl_team.html?id=${this.awayTeamId}'>${this.awayTeamName}</a>`);
  }
  tableData.push(this.fullscore());
  tableData.push(this.eventHourTime());
  tableData.push(this.elapsedTime);
  tableData.push(this.status);
  return tableData;
};

export {Fixture};
