import axios from '../axios'

/* 
 * 用户管理模块
 */

// 保存
export const save = (data) => {
  return axios({
    url: '/user/save',
    method: 'post',
    data
  })
}
// 删除
export const batchDelete = (data) => {
  return axios({
    url: '/user/delete',
    method: 'post',
    data
  })
}
// 分页查询
export const findPage = (data) => {
  return axios({
    url: '/user/findPage',
    method: 'post',
    data
  })
}
// 分页查询
export const findBelong = (data) => {
  return axios({
    url: '/user/findBelong',
    method: 'post',
    data
  })
}

// 用户配置修改
export const userConf = (data) => {
  return axios({
    url: '/user/userConf',
    method: 'post',
    data
  })
}
// 用户支付次数修改
export const userPayConf = (data) => {
  return axios({
    url: '/user/userPayConf',
    method: 'post',
    data
  })
}

// 查找用户的菜单权限标识集合
export const findPermissions = (params) => {
  return axios({
    url: '/user/findPermissions',
    method: 'post',
    params
  })
}

// 查找用户的菜单权限标识集合
export const isMatch = () => {
  return axios({
    url: '/user/isMatch',
    method: 'post'
  })
}

export const passwordConf = (data) => {
  return axios({
    url: '/user/passwordConf',
    method: 'post',data
  })
}

export const rateConf = (data) => {
  return axios({
    url: '/user/rateConf',
    method: 'post',data
  })
}

export const belongUserList = () => {
  return axios({
    url: '/user/belongUserList',
    method: 'post'
  })
}