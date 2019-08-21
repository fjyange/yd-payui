import axios from '../axios'
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/app/findPage',
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
        url: '/app/save',
        method: 'post',
        data
    })
}

// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/app/delete',
        method: 'post',
        data
    })
}

export const appConf= (data) => {
    return  axios({
        url: '/app/appConf',
        method: 'post',
        data
    })
}