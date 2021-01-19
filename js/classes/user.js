const fs = require('fs');
const path = require('path');

const profile = JSON.parse(function readProfile() {
  return fs.readFileSync(
      path.resolve(__dirname, ['..', 'profile.json'].join(path.sep)), 'utf-8')
      .trim();
}());

/**
  * Update the user profile.
  */
function updateProfile(){
  fs.writeFile('./profile.json', JSON.stringify(profile), (err) => {
    if (err) {
      return console.log(err);
    }
    console.log('Profile updated');
  });
}

/**
  * Contains all informations about the user.
  */
function User(){}

/**
  * Get favorites teams and leagues as text.
  *
  * @return {array} an array of strings of the favorites leagues and teams of
  * the user
  */
User.getFavoritesText = function(){
  return profile.favoriteTeams.concat(profile.favoriteLeagues).map(
    (element) => element.name
  );
}

/**
  * Get the information about whether the league is in the profile or not.
  *
  *
  * @param {int} league id - the id of the league to verify
  *
  * @return {boolean} true if the league id is in the profile, false otherwise
  */
User.isLeagueIdInProfile = function(leagueId) {
  const savedLeagues = profile.favoriteLeagues;
  if (savedLeagues == undefined || savedLeagues == null) {
    profile.favoriteLeagues = new Array();
    return false;
  } else if (savedLeagues.map((league) => league.id).includes(leagueId)) {
    return true;
  } else {
    return false;
  }
}

/**
* Get the information about whether the league is in the profile or not.
*
*
* @param {int} league id - the id of the league to verify
*
* @return {string} add the league if is not in profile, remove otherwise
*/
User.getActionAssociatedWithLeagueId = function(leagueId) {
  if(User.isLeagueIdInProfile(leagueId)){
    return 'Remove league from profile';
  } else {
    return 'Add league to profile';
  }
}

/**
* Add the league to the profile.
*
*
* @param {league} league - the league to add
*/
User.addLeague = function(league) {
  profile.favoriteLeagues.push(league.toShortJSON());
  updateProfile(profile)
}

/**
* Remove the league from the profile.
*
*
* @param {league} league - the league to remove
*/
User.removeLeague = function(league){
  const index = profile.favoriteLeagues.indexOf(league.toShortJSON());
  profile.favoriteLeagues.splice(index, 1);
  updateProfile(profile)
}

export {User}
