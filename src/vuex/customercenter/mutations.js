import * as types from './mutation-types'

export default {
    [types.SCREENING_CODEITIONS_EMP](state, obj) {
        state.empCode = obj.empCode
        state.empName = obj.empName
    },
    [types.CUSTOMER_CENTER_SET_PARAMS](state, params) {
        state.customParams = params 
    }
}
