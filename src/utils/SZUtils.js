/**
 * 工具
 */

import crypto from 'crypto'

// MD5加密
export function md5(str) {
  var md5 = crypto.createHash('md5')
  md5.update(str)
  return md5.digest('hex')
}

// // 数据字典
// export function getDict(pid, type) {
//   return dict(pid, type)
// }

// // 省市区
// export function generateRegionCode(code) {
//   let regionCode = []
//   let city = code.substring(0, 4) + '00'
//   let province = code.substring(0, 2) + '0000'
//   regionCode.push(province)
//   regionCode.push(city)
//   regionCode.push(code)
//   return regionCode
// }

// // tenderProjectClassifyCodeArr
// export function tenderProjectClassifyCode(code) {
//   var tenderProjectClassifyCodeArr = []
//   tenderProjectClassifyCodeArr.push(code.charAt(0))
//   for (var i = 3; i < code.length + 1; i += 2) {
//     tenderProjectClassifyCodeArr.push(code.substring(0, i))
//   }
//   return tenderProjectClassifyCodeArr
// }

// export function calcTableHeight(parentEl, tableEl) {
//   let a = parentEl.scrollHeight
//   const el = tableEl.$el
//   let b = el.getBoundingClientRect().top - 84
//   return a - b - 50
// }
