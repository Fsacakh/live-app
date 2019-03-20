import * as actions from './actions.js'
import * as getters from './getter.js'
import mutations from './mutations.js'

const state = {
    marketlist: [],
    marketDetail: {},
    invitelList: null,
    relationMarketList: [],
    listRelationCode: '',
}

export default {
    namespaced: true,
    actions,
    getters,
    state,
    mutations,
}