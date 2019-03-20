// import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

const state = {
    serviceType: [],
    accountType: [],
    orderServiceFeeCode: ''
}

export default {
    namespaced: true,
    state,
    // getters,
    actions,
    mutations
}
