function generateHTMLtd(data) {
  return `<td>${data}</td>`;
}

function generateHTMLtr(dataList) {
  // We have to concat, which is prefered over escaping the bakslash
  return `<tr>
              ${dataList.map((element) => generateHTMLtd(element)).join('\n')}`
      .concat(`</tr>`);
}

function generateHTMLtable(headers, data) {
  return `<table class="table  table-bordered">
            <thead class="thead-dark">

            <tr>
            ${headers.map((element) => `<th>${element}</th>`).join('\n')}
            </tr>
            </thead>
            <tbody>
            ${data.map((element) => generateHTMLtr(element)).join('\n')}
            </tbody>
            </table>`;
}

export {generateHTMLtr, generateHTMLtd, generateHTMLtable};
