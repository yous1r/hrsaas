import Cookies from 'js-cookie'

const TokenKey = 'hrsaas_76_token'
const TimeKey = 'hrsaas_76_time'
const themeKey = 'hrsaas_76_theme'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setTime(time) {
  Cookies.set(TimeKey, time)
}

export function getTime() {
  return Cookies.get(TimeKey)
}

export function setTheme(theme) {
  Cookies.set(themeKey, theme)
}

export function getTheme() {
  return Cookies.get(themeKey)
}
export function removeTheme() {
  return Cookies.remove(themeKey)
}
