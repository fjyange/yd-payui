import axios from '../axios'


// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/order/findPage',
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