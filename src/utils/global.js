/**
 * 全局常量、方法封装模块
 * 通过原型挂载到Vue属性
 * 通过 this.Global 调用
 */

// 后台管理系统服务器地址
export const baseUrl = 'http://47.115.114.53/authorize'
// export const baseUrl = 'http://120.79.91.63/authorize'
// export const baseUrl = 'http://120.24.184.96/authorize'
// export const baseUrl = 'http://193.112.135.244:9090/authorize'
//  export const baseUrl = '/api/'
// 系统数据备份还原服务器地址

export default {
    baseUrl
}