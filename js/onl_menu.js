const $ = require('jquery');

$('#home_page').click( () => {
  $(location).attr('href', '../index.html');
});

$('#next_fixtures').click( () => {
  $(location).attr('href', './next_fixtures.html');
});

console.log('Done');
