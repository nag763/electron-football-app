const fs = require('fs');
const http = require('https');
const path = require('path');

const key = function readApiKey() {
  return fs.readFileSync(
      path.resolve(__dirname, ['..', '..', 'api.key'].join(path.sep)), 'utf-8')
      .trim();
}();

async function generateGetRequest(path) {
  const axios = require('axios').default;

  const url = 'https://api-football-v1.p.rapidapi.com/v2/'.concat(path);

  const options = {
    method: 'GET',
    url: url,
    params: {timezone: 'Europe/Paris'},
    headers: {
      'x-rapidapi-key': key,
      'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
    },
  };

  return axios.request(options).then(function(response) {
  	return response;
  }).catch(function(error) {
  	console.error(error);
    return response;
  });
}

export {generateGetRequest};
