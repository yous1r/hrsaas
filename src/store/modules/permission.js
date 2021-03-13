import { constantRoutes, asyncRoutes } from '@/router'
export default {
  // 开启命令空间
  namespaced: true,
  state: {
    // 静态的路由  动态添加的路由
    routes: constantRoutes
  },
  mutations: {
    addRoutes(state, otherRoutes) {
      state.routes = [...constantRoutes, ...otherRoutes]
    }
  },
  actions: {
    filterRoutes(conext, menus) {
      // 过滤asyncRoutes
      // 路由的name在menus需要存在
      const otherRoutes = asyncRoutes
        .filter(item => menus.includes(item.children[0].name))
      // console.log('otherRoutes', otherRoutes)
      conext.commit('addRoutes', otherRoutes)
      return otherRoutes
    }
  },
  getters: {}
}
