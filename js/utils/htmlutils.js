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
            <thead class="thead-dark" style="border-color: white">

            <tr>
            ${headers.map((element) => `<th style="border-color: #f3f4f5; border-width: 1px">${element}</th>`).join('\n')}
            </tr>
            </thead>
            <tbody style="background: #1a1a1a; color:#f3f4f5;">
            ${data.map((element) => generateHTMLtr(element)).join('\n')}
            </tbody>
            </table>`;
}

export {generateHTMLtr, generateHTMLtd, generateHTMLtable};
