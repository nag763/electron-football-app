/**
  * Generate a html td with the given input as text.
  *
  * @param {string} data - The data to insert between td tags.
  */
function generateHTMLtd(data) {
  return `<td>${data}</td>`;
}

/**
  * Generate a html tr with the given input as text.
  *
  * @param {array} dataList - The dataList to inser between td tags inside
  * tr ones.
  */
function generateHTMLtr(dataList) {
  // We have to concat, which is prefered over escaping the bakslash
  return `<tr>
              ${dataList.map((element) => generateHTMLtd(element)).join('\n')}`
      .concat(`</tr>`);
}

/**
  * Generate a html table with the given header and data
  *
  * @param {array} headers - Header list to insert in theader
  * @param {array} data - Data to insert in tbody
  */
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

function generateClickableText(link='#', text=''){
  return `<a href='${link}'>
            ${text}
          </a>`;
}

function generateClickableWithImage(link='#', imagePath='', text=''){
  return `<a href='${link}'>
            <img src="${imagePath}" width=15 height=15/> ${text}
          </a>`;
}

export {
  generateHTMLtr,
  generateHTMLtd,
  generateHTMLtable,
  generateClickableWithImage,
  generateClickableText
};
