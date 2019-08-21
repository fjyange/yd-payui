import axios from '../axios'


// 保存
export const save = (data) => {
    return axios({
        url: '/dictIndex/save',
        method: 'post',
        data
    })
}
// 删除
export const batchDelete = (data) => {
    return axios({
        url: '/dictIndex/delete',
        method: 'post',
        data
    })
}
// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/dictIndex/findPage',
        method: 'post',
        data
    })
}

export const getDict = (data) => {
    return axios({
        url: '/dictIndex/getDict',
        method: 'post',
        data
    })
}