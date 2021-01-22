import {
  generateClickableText,
  generateOption,
} from '../utils/htmlutils.js';

import {Stat} from './stat.js';

function getShortStatDesc(resStat) {
  return `${resStat.league}, ${resStat.team_name} ${resStat.season}`;
}

function getFullStatDesc(resStat) {
  return `${generateClickableText(`./league.html?id=${resStat.league_id}`, resStat.league)},
   ${generateClickableText(`./team.html?id=${resStat.team_id}`, resStat.season)},
   rated ${resStat.rating}`;
}

function Player() {}

Player.prototype.getBio = function() {
  return `
  ${this.getFullName()} is a ${this.age} years old player of ${this.teamName} who also represent ${this.nationality}.
  His position on the field is ${this.position}, his height is ${this.height} and his weight is ${this.weight}.
  He is borned in ${this.birthPlace} (${this.birthCountry}) on the ${this.birthDate}.
  `;
};

Player.prototype.getFullName = function() {
  return `${this.firstname} ${this.lastname}`;
};

Player.fromResponse = function(response) {
  // Sort by latest
  const PLAYER_INFO = response.data.api.players.sort(
      (a, b) => (-a.season.localeCompare(b.season)),
  );
  const CURRENT_INFO = PLAYER_INFO[0];
  const player = new Player();
  player.firstname = CURRENT_INFO.firstname;
  player.lastname = CURRENT_INFO.lastname;
  player.fullname = `${CURRENT_INFO.firstname} ${CURRENT_INFO.lastname}`;
  player.age = CURRENT_INFO.age;
  player.position = CURRENT_INFO.position;
  player.height = CURRENT_INFO.height;
  player.weight = CURRENT_INFO.weight;
  player.nationality = CURRENT_INFO.nationality;
  player.birthDate = CURRENT_INFO.birth_date;
  player.birthCountry = CURRENT_INFO.birth_country;
  player.birthPlace = CURRENT_INFO.birth_place;
  player.teamName = CURRENT_INFO.team_name;
  player.league = CURRENT_INFO.league;

  player.availableStats = PLAYER_INFO.map(
      (stat, index) => generateOption(index, getShortStatDesc(stat)),
  );
  player.statsDesc = PLAYER_INFO.map(
      (stat) => getFullStatDesc(stat),
  );
  player.stats = Stat.createFromResponseArray(PLAYER_INFO);
  return player;
};

export {
  Player,
};
