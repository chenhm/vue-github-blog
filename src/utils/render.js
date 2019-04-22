import marked from 'marked'
// import Prism from 'prismjs'
import Prism from '../../external/prism'
import conf from '../config'

const tocHTML = (toc) => {
  let levelStack = []
  let result = ''
  const addStartUL = (level) => { result += '<ul class="sectlevel' + level + '">' }
  const addEndUL = () => { result += '</ul>\n' }
  const addLI = (anchor, text, level) => {
    result += '<li class="toc-li-' + level + '"><a href="#' + anchor + '">' + text + '</a></li>\n'
  }

  toc.forEach(item => {
    let levelIndex = levelStack.indexOf(item.level)
    if (levelIndex === -1) { // 没有找到相应level的ul标签，则将li放入新增的ul中
      levelStack.unshift(item.level)
      addStartUL(item.level - 1)
      addLI(item.anchor, item.text, item.level)
    } else if (levelIndex === 0) { // 找到了相应level的ul标签，并且在栈顶的位置则直接将li放在此ul下
      addLI(item.anchor, item.text, item.level)
    } else { // 找到了相应level的ul标签，但是不在栈顶位置，需要将之前的所有level出栈并且打上闭合标签，最后新增li
      while (levelIndex--) {
        levelStack.shift()
        addEndUL()
      }
      addLI(item.anchor, item.text, item.level)
    }
  })
  // 如果栈中还有level，全部出栈打上闭合标签
  while (levelStack.length) {
    levelStack.shift()
    addEndUL()
  }
  // console.log(result)
  return result ? '<div id="toc" class="toc md"><div id="toctitle">Table of Contents</div>' + result + '</div>' : ''
}

// https://github.com/chjj/marked#overriding-renderer-methods
const renderer = new marked.Renderer()

/**
 * highlight my code
 *
 * @override
 * @param {any} code
 * @param {any} lang
 * @returns
 */
renderer.code = (code, lang) => {
  const highlight = Prism.highlight(code, Prism.languages[lang] || Prism.languages.javascript)
  return `<pre><code class="lang-${escape(lang, true)}">${highlight}</code></pre>`
}

const imageRender = renderer.image.bind(renderer)
renderer.image = function (href, title, text) {
  if (!/^http(s)?:\/\//.test(href)) {
    href = `https://raw.githubusercontent.com/${conf.repo}/${conf.branch}/${conf.path}/${href}`
    if (href.endsWith('.svg')) {
      href += '?sanitize=true'
    }
  }
  return imageRender(href, title, text)
}

marked.setOptions({
  renderer,
  breaks: true,
  gfm: true
})

export default (md) => {
  var toc = []
  renderer.heading = (text, level, raw, slugger) => {
    const anchor = text.replace(/<(?:.|\n)*?>/gm, '').toLowerCase().replace(/[\s\n\t]+/g, '-')
    if (level > 1) {
      toc.push({anchor, level, text})
    }
    return `<h${level} id="${anchor}" class="md">${text}</h${level}>`
  }
  let html = marked(md)
  return tocHTML(toc) + html
}
