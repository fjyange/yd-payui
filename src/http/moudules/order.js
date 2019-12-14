import axios from '../axios'


// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/order/findPage',
        method: 'post',
        data
    })
}

// 分页查询
export const findHistory = (data) => {
    return axios({
        url: '/order/findHistory',
        method: 'post',
        data
    })
}

export const audit = (data) => {
    return axios({
        url: '/order/audit',
        method: 'post',
        data
    })
}

export const errorOrder = (data) => {
    return axios({
        url: '/order/errorOrder',
        method: 'post',
        data
    })
}