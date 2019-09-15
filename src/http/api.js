/* 
 * 接口统一集成模块
 */
import * as login from './moudules/login'
import * as user from './moudules/user'
import * as role from './moudules/role'
import * as menu from './moudules/menu'
import * as order from './moudules/order'
import * as account from './moudules/account'
import * as app from './moudules/app'
import * as withdrawal from './moudules/withdrawal'
import * as charge from './moudules/charge'
import * as dict from './moudules/dict'
import * as commission from './moudules/commission'
import * as home from './moudules/home'
import * as send from './moudules/send'



// 默认全部导出
export default {
    login,
    user,
    role,
    menu,
    order,
    account,
    app,
    charge,
    withdrawal,
    dict,
    commission,
    home,
    send
}