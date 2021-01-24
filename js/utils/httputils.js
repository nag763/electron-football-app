const fs = require('fs');
const path = require('path');
const axios = require('axios').default;

const key = function readApiKey() {
  return fs.readFileSync(
      path.resolve(__dirname, ['..', 'api.key'].join(path.sep)), 'utf-8')
      .trim();
}();

/**
 * Generate a get request to the remote server
 *
 * @param {string} path - The path to the remote server side
 *
 * @return {respones} a response element
 */
async function generateGetRequest(path) {
  const url = 'https://api-football-v1.p.rapidapi.com/v2/'.concat(path);

  const options = {
    method: 'GET',
    url: url,
    params: {
      timezone: 'Europe/Paris',
    },
    headers: {
      'x-rapidapi-key': key,
      'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
    },
  };

  return axios.request(options).then(function(response) {
    return response;
  }).catch(function(error) {
    throw Error(error);
  });
}

export {
  generateGetRequest,
};
