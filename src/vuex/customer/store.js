import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

const state = {
    cusLeadInfo: {},
    loginInfo: {},  
    intentionCarInfo: {},
    isInsert: false,
    modelInfo: {},
    followItem: {},
    currentTabIndex: 0,
    currentTabContent: 'clueinfo',
    referrer: {},
    personInfo: {},
    displayName:''
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
