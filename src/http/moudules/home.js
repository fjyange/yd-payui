import axios from '../axios'


export const systemOperate = (data) => {
    return axios({
        url: '/home/systemOperate',
        method: 'post',
        data
    })
}
// 删除
export const  isMatch = () => {
    return axios({
        url: '/home/isMatch',
        method: 'post'
    })
}
// 删除
export const  showHome = () => {
    return axios({
        url: '/home/showHome',
        method: 'post'
    })
}
