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
