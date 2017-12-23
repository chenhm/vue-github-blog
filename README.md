# vue-github-blog

[![GitHub release][github-release-image]][github-release-url]
[![JavaScript Style Guide][standardjs-image]][standardjs-url]
[![Travis][travis-image]][travis-url]
[![Dependency Status][daviddm-image]][daviddm-url]

✏️ A blog based on GitHub Pages built with Vue.js 2 + webpack 3.

一个依赖 GitHub Pages，无需本地生成的静态博客，使用了 Vue.js 2 组件开发，webpack 3 打包。

最近偏好使用Asciidoc写技术类文章，而GitHub Pages的Jekyll一直不支持Asciidoc插件，
于是受 https://github.com/viko16/vue-ghpages-blog 启发，在原项目上增加了对 Asciidoc 的支持，
并在易用性上做了些改进。


## Features

- Vue 2 / Vuex / Vue-router / axios
- webpack 3 / Babel 6 / Stylus
- No need to generate locally ( now using [TravisCI](https://travis-ci.org) )
- Hosting on GitHub Pages
- SessionStorage and localStorage cache
- Markdown and Asciidoc render
- Prism.js highlight

## Demo

http://chenhm.com

## Develop

**Note:** `src/config.js` points the configurations of my personal blog. **If you fork this repository, modify it first.**  😳

```bash
# Install dependencies
npm install
# Develop with hot reload
npm run dev
# Lint and Test
npm test
```

## About My Workflow
- All the posts are stored in [chenhm/posts](https://github.com/chenhm/chenhm.github.com/tree/master/posts), while [`src/config.js`](src/config.js) points it.
- When I push the code to `develop` branch, [TravisCI](.travis.yml) will deploy `gh-pages` automatically.

## License

MIT © [chenhm](https://github.com/chenhm)


[github-release-image]: https://img.shields.io/github/release/chenhm/vue-github-blog.svg?style=flat
[github-release-url]: https://github.com/chenhm/vue-github-blog/releases/latest
[standardjs-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat
[standardjs-url]: http://standardjs.com/
[travis-image]: https://img.shields.io/travis/chenhm/vue-github-blog/develop.svg
[travis-url]: https://travis-ci.org/chenhm/vue-github-blog
[daviddm-image]: https://david-dm.org/chenhm/vue-github-blog.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/chenhm/vue-github-blog
