function generateHTMLtd(data) {
  return `<td>${data}</td>`;
}

function generateHTMLtr(dataList) {
  // We have to concat, which is prefered over escaping the bakslash
  return `<tr>
              ${dataList.map((element) => generateHTMLtd(element)).join('\n')}`
      .concat(`</tr>`);
}

export {generateHTMLtr, generateHTMLtd};
