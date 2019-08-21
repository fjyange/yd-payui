import axios from '../axios'

/* 
 * 系统登录模块
 */

// 登录
export const login = data => {
    return axios({
        url: '/userLogin/login',
        method: 'post',
        data
    })
}
