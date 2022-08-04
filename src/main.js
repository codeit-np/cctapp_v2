import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import 'bootstrap/scss/bootstrap.scss'
import Print from 'vue-print-nb'


Vue.use(Print);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
