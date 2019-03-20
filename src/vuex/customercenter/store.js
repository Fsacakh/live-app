import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'
import config from '../../common/config'

const state = {
    empCode: "",
    empName: "",
    customParams: {
        scCode: null,
        pageNums: config.pageNums,
        pageStart: 1
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
