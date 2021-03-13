import { login, getUserInfo, getUserById } from '@/api/user'
import { setToken, getToken, removeToken, setTime } from '@/utils/auth'
import { resetRouter } from '@/router'
const state = {
  token: getToken(),
  userInfo: {}
}

const mutations = {
  setToken(state, token) {
  // 存储到vuex
    state.token = token
    // 存储到Cookie
    setToken(token)
    // 存储当时的时间戳
    setTime(Date.now())
  },
  removeToken(state) {
  // 删除token
    state.token = null
    // 删除本地token
    removeToken()
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  removeUserInfo(state) {
    state.userInfo = {}
  },
  setPhoto(state, photo) {
    state.userInfo.staffPhoto = photo
  }
}
const actions = {
  async login(context, data) {
    const token = await login(data)
    console.log(token)
    context.commit('setToken', token)
  },
  async getUserInfo({ commit }) {
    const res = await getUserInfo()
    const res2 = await getUserById(res.userId)
    // console.log(res2)
    const userInfo = {
      ...res,
      ...res2
      // staffPhoto: res2.staffPhoto
      // staffPhoto: 'xxxx'
    }
    commit('setUserInfo', userInfo)
    return userInfo
  },
  logout({ commit }) {
    commit('removeToken')
    commit('removeUserInfo')
    // 重置路由
    resetRouter()
    // 重置permission模块中routes
    commit('permission/addRoutes', [], { root: true })
    commit('settings/resetTheme', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

