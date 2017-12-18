import Vue from 'vue'
import router from './router'
import App from './App.vue'
import filter from './utils/filter'
import md from './components/md.vue'

// setup Vue filter
filter(Vue)

// whether to allow vue-devtools inspection
// false in production builds
Vue.config.devtools = process.env.NODE_ENV !== 'production'

Vue.component('md', md)
const app = new Vue({
  el: '#app',
  router,
  render: h => h(App)
})

export { app, router }
