import axios from '../axios'

// 保存
export const save = (data) => {
    return axios({
        url: '/withdrawal/save',
        method: 'post',
        data
    })
}

// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/withdrawal/findPage',
        method: 'post',
        data
    })
}

export const audit = (data) => {
    return axios({
        url: '/withdrawal/audit',
        method: 'post',
        data
    })
}
