// /src/vuex/store.js

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import createLogger from '../common/logger'
import likevehicle from './likevehicle/store'
import customer from './customer/store'
import menu from './menu/store'
import insurance from './insurance/store'
import servicefee from './servicefee/store'
import order from './order/store'
import carInfo from './carInfo/store'
import homepage from './homepage/store'
import financePro from './financePro/store'
import newInsurance from './newInsurance/store' //APP订单保险
//订单审批
import orderApprove from './orderApprove/store'
import carpolicy from './carWithPolicy/store'
import customercenter from './customercenter/store'
//销售二期
import marketactivity from './marketActivity/store'         //市场活动
import databoard from './dataBoard/store'                   //数据看板
// test
// import testvuex from './testvuex/store'   //引入新模块

const env = process.env.NODE_ENV

const debug = env == 'development'

export default new Vuex.Store({
    modules: { //在这里注册模块
        menu,
        insurance,
        newInsurance,
        servicefee,
        likevehicle,
        customer,
        order,
        carInfo,
        homepage,
        financePro,
        orderApprove,
        carpolicy,
        customercenter,
        //销售二期
        marketactivity,
        databoard,
        // testvuex
    },
    strict: debug,
    plugins: debug ? [createLogger()] : []
})