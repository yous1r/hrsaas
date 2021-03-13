import request from '@/utils/request'

/**
 * 获取角色列表
 * @param {*} page
 * @param {*} pagesize
 */
export function getRoleList(page = 1, pagesize = 10) {
  return request({
    method: 'get',
    url: '/sys/role',
    params: {
      page,
      pagesize
    }
  })
}

/**
 * 添加角色
 * @param {*} data
 */
export function addRole(data) {
  return request({
    method: 'POST',
    url: '/sys/role',
    data
  })
}

/**
 * 获取角色详情
 * @param {*} id
 */
export function getRoleDetail(id) {
  return request({
    method: 'get',
    url: '/sys/role/' + id
  })
}

/**
 * 更新角色
 * @param {*} data
 */
export function updateRole(data) {
  return request({
    method: 'put',
    url: `/sys/role/${data.id}`,
    data
  })
}

/**
 * 删除角色
 * @param {*} id
 */
export function deleteRole(id) {
  return request({
    method: 'delete',
    url: `/sys/role/${id}`
  })
}

/**
 * 获取公司的详情
 * @param {*} id
 */
export function getCompanyById(id) {
  return request({
    method: 'get',
    url: `/company/${id}`
  })
}

// 给角色分配权限
export function assignPerm(data) {
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
