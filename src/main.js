import Vue from 'vue' 
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'; 
import App from './App'
import store from './store'
import router from './router'
import axios from 'axios' 

import '@/style/common.scss'
import '@/style/myElementui.scss'
import './router' // permission control 
Vue.prototype.$axios = axios 
 
Vue.use(ElementUI); 
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store, 
  render: h => h(App)
})
