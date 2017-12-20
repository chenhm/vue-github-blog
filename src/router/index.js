import Vue from 'vue'
import VueRouter from 'vue-router'

import ListView from '../views/List.vue'
import PostView from '../views/Post.vue'
import Slides from '../views/Slides.vue'
import About from '../views/About.vue'

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
    path: '/post/:id',
    name: 'post',
    component: PostView
  },
  {
    path: '/slides/',
    component: Slides
  },
  {
    path: '/about/',
    component: About
  }
]

export default new VueRouter({
  mode: 'history',
  routes
})
