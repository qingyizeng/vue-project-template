import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import {formatDate,} from '@/utils/date';
import '@/icons' // icon
//import '@/permission' // permission control
Vue.use(ElementUI, { locale })
Vue.config.productionTip = false

Vue.filter("formatTime", (time) => {
  if (time == null || time === '') {
    return 'N/A';
  }
  let date = new Date(time);
  return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
})
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
