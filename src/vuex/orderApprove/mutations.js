import * as types from './mutation-types'

export default {
    [types.ORDERAPPROVE_SET_ORDER_INFO](state, orderInfo ) {
        state.orderDetailInfo = orderInfo
    },
    [types.ORDERAPPROVE_GET_SAME_APPERANCE_AND_INTERIOR_CAR](state, { carInfo }) {
        state.sameAppertanceAndInteriorCar = carInfo
    },
    [types.ORDERAPPROVE_GET_SAME_APPERANCE_AND_BRAND_CAR](state, { carInfo }) {
        state.sameAppertanceAndBrandCar = carInfo
    },
    [types.ORDERAPPROVE_SET_ORDER_APPROVE_INFO](state, { orderApproveInfo }) {
        state.orderApproveInfo = orderApproveInfo
    },
    [types.ORDERAPPROVE_SET_APPROVED](state) {
        state.hasApproved = true 
    },
    [types.ORDERAPPROVE_RESET_APPROVED](state) {
        state.hasApproved = false
    },
    [types.ORDERAPPROVE_SET_ORDER_GETPROFIT](state, { derivativeProfit }) {
        state.orderDerivativeProfit = derivativeProfit
    }
}
