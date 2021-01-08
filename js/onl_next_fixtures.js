const http = require("https");
const dateFormat = require('dateformat');
const app = require('electron').app
const fs = require('fs');
const path = require("path");
const $ = require('jquery');


let key = function readApiKey(){
  return fs
    .readFileSync(path.resolve(__dirname, ['..','..','api.key'].join(path.sep)), 'utf-8').trim();
}()


const options = {
	"method": "GET",
	"hostname": "api-football-v1.p.rapidapi.com",
	"port": null,
  // The date format required is of type 2010-01-31
	"path": `/v2/fixtures/date/${dateFormat(new Date(), "yyyy-mm-dd")}?timezone=Europe%2FParis`,
	"headers": {
		"x-rapidapi-key": key,
		"x-rapidapi-host": "api-football-v1.p.rapidapi.com",
		"useQueryString": true
	}
};

function generateHTMLtd(data){
  return `<td>${data}</td>`;
}

function generateHTMLtr(dataList){
  // We have to concat, which is prefered over escaping the bakslash
  return `<tr>${dataList.map(element => generateHTMLtd(element)).join('\n')}`.concat(`</tr>`);
}

function displayScore(homeTeam, awayTeam){
    if([homeTeam, awayTeam].some(element => null == element)){
      return " - ";
    } else {
      return `${homeTeam}-${awayTeam}`;
    }
}

const req = http.request(options, function (res) {
	const chunks = [];

	res.on("data", function (chunk) {
		chunks.push(chunk);
	});

	res.on("end", function () {
		res.body = Buffer.concat(chunks);
    const jsonBody = JSON.parse(res.body.toString())
    // The array is already sorted by default in function of the timestamp, no
    // need to sort it a second time
    Array.from(jsonBody.api.fixtures).forEach(element =>
      $("#fixtures").append(generateHTMLtr([`${element.league.country} ${element.league.name}`, element.homeTeam.team_name, element.awayTeam.team_name, displayScore(element.goalsHomeTeam, element.goalsAwayTeam), dateFormat(element.event_date, "HH:MM"), element.elapsed, element.status]))
    );
	});
});

req.end();
