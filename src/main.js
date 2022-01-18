import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// plugins
import '@/plugins/element-ui'
// css
import './styles/reset.less'
import './styles/_variables.less'
import './styles/global.less'
import './styles/sprite/sprite.less'
// svg
import '@/components/svg'
// 路由登录限制
import '@/router/permission.js'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
