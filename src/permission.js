/* 回头自己写逻辑 */
import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// import { asyncRoutes } from '@/router'
// 注册前置导航守卫
// to: 到哪儿去
// from: 从哪儿来
// next: 函数  next() 代表放行  next('/login') 拦截到登录
/*
  1. 从vuex中获取token
  2. 判断token是否有值
  3. 如果有token
    3.1 判断去的页面是否是登录页面，如果是登录，跳转到首页  如果不是登录，放行
  4. 如果没有token
    4.1 判断去的页面是否在白名单中，如果是，放行， 如果不是，拦截到登录页
*/
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  const token = store.getters.token
  if (token) {
    // 有token
    // 获取用户信息
    /*
      1. 判断vuex中是否有用户信息
      2. 如果没有，提交action,获取用户信息即可
    */
    if (!store.getters.name) {
      const { roles } = await store.dispatch('user/getUserInfo')
      // console.log(userInfo)
      // 处理菜单显示 roles.menu
      // 把动态路由 添加到路由规则中
      // 需要获取到当前用户的信息
      // const otherRoutes = asyncRoutes.filter(item => {
      //   // console.log(item.children[0].name)
      //   if (userInfo.roles.menus.includes(item.children[0].name)) {
      //     return true
      //   } else {
      //     return false
      //   }
      // })
      // console.log(otherRoutes)
      // router.addRoutes([...otherRoutes, { path: '*', redirect: '/404', hidden: true }])
      // store.commit('permission/addRoutes', otherRoutes)
      // console.log(otherRoutes)
      const otherRoutes = await store.dispatch('permission/filterRoutes', roles.menus)
      router.addRoutes([...otherRoutes, { path: '*', redirect: '/404', hidden: true }])
      next({ ...to, replace: true })
      return
    }
    if (to.path === '/login') {
      next('/')
      NProgress.done()
    } else {
      next()
    }
  } else {
    // 没有token
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach((to, from) => {
  NProgress.done()
})
