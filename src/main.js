import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import Element from 'element-ui'
import store  from 'vuex'
import axios from 'axios'
import mavonEditor from 'mavon-editor'
import "element-ui/lib/theme-chalk/index.css"
import 'mavon-editor/dist/css/index.css'
import './utils/request'

Vue.use(Element)
Vue.use(mavonEditor)
Vue.use(Vuex)
Vue.config.productionTip = false
Vue.prototype.$axios = axios
axios.defaults.baseURL = "http://localhost:8081"
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
