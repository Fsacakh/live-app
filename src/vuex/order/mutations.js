import * as types from './mutation-types'

export default {
    [types.SET_TYPES](state, typesInfo) {
        state.order[typesInfo.type] = typesInfo.val
    },
    [types.GET_GP_CONFIG](state, gpInfo) {
        state.gpInfo = gpInfo
    },
    [types.ORDER_GET_GP_LIST](state, { gpList }) {
        state.gpList = gpList
    },
    [types.ORDER_GET_ORDER_NO](state, { orderNo }) {
        state.order.orderInfo.orderNo = orderNo
    },
    [types.ORDER_SET_ORDER_INFO](state, { order }) {
        state.order = order
    },
    [types.GET_ORDER_INFO](state, order) {
        state.orderInfo = order
    },
    [types.ORDER_SET_ORDER_APPROVE_HISTORY](state, { orderApproves }) {
        state.orderApproveHistory = orderApproves
    },
    [types.ORDER_GET_WORK_FLOW_INFO](state, { orderwfInfo }) {
        state.orderwfInfo = orderwfInfo
    },
    [types.ORDER_SET_CAR_ACTUAL_SALES_PRICE](state, { actualSalePrice }) {
        state.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice = actualSalePrice
    },
    [types.ORDER_SET_IS_SC](state, { isSc }) {
        state.isSc = isSc
    },
    [types.ORDER_GET_GP_APPRANCE_ONE_WEEK](state, { gpApprance }) {
        state.appranceOneWeek = gpApprance
    },
    [types.ORDER_GET_GP_APPRANCE_ONE_MONTH](state, { gpApprance }) {
        state.appranceOneMonth = gpApprance
    },
    [types.ORDER_MONEY](state, { money }) {
        state.getCouponName = money
    },
    [types.ORDER_USE](state) {
        state.getCouponName = '查看可用券'
    },
}
