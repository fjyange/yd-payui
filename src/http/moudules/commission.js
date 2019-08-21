import axios from '../axios'
// 保存
export const save = (data) => {
    return axios({
        url: '/commission/save',
        method: 'post',
        data
    })
}

// 分页查询
export const findPage = (data) => {
    return axios({
        url: '/commission/findPage',
        method: 'post',
        data
    })
}

export const audit = (data) => {
    return axios({
        url: '/commission/audit',
        method: 'post',
        data
    })
}
export const getRate = ()=>{
    return axios({
        url: '/commission/getRate',
        method: 'post'
    })
}