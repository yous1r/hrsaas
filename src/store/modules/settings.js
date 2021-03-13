import defaultSettings from '@/settings'
import { setTheme, getTheme, removeTheme } from '@/utils/auth'

const { showSettings, fixedHeader, sidebarLogo, defaultTheme } = defaultSettings

const state = {
  showSettings: showSettings,
  fixedHeader: fixedHeader,
  sidebarLogo: sidebarLogo,
  theme: getTheme() || defaultTheme
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (state.hasOwnProperty(key)) {
      state[key] = value
    }
    // 如果修改的是theme，把theme的值保存起来
    if (key === 'theme') {
      setTheme(value)
    }
  },
  resetTheme(state) {
    state.theme = defaultTheme
    removeTheme()
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

