import Vue from 'vue'
import Vuex from 'vuex'
import api, {sessionCache} from '../api'
import fm from 'front-matter'

Vue.use(Vuex)

const GET_LIST = 'getList'
const UPDATE_LIST = 'updateList'
const GET_DETAIL = 'getDetail'

export default new Vuex.Store({
  state: {
    lists: [],
    loading: false
  },
  mutations: {
    [GET_LIST] (state, {lists, loading}) {
      state.loading = loading
      if (lists) state.lists = lists
    },
    [UPDATE_LIST] (state, list) {
      const it = state.lists.find((item) => item.sha === list.sha)
      if (it && list.title) {
        it.title = list.title
        sessionCache.set('list', state.lists)
      }
    }
  },
  actions: {
    [GET_DETAIL] (context, {sha, url, type}) {
      return api.getDetail(sha, url).then(text => {
        if (type === 'md') {
          const content = fm(text)
          context.commit(UPDATE_LIST, {
            sha,
            title: (content.attributes.title) ? content.attributes.title : /^#([^#].*)/m.exec(text)[1]
          })
        } else {
          let ret = /^#([^#].*)/m.exec(text)
          if (ret) {
            context.commit(UPDATE_LIST, {
              sha,
              title: ret[1]
            })
          }
        }
        return text
      })
    },
    [GET_LIST] (context) {
      if (this.state.lists.length > 0) {
        return Promise.resolve()
      } else {
        context.commit(GET_LIST, {loading: true})
        return api.getList().then(
          lists => {
            context.commit(GET_LIST, {lists, loading: false})
            setTimeout(() => {
              lists.forEach(({sha, type, download_url}) => {
                context.dispatch(GET_DETAIL, {sha, url: download_url, type})
              })
            }, 0)
          },
          err => {
            context.commit(GET_LIST, {loading: false})
            console.info(`[${GET_LIST}]`, err)
          })
      }
    }
  }
})
