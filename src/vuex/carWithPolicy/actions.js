import api from '../../common/api'
import * as types from './mutation-types'

export const setPolicyList = ( { commit }, list ) => {
    commit(types.CARWITHPOLICY_SET_POLICYLIST, list)
}
export const removePolicyList = ( { commit } ) => {
    commit(types.CARWITHPOLICY_REMOVE_POLICYLIST)
}