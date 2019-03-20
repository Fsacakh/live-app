import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

const state = {
    tablelist: [],
    tableShow: false,
    // companycode: '',
    // jiaoCode: '',
    tempJiao: {},
    tempBusi: {},
    insuranceNo: '',
    accountTypes: [],
    backData: {},
    saveInfo: {},
    companyList: [],
    num: null,
    itemList: [],
    orderNo: null,
    carCode: ''
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
