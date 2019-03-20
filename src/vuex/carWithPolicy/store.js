import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

const state = {
    policyList: []
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}