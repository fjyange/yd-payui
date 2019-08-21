import axios from '../axios'
// 保存
export const save = (data) => {
    return axios({
        url: '/topup/save',
        method: 'post',
        data
    })
}

// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/topup/findPage',
        method: 'post',
        data
    })
}

export const audit = (data) => {
    return axios({
        url: '/topup/audit',
        method: 'post',
        data
    })
}