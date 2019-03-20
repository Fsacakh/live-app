import * as actions from './actions.js'
import mutations from './mutations.js'

const state = {
    changeInsurancePlanStatus: false,
    orderData: {
        fieldObj:{
            insuranceOrderNo: ''
        }
    }, //当前页面保险单数据
    orderType: false, //当前保险单状态 类型：boolean, 更新状态: true, 新增状态: false
}

export default {
    namespaced: true,
    actions,
    state,
    mutations,
}