/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

export function validMobile(mobile) {
  const reg = /^1[3-9]\d{9}$/
  return reg.test(mobile)
}
