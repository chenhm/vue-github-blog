/**
 * get title from file name
 *
 * @export
 * @param {string} title
 * @returns {string}
 */
export function onlyTitle (title) {
  return title.replace(/\.(md|adoc)$/, '')
    .replace(/^\d{4}-\d{1,2}-\d{1,2}-/, '')
}

export function onlyID (title) {
  return title.replace(/\.(md|adoc)$/, '')
}

/**
 * get publish date from file name
 *
 * @export
 * @param {string} title
 * @returns {string}
 */
export function onlyDate (title) {
  return /^\d{4}-\d{1,2}-\d{1,2}/.exec(title)[0]
}
