function Stat() {}

import {
  generateClickableText,
  generateHTMLtr,
} from '../utils/htmlutils.js';

Stat.prototype.getStatInfo = function() {
  return `
  ${generateClickableText(`./league.html?id=${this.leagueId}`, this.league)}
  , ${generateClickableText(`./team.html?id=${this.teamId}`, `${this.teamName} ${this.season}`)}
  , rated ${this.rating} /10`;
};

Stat.createFromResponseArray = function(response) {
  return response.map((element) => {
    const stat = new Stat();

    stat.teamName = element.team_name;
    stat.teamId = element.team_id;
    stat.league = element.league;
    stat.leagueId = element.league_id;
    stat.rating = element.rating;
    stat.season = element.season;


    stat.appearances = element.games.appearences;
    stat.minutesPlayed = element.games.minutes_played;
    stat.lineUps = element.games.lineups;
    stat.captain = element.captain;

    stat.subin = element.substitutes.in;
    stat.subout = element.substitutes.out;
    stat.benched = element.substitutes.bench;

    stat.yellow = element.cards.yellow;
    stat.yellowred = element.cards.yellowred;
    stat.red = element.cards.red;

    stat.goalTotal = element.goals.total;
    stat.goalConceded = element.goals.conceded;
    stat.assists = element.goals.assists;
    stat.saves = element.goals.saves;

    stat.assistTotal = element.passes.total;
    stat.keyPasses = element.passes.key;
    stat.passAccuracy = element.passes.accuracy;

    stat.shotTotal = element.shots.total;
    stat.shotOT = element.shots.on;

    stat.penWons = element.penalty.won;
    stat.penCommited = element.penalty.commited;
    stat.penSuccessRate = element.penalty.success;
    stat.penMissed = element.penalty.missed;
    stat.penSaved = element.penalty.saved;
    stat.dribblesAttempt = element.dribbles.attempts;
    stat.dribblesWon = element.dribbles.success;
    stat.duelsTotal = element.duels.total;
    stat.duelsWon = element.duels.won;
    stat.tacklesTotal = element.tackles.total;
    stat.tacklesBlock = element.tackles.blocks;
    stat.tacklesInterception = element.tackles.interceptions;
    stat.foulsGranted = element.fouls.drawn;
    stat.foulsConceded = element.fouls.committed;
    return stat;
  });
};

Stat.prototype.getGamesPlayedStatsAsTR = function() {
  return generateHTMLtr(
      [this.appearances, this.minutesPlayed, this.lineUps, this.captain],
  );
};

Stat.prototype.getSubsAsTR = function() {
  return generateHTMLtr([this.subin, this.subout, this.benched]);
};

Stat.prototype.getCardsAsTR = function() {
  return generateHTMLtr([this.yellow, this.yellowred, this.red]);
};

Stat.prototype.getInvolvementsAsTR = function() {
  return generateHTMLtr(
      [this.goalTotal, this.goalConceded, this.assists, this.saves],
  );
};

Stat.prototype.getPassesAsTR = function() {
  return generateHTMLtr([this.assistTotal, this.keyPasses, this.passAccuracy]);
};

Stat.prototype.getShotsAsTR = function() {
  return generateHTMLtr([this.shotTotal, this.shotOT]);
};

Stat.prototype.getPensAsTR = function() {
  return generateHTMLtr(
      [this.penWons, this.penCommited, this.penSuccessRate, this.penMissed, this.penSaved],
  );
};

Stat.prototype.getDribblesAsTR = function() {
  return generateHTMLtr([this.dribblesAttempt, this.dribblesWon]);
};

Stat.prototype.getDuelsAsTR = function() {
  return generateHTMLtr([this.duelsTotal, this.duelsWon]);
};

Stat.prototype.getTacklesAsTR = function() {
  return generateHTMLtr(
      [this.tacklesTotal, this.tacklesBlock, this.tacklesInterception],
  );
};

Stat.prototype.getFoulsAsTR = function() {
  return generateHTMLtr([this.foulsGranted, this.foulsConceded]);
};

export {Stat};
