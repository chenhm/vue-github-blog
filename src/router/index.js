import Vue from 'vue'
import VueRouter from 'vue-router'

import ListView from '../views/List.vue'
import PostView from '../views/Post.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    redirect: '/list/1'
  },
  {
    path: '/list/:page',
    name: 'list',
    component: ListView
  },
  {
    path: '/post/:hash',
    name: 'post',
    component: PostView
  }
]

export default new VueRouter({
  mode: 'history',
  routes
})
