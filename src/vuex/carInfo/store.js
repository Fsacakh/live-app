import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

const state = {
    carInfo: {
        isDeceitedCar: false,
        carFactoryCode: '',
        carBrandCode: '',
        carSeriesCode: '',
        carModelCode: '',
        carCode: '',
        displayName: '',
        skuCode: '',
        pageNums: 15,
        pageStart: 1,
        storeCode: '',
    },
    storeName: '',
    storeCode: '',
    store: '',
    isStore: false,
    purchaseCarInfo: {
        carFactoryCode: '',
        carBrandCode: '',
        carSeriesCode: '',
        carModelCode: '',
        carCode: '',
        displayName: '',
        skuCode: '',
        pageNums: 15,
        pageStart: 1
    },
    stockCarInfoList: [],
    msrp: 0,
    loadingShow: true,
    enableSelectCar: true,
    loadingNoData: false,
    showBandAndSeries: true,
    pager: {
        pageNo: 0,
        pageSize: 15,
        total: 0,
        totalPages: 1
    }
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
