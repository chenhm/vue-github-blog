import axios from 'axios'
import 'es6-promise/auto'

import conf from '../config'
import { onlyTitle, onlyDate, onlyID } from '../utils'

// const isProd = process.env.NODE_ENV === 'production'
const isProd = true

/**
 * Format GitHub Api url for content list
 * @returns {string}
 */
export function getListUrl () {
  // @see https://developer.github.com/v3/repos/contents/#get-contents
  // @example https://api.github.com/repos/viko16/vue-ghpages-blog/contents/markdown?ref=markdown
  // let url = `https://api.github.com/repos/${conf.repo}/contents/`
  // if (conf.path) url += conf.path
  // if (conf.branch) url += `?ref=${conf.branch}`
  let url = `https://raw.githubusercontent.com/${conf.repo}/list/list.json`
  return isProd ? url : '/list.json'
}

/**
 * Format GitHub Api url for file content
 * @param {string} hash
 * @returns {string}
 * @deprecated
 */
export function getPostUrl (hash) {
  // @see https://developer.github.com/v3/git/blobs/#get-a-blob
  return isProd ? `https://api.github.com/repos/${conf.repo}/git/blobs/${hash}` : `/${hash}`
}

export { axios as axiosInstance }

// Cache processor
const Cache = {
  get: (key) => {
    if (!window.localStorage) return false
    return JSON.parse(window.localStorage.getItem(key))
  },
  set: (key, data) => {
    if (!window.localStorage) return false
    window.localStorage.setItem(key, JSON.stringify(data))
    return true
  },
  has: (key) => {
    return Boolean(window.localStorage && window.localStorage.hasOwnProperty(key))
  }
}
export const sessionCache = {
  get: (key) => {
    if (!window.sessionStorage) return false
    return JSON.parse(window.sessionStorage.getItem(key))
  },
  set: (key, data) => {
    if (!window.sessionStorage) return false
    window.sessionStorage.setItem(key, JSON.stringify(data))
    return true
  },
  has: (key) => {
    return Boolean(window.sessionStorage && window.sessionStorage.hasOwnProperty(key))
  }
}

export default {
  Cache,

  getList () {
    if (sessionCache.has('list')) {
      // Read from cache
      return Promise.resolve(sessionCache.get('list'))
    } else {
      return axios.get(getListUrl())
        .then(res => res.data)
        .then(arr => {
          // Data cleaning
          const list = arr.filter(({type}) => type === 'file').map(({name, sha, size, download_url}) => ({
            id: onlyID(name),
            title: onlyTitle(name),
            date: onlyDate(name),
            type: name.toLocaleLowerCase().endsWith('.adoc') ? 'adoc' : 'md',
            sha,
            download_url,
            size
          })).sort((itemA, itemB) => new Date(itemB.date) - new Date(itemA.date))
          // Save into cache
          if (isProd) { sessionCache.set('list', list) }
          // ..then return
          return list
        })
    }
  },

  getDetail (hash, url) {
    const httpOpts = {
      // https://developer.github.com/v3/media/#raw-1
      headers: { Accept: 'application/vnd.github.v3.raw' }
    }
    const cacheKey = 'post.' + hash

    if (Cache.has(cacheKey)) {
      // Read from cache
      return Promise.resolve(Cache.get(cacheKey))
    } else {
      return axios.get(url, httpOpts)
        .then(res => res.data)
        .then(content => {
          // Save into cache
          if (isProd) { Cache.set(cacheKey, content) }
          // ..then return
          return content
        })
    }
  }
}
