function generateHTMLtd(data) {
  return `<td>${data}</td>`;
}

function generateHTMLtr(dataList) {
  // We have to concat, which is prefered over escaping the bakslash
  return `<tr>
              ${dataList.map((element) => generateHTMLtd(element)).join('\n')}`
      .concat(`</tr>`);
}

function generateHTMLtable(headers, datas) {
  return `<table>
            <tr>
            ${headers.map((element) => `<th>${element}</th>`).join('\n')}
            </tr>
            <tbody>
            ${datas.map((element) => generateHTMLtr(element)).join('\n')}
            </tbody>
            </table>`;
}

export {generateHTMLtr, generateHTMLtd, generateHTMLtable};
