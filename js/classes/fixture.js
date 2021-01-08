const dateFormat = require('dateformat');

function Fixture(country, league, homeTeamName, awayTeamName, goalsHomeTeam, goalsAwayTeam, eventDate, elapsedTime, status){
  this.country = country;
  this.league = league;
  this.homeTeamName = homeTeamName;
  this.awayTeamName = awayTeamName;
  this.goalsHomeTeam = goalsHomeTeam;
  this.goalsAwayTeam = goalsAwayTeam;
  this.eventDate = eventDate;
  this.elapsedTime = elapsedTime;
  this.status = status;
}

Fixture.prototype.preciseLeague = function(){
  return `${this.country} ${this.league}`;
}

Fixture.prototype.fullscore = function(){
  if([this.goalsHomeTeam, this.goalsAwayTeam].some(element => null == element)){
    return "N/A";
  } else {
    return `${this.goalsHomeTeam}-${this.goalsAwayTeam}`;
  }
}

Fixture.prototype.eventHourTime = function(){
  dateFormat(this.eventDate, "HH:MM")
}

Fixture.prototype.toTableData = function() {
  let tableData = new Array();
  tableData.push(this.preciseLeague());
  tableData.push(this.homeTeamName);
  tableData.push(this.awayTeamName);
  tableData.push(this.fullscore());
  tableData.push(this.eventHourTime());
  tableData.push(this.elapsedTime);
  tableData.push(this.status);
  return tableData;
}

export {Fixture};
