import Vue from 'vue'
import Vuex from 'vuex'
import api from '../api'

Vue.use(Vuex)

const GET_LIST = 'getList'

export default new Vuex.Store({
  state: {
    lists: [],
    loading: false
  },
  mutations: {
    [GET_LIST] (state, {lists, loading}) {
      state.loading = loading
      if (lists) state.lists = lists
    }
  },
  actions: {
    [GET_LIST] (context) {
      if (this.state.lists.length > 0) {
        return Promise.resolve()
      } else {
        context.commit(GET_LIST, {loading: true})
        return api.getList().then(
          lists => {
            context.commit(GET_LIST, {lists, loading: false})
          },
          err => {
            context.commit(GET_LIST, {loading: false})
            console.info(`[${GET_LIST}]`, err)
          })
      }
    }
  }
})
