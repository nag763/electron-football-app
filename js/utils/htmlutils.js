function generateHTMLtd(data) {
  return `<td>${data}</td>`;
}

function generateHTMLtr(dataList) {
  // We have to concat, which is prefered over escaping the bakslash
  return `<tr>${dataList.map((element) => generateHTMLtd(element)).join('\n')}`.concat(`</tr>`);
}

function displayScore(homeTeam, awayTeam) {
  if ([homeTeam, awayTeam].some((element) => null == element)) {
    return 'N/A';
  } else {
    return `${homeTeam}-${awayTeam}`;
  }
}

export {generateHTMLtr, generateHTMLtd, displayScore};
