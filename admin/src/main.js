import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import api from './api'
import {VueJsonp} from 'vue-jsonp'

import '@/icons' // icon


Vue.use(ElementUI)
Vue.use(VueJsonp)

Vue.config.productionTip = false
Vue.prototype.$http = api

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
