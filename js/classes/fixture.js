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
    tableData.push(`<a href='./league.html?id=${this.leagueId}'><img src="${this.leagueLogo}" width=15 height=15/> ${this.preciseLeague()}</a>`);
  }
  if (this.homeTeamId == undefined) {
    tableData.push(this.homeTeamName);
  } else {
    tableData.push(`<a href='./team.html?id=${this.homeTeamId}'><img src="${this.homeTeamLogo}" width=15 height=15/> ${this.homeTeamName}</a>`);
  }
  if (this.awayTeamId == undefined) {
    tableData.push(this.awayTeamName);
  } else {
    tableData.push(`<a href='./team.html?id=${this.awayTeamId}'><img src="${this.awayTeamLogo}" width=15 height=15/> ${this.awayTeamName}</a>`);
  }
  tableData.push(this.fullscore());
  tableData.push(this.eventHourTime());
  tableData.push(this.elapsedTime);
  tableData.push(this.status);
  tableData.push(`<a href='./match.html?id=${this.fixtureId}'> More informations</a>`)
  return tableData;
};

export {Fixture};
