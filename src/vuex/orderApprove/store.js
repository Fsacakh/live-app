import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

const state = {
    hasApproved: false,
    orderDetailInfo:[],
    orderApproveInfo: {},
    sameAppertanceAndInteriorCar: {},
    sameAppertanceAndBrandCar: {},
    orderDerivativeProfit:{}
}
export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
