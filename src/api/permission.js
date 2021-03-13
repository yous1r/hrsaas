import request from '@/utils/request'

/**
 * 获取权限列表
 */
export function getPermissionList() {
  return request({
    url: '/sys/permission'
  })
}
/**
 * 添加权限
 * @param {*} data
 */
export function addPermission(data) {
  return request({
    method: 'post',
    url: '/sys/permission',
    data
  })
}

/**
 * 获取权限详情
 * @param {*} id
 */
export function getPermissionDetail(id) {
  return request({
    method: 'get',
    url: `/sys/permission/${id}`
  })
}

/**
 * 修改权限
 * @param {*} data
 */
export function updatePermission(data) {
  return request({
    method: 'put',
    url: `/sys/permission/${data.id}`,
    data
  })
}

/**
 * 删除权限
 * @param {*} id
 */
export function delPermission(id) {
  return request({
    method: 'delete',
    url: `/sys/permission/${id}`
  })
}
