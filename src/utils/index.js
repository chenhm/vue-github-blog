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

export function script (url) {
  if (Array.isArray(url)) {
    var self = this
    var prom = []
    url.forEach(function (item) {
      prom.push(self.script(item))
    })
    return Promise.all(prom)
  }

  return new Promise(function (resolve, reject) {
    var r = false
    var t = document.getElementsByTagName('script')[0]
    var s = document.createElement('script')

    s.type = 'text/javascript'
    s.src = url
    s.async = true
    s.onload = s.onreadystatechange = function () {
      if (!r && (!this.readyState || this.readyState === 'complete')) {
        r = true
        resolve(this)
      }
    }
    s.onerror = s.onabort = reject
    t.parentNode.insertBefore(s, t)
  })
}
