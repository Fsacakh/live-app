import config from 'common/config'
import * as types from './mutation-types'

export default {
    [types.GET_FLOW_INFO] (state, obj) {
        state.flowInfo = obj
    },
    [types.GET_INVENTORY_INFO] (state, obj) {
        state.inventoryInfo = obj
    },
    [types.GET_SELL_INFO] (state, obj) {
        state.sellInfo = obj
    },
    [types.GET_GAIN_INFO] (state, obj) {
        state.gainInfo = obj
    },
    [types.GET_GAIN_INFO_UN_TICKET] (state, obj) {
        state.gainInfoUnTicket = obj
    },
    [types.GET_GP_INFO] (state, obj) {
        state.GPInfo = obj
    },
    [types.GET_GP_INFO_UN_TICKET] (state, obj) {
        state.GPInfoUnTicket = obj
    },

    // 新增
    [types.GET_TOTAL_INFO] (state, obj) {
     
            state.invenall = obj
    },
    [types.GET_STAT_INFO] (state, obj) {
        if(obj.type === 61) {
            state.inven60 = obj.num
        } 
    },
    // [types.GET_STAT_INFO] (state, obj) {
    //     if(obj.type === 61) {
    //         state.inven60 = obj.num
    //     } else {
    //         state.invenall = obj.num
    //     }
    // },
    [types.GET_LOCK_INFO] (state, obj) {
        state.lockedInfo = obj
    },
    [types.GET_DAYS_INFO] (state, obj) {
        state.invenDays = obj
    },
    [types.GET_SALE_INFO] (state, obj) {
        state.saleInfo = obj[0]
    },
    [types.GET_GP_SORT_INFO](state, { gpSortInfo }) {
        state.gpSortInfo = gpSortInfo
    },
    [types.GET_SELL_DETAIL_LIST](state, { list }) {
        state.sellDetailList = list
    },
    [types.IS_STORE] (state, obj) {
        state.isStore = obj
    },
    [types.SET_STORE] (state, obj) {
        state.store = obj
    },
    [types.SET_TIME] (state, obj) {
        state.time = obj
    }
}