// 插件只需要导出一个install方法
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import WorkCalendar from './work-calendar'
import ScreenFull from './ScreeFull'
import ThemePicker from './ThemePicker'
import Lang from './Lang'
import TagsView from './TagsView'
export default {
  install(Vue) {
    // console.log('我执行了')
    // 注册全局组件
    // Vue.component('')
    // 定义全局指令
    // Vue.directives('loading', {})
    // Vue.prototype.$message = function (){}
    Vue.component('page-tools', PageTools)
    Vue.component('upload-excel', UploadExcel)
    Vue.component('image-upload', ImageUpload)
    Vue.component('work-calendar', WorkCalendar)
    Vue.component('screen-full', ScreenFull)
    Vue.component('theme-picker', ThemePicker)
    Vue.component('lang', Lang)
    Vue.component('TagsView', TagsView)
  }
}
