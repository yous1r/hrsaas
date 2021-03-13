import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import Print from 'vue-print-nb'
// import '@/styles/element-variables.scss'
// 导入了字体图标
import '@/icons' // icon

// 权限验证
import '@/permission' // permission control

// 全局导入指令
import * as result from '@/directives'
import * as filters from '@/filters'

// 全局导入所有的全局组件-插件
import Components from '@/components'
import permission from '@/mixins/permission'
import i18n from '@/lang'
Vue.use(Components)
Vue.use(Print)
Vue.mixin(permission)

Object.keys(result).forEach(item => {
  Vue.directive(item, result[item])
})

Object.keys(filters).forEach(item => {
  Vue.filter(item, filters[item])
})

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})

Vue.config.productionTip = false

// 所有的vue组件就有一个方法： $t
new Vue({
  el: '#app',
  router,
  store,
  i18n: i18n,
  render: h => h(App)
})
