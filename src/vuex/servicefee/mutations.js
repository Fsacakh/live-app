import config from '../../common/config.js' 
import * as types from './mutation-types'

export default {
    [types.GET_SERVICE_TYPE](state, tp) {
        if (tp.id == config.ref.getServiceType) {
            state.serviceType = tp.type
        } else {
            state.accountType = tp.type
        }
        // if (tp.id == config.ref.accountType) {
            
        // } else 
    },
    [types.GET_SERVICE_CODE](state, code) {
        state.orderServiceFeeCode = code
    }
}
