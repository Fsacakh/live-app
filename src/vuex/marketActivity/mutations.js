import * as types from './mutation-types.js'
import config from 'common/config.js'

export default {
    [types.GET_MARKET_LIST] (state, list) {
        state.marketlist = list
    },
    [types.GET_MARKET_DETAIL] (state, obj) {
        state.marketDetail = obj
    },
    [types.QUERY_INVITEL_LIST] (state, list) {
        state.invitelList = list
    },
    [types.CUST_REL_MATKET] (state, obj) {
        state.relationMarketList = obj
    },
    [types.GET_LISTRELATION_CODE] (state, obj) {
        state.listRelationCode = obj
    }
}