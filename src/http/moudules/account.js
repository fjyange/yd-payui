import axios from '../axios'
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/account/findPage',
        method: 'post',
        data
    })
}

/* 
 * 用户管理模块
 */

// 保存
export const save = (data) => {
    return axios({
        url: '/account/save',
        method: 'post',
        data
    })
}

// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/account/delete',
        method: 'post',
        data
    })
}
export const accountConf= (data) => {
    return  axios({
        url: '/account/accountConf',
        method: 'post',
        data
    })
}