import axios from '../axios'


// 保存
export const dealErrorData = () => {
    return axios({
      url: '/send/dealErrorData',
      method: 'post'
    })
  }

export const findPage = (data) => {
    return axios({
      url: '/send/findpage',
      method: 'post',
      data
    })
  }

export const dealSend = (data) => {
    return axios({
      url: '/send/dealSend',
      method: 'post',
      data
    })
  }