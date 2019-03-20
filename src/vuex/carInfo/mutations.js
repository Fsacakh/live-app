
import * as types from './mutation-types'

export default {
    [types.CARINFO_SET_CAR_INFO](state, { carInfo }) {
        state.carInfo = carInfo
    },
    [types.CARINFO_SET_PURCHASE_CAR_INFO](state, { carInfo }) {
        state.purchaseCarInfo = carInfo
    },
    [types.CARINFO_SET_PAGER](state, { pager }) {
        state.pager = pager
    },
    [types.IS_STORE] (state, obj) {
        state.isStore = obj
    },
    [types.SET_STORE] (state, obj) {
        state.store = obj
    },
    [types.STORE_CODE] (state, obj) {
        state.storeCode = obj
    },
    [types.CARINFO_GET_STOCK_INFO_LIST](state, { stockCarInfoList }) {
        state.stockCarInfoList = stockCarInfoList
    },
    [types.CARINFO_ATTACH_STOCK_INFO_LIST](state, { stockCarInfoList }) {
        state.stockCarInfoList = state.stockCarInfoList.concat(stockCarInfoList)
    },
    [types.CARINFO_SET_DISPLAY_NAME](state, { displayName }) {
        state.carInfo.displayName = displayName
    },
    [types.CARINFO_SET_CAR_MSRP](state, { actualMSRPInclusiveTax }) {
        state.msrp = actualMSRPInclusiveTax
    },
    [types.CARINFO_SHOW_LOADING](state) {
        state.loadingShow = true
    },
    [types.CARINFO_HIDE_LOADING](state) {
        state.loadingShow = false
    },
    [types.CARINFO_ENABLE_SELECT_CAR_INFO](state) {
        state.enableSelectCar = true
    },
    [types.CARINFO_DISABLED_SELECT_CAR_INFO](state) {
        state.enableSelectCar = false
    },
    [types.CARINFO_SET_LOAD_NO_DATA](state, { loadingNoData }) {
        state.loadingNoData = loadingNoData
    },
    [types.CARINFO_SHOW_BAND_AND_SERIES_CONDITION](state) {
        state.showBandAndSeries = true
    },
    [types.CARINFO_HIDE_BAND_AND_SERIES_CONDITION](state) {
        state.showBandAndSeries = false
    }
}
