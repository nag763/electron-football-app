/**
  * Generate a html td with the given input as text.
  *
  * @param {string} data - The data to insert between td tags.
  *
  * @return {string} html table data element
  */
function generateHTMLtd(data) {
  return `<td>${data}</td>`;
}

/**
  * Generate a html tr with the given input as text.
  *
  * @param {array} dataList - The dataList to inser between td tags inside
  * tr ones.
  *
  * @return {string} the html table row element with each element of the array
  * being between td tags
  */
function generateHTMLtr(dataList) {
  // We have to concat, which is prefered over escaping the bakslash
  return `<tr>
              ${dataList.map((element) => generateHTMLtd(element)).join('\n')}`
      .concat(`</tr>`);
}

/**
  * Generate a html table with the given header and data.
  *
  * @param {array} headers - Header list to insert in theader
  * @param {array} data - Data to insert in tbody
  *
  * @return {string} the appendable html element
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

/**
  * Generate a clickable html text element.
  *
  * @param {string} link - link to the ressource
  * @param {string} text - hyper text
  *
  * @return {string} hyperref html element
  */
function generateClickableText(link='#', text='') {
  return `<a href='${link}'>
            ${text}
          </a>`;
}

/**
  * Generate a clickable html element, with a picture.
  *
  * @param {string} link - link to the hyper ressource
  * @param {string} imagePath - path to the image to display
  * @param {string} text - text to display between tags
  *
  * @return {string} the html element as a string containing a picture
  */
function generateClickableWithImage(link='#', imagePath='', text='') {
  return `<a href='${link}'>
            <img src="${imagePath}" width=15 height=15/> ${text}
          </a>`;
}

/**
  * Generate an image with the given imagePath.
  *
  * @param {string} imagePath - image path
  *
  * @return {string} image as html element
  */
function generateImage(imagePath='#') {
  return `<img src="${imagePath}" width=15 height=15/>`;
}

/**
  * Generate a clickable list element.
  *
  * @param {string} link - link to the ressource
  * @param {string} text - hyper text
  *
  * @return {string} hyperref html element in li
  */
function generateClikableLi(link='#', text='') {
  return `
  <li class="list-group-item">
  ${generateClickableText(link, text)}
  </li>
  `;
}

/**
  * Generate an option text.
  *
  * @param {string} val - link to the ressource
  * @param {string} text - option's
  *
  * @return {string} option text
  */
function generateOption(val='', text='') {
  return `
  <option value='${val}'>
  ${text}
  </option>`;
}

export {
  generateHTMLtr,
  generateHTMLtd,
  generateHTMLtable,
  generateClickableWithImage,
  generateClickableText,
  generateImage,
  generateClikableLi,
  generateOption,
};
