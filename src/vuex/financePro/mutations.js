import * as types from './mutation-types'

export default {
    [types.FINANCEPRO_SET_DETAIL_INFO_LIST](state, { list }) {
        state.financeProDetailInfoList = list
    },
    [types.FINANCEPRO_ATTACH_DETAIL_INFO_LIST](state, { list }) {
        state.financeProDetailInfoList = state.financeProDetailInfoList.concat(list)
    },
    [types.FINANCEPRO_SET_DETAIL_INFO](state, { financeProDetailInfo }) {
        state.financeProDetailInfo = financeProDetailInfo
    },
    [types.FINANCEPRO_SET_PAGER](state, { pager }) {
        state.pager = pager 
    },
    [types.FINANCEPRO_SHOW_LOADING](state) {
        state.loadingShow = true 
    },
    [types.FINANCEPRO_HIDE_LOADING](state) {
        state.loadingShow = false
    },
    [types.FINANCEPRO_SET_LOAD_NO_DATA](state, { loadingNoData }) {
        state.loadingNoData = loadingNoData 
    },
    [types.FINANCEPRO_SET_FINANCE_DETAIL_CODE](state, { financeDetailCode }) {
        state.financeDetailCode = financeDetailCode
    },
    [types.FINANCEPRO_SET_FINANCE_WORK_BENCH_INFO](state, { financeWorkbenchInfo }) {
        state.financeWorkbenchInfo = financeWorkbenchInfo
    }
}