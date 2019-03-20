import * as types from './mutation-types.js'

export default {
    [types.CARWITHPOLICY_SET_POLICYLIST](state, list) {
        console.log(list)
        list.forEach(element => {
            state.policyList.push(element)
        })
    },
    [types.CARWITHPOLICY_REMOVE_POLICYLIST](state) {
        state.policyList = []
    }
}