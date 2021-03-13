import request from '@/utils/request'

/**
 * 获取部门
 */
export function getDepartments() {
  return request({
    method: 'GET',
    url: '/company/department'
  })
}

/**
 * 删除部门
 * @param {string} id
 */
export function delDepartment(id) {
  return request({
    method: 'delete',
    url: `/company/department/${id}`
  })
}

/**
 * 添加部门
 * @param {*} data
 */
export function addDepartment(data) {
  return request({
    method: 'post',
    url: '/company/department',
    data
  })
}

/**
 * 获取部门详情
 * @param {*}} id
 */
export function getDepartDetail(id) {
  return request({
    method: 'get',
    url: `/company/department/${id}`
  })
}

/**
 * 修改部门
 * @param {*} data
 */
export function updateDepartment(data) {
  return request({
    method: 'PUT',
    url: `/company/department/${data.id}`,
    data
  })
}
