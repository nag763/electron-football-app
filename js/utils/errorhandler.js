const fs = require('fs');
const path = require('path');

const key = function readApiKey() {
  return fs.readFileSync(
      path.resolve(__dirname, ['..', 'api.key'].join(path.sep)), 'utf-8')
      .trim();
}();

/** Class to handle common errors when using the app **/
function ErrorHandler() {}


/**
 * Class to handle common errors while using the app.
 *
 * @param  {object} error - the current axios error.
 * @param {boolean} canBeEmtpy - define if the fetched content can be empty or not
 */
ErrorHandler.onResponse = function(error, canBeEmtpy=false) {
  if (!navigator.onLine) {
    alert('You aren\'t connected to internet');
  } else if (key.length == 0) {
    alert('You don\'t have any api key registered, please make sure you got one.');
  } else if (error != undefined && error != null && !canBeEmtpy) {
    alert('The remote server responded with the following error\n'
        .concat(`${error}.\n`)
        .concat('If the issue persists, starts the debugger (CTRL+SHIFT+I) or open an issue on Github.'));
  }
};

export {
  ErrorHandler,
};
