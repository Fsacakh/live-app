import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

const state = {
    list: [],
    selectedRow: 0,
    showAddModal: false,
    showUpdateModal: false
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
