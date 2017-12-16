import Vue from 'vue'

// mock axios requests
import './mock'
// import '../../static/asciidoctor.min.js'
// register global filter
import filter from '@/utils/filter'
filter(Vue)

// setup config
Vue.config.productionTip = false
Vue.config.devtools = false

const testsContext = require.context('./specs', true, /\.spec$/)
testsContext.keys().forEach(testsContext)
