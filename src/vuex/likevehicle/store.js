import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

const state = {
    likevehicle: null,
    temporarydata: null,
    list: []
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
