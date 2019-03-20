import api from '../../common/api'
import config from '../../common/config'
import * as types from './mutation-types'

export const setCarInfo = ({ state, commit, dispatch }, params) => {
    let oldCarInfo = state.carInfo
    let carInfo = params
    carInfo.orderNo = oldCarInfo.orderNo
    carInfo.storeCode = params.storeCode
    carInfo.storeName = params.storeName
    carInfo.carOrderNo = oldCarInfo.carOrderNo
    carInfo.carOrderDetailCode = oldCarInfo.carOrderDetailCode
    commit(types.CARINFO_SET_CAR_INFO, {
        carInfo
    })
}

export const mommitIsStore = ({ commit }, params) => {
  commit(types.IS_STORE, params)
}

export const storeCode = ({commit}, params) => {
    commit(types.STORE_CODE, params)
}

export const setStore = ({commit}, params) => {
  commit(types.SET_STORE, params)
}

export const resetCarInfo = ({ state, commit, dispatch }, params) => {
    let oldCarInfo = state.carInfo
    let carInfo = {
        actualSalesPrice: null,
        additionalFee: null,
        discount: null,
        afterDiscountPrice: null,
        carFactoryCode: oldCarInfo.carFactoryCode,
        carBrandCode: oldCarInfo.carBrandCode,
        carSeriesCode: oldCarInfo.carSeriesCode,
        carModelCode: oldCarInfo.carModelCode,
        carCode: oldCarInfo.carCode,
        displayName: oldCarInfo.displayName,
        skuCode: '',
        orderNo: oldCarInfo.orderNo,
        carOrderNo: oldCarInfo.carOrderNo,
        carOrderDetailCode: oldCarInfo.carOrderDetailCode,
        pageNums: config.pageNums,
        pageStart: 1
    }
    let actualMSRPInclusiveTax = null
    commit(types.CARINFO_SET_CAR_INFO, {
        carInfo
    })
    commit(types.CARINFO_SET_CAR_MSRP, {
        actualMSRPInclusiveTax
    })
}

export const resetMsrp = ({ state, commit, dispatch }, params) => {
    let actualMSRPInclusiveTax = null
    commit(types.CARINFO_SET_CAR_MSRP, {
        actualMSRPInclusiveTax
    })
}

export const clearCarInfo = ({ state, commit, dispatch }, params) => {
    let oldCarInfo = state.carInfo
    let carInfo = {
        actualSalesPrice: null,
        additionalFee: null,
        discount: null,
        afterDiscountPrice: null,
        carFactoryCode: '',
        carBrandCode: '',
        carSeriesCode: '',
        carModelCode: '',
        carCode: '',
        displayName: '',
        skuCode: '',
        orderNo: oldCarInfo.orderNo,
        carOrderNo: oldCarInfo.carOrderNo,
        carOrderDetailCode: oldCarInfo.carOrderDetailCode,
        pageNums: config.pageNums,
        pageStart: 1,
        storeCode: state.store.code
    }
    if (params && (params.condition === config.order.carInfo.hideBandAndSeries)) {
        carInfo.cycleKey = state.carInfo.cycleKey
    }
    let actualMSRPInclusiveTax = null
    commit(types.CARINFO_SET_CAR_INFO, {
        carInfo
    })
    commit(types.CARINFO_SET_CAR_MSRP, {
        actualMSRPInclusiveTax
    })
    if (!params) {
       commit(types.CARINFO_SHOW_BAND_AND_SERIES_CONDITION)
    }
}

export const selectCarInfo = ({ state, commit, dispatch }, index) => {
    let oldCarInfo = state.carInfo
    let carInfo = state.stockCarInfoList[index]
    carInfo.orderNo = oldCarInfo.orderNo
    carInfo.carOrderNo = oldCarInfo.carOrderNo
    carInfo.carOrderDetailCode = oldCarInfo.carOrderDetailCode
    commit(types.CARINFO_SET_CAR_INFO, {
        carInfo
    })
}

export const getUserInfo = ({ commit }, params) => {
    api.getUserInfo
        .getUserAvailableInfo((res) => {
            let userInfo = res.data.obj
            params.callback(userInfo)
        })
}

export const getMsrp = ({ state, commit, dispatch }, params) => {
    api.clearingsettlement
        .carOrderInfo
        .getMsrp(params, (res) => {
            if (res.data.code === 'success') {
                let actualMSRPInclusiveTax = res.data.obj.msrp
                commit(types.CARINFO_SET_CAR_MSRP, {
                    actualMSRPInclusiveTax
                })
            }
        })
}

export const getDataRefDetails = ({ commit, dispatch }, params) => {
    dispatch('getUserInfo', {
        callback: (userInfo) => {
            api.getDataDetails({refDetailCode: 'stockDisplayType'}).then((res) => {
                params.callback(userInfo, res.data.obj.refDetailValue);
            });
        }
    })
}

export const getSkuInfoList = ({ state, commit, dispatch }, params) => {
    dispatch('getDataRefDetails', {
        callback: (userInfo, refDetailValue) => {
            commit(types.CARINFO_SHOW_LOADING)
            if(state.store.code) {
              params.storeCode = state.store.code
            } else if(userInfo.storeInfoVo.storeCode) {
              params.storeCode = userInfo.storeInfoVo.storeCode
            } else {
              params.storeCode = state.carInfo.storeCode
            }
            params.carFactoryCode = state.carInfo.carFactoryCode
            params.carBrandCode = state.carInfo.carBrandCode
            params.carSeriesCode = state.carInfo.carSeriesCode
            params.carModelCode = state.carInfo.carModelCode
            params.carCode = state.carInfo.carCode
            params.carVinNo = state.carInfo.carVinNo
            params.carAppertanceName = state.carInfo.carAppertanceName
            params.carInteriorName = state.carInfo.carInteriorName
            params.logisticsStatus = state.carInfo.logisticsStatus
            params.skuType = config.order.carInfo.skuType
            params.salesStatus = 0
            params.cycleKey = state.carInfo.cycleKey
            api.skuInfo.query(params, (res) => {
                    if (res.data.code === 'success') {
                        let stockCarInfoList = []
                        let list = []
                        let obj = res.data.obj
                        if (obj) {
                            list = obj.list
                        }
                        if (!list.length) {
                            let loadingNoData = true
                            commit(types.CARINFO_SET_LOAD_NO_DATA, {
                                loadingNoData
                            })
                        }
                        if (list != null) {
                            list.forEach((item) => {
                                let skuCode = item.skuCode
                                let skuAddInfoVoList = item.skuAddInfoVoList
                                if (skuAddInfoVoList != null && skuAddInfoVoList.length > 0) {
                                    let orderAddInfos = []
                                    skuAddInfoVoList.forEach((skuAddInfo) => {
                                        let orderAddInfo = {}
                                        switch (skuAddInfo.addCode) {
                                            case config.order.carInfo.skuAddInfos.carAppertanceName.refCode:
                                                item.carAppertanceName = skuAddInfo.addValue
                                                orderAddInfo = {
                                                    addCode: config.order.carInfo.carAppertanceName.refCode,
                                                    addName: 'carAppertanceName',
                                                    addValue: skuAddInfo.addValue
                                                }
                                                orderAddInfos.push(orderAddInfo)
                                                break;
                                            case config.order.carInfo.skuAddInfos.carInteriorName.refCode:
                                                item.carInteriorName = skuAddInfo.addValue
                                                orderAddInfo = {
                                                    addCode: config.order.carInfo.carInteriorName.refCode,
                                                    addName: 'carInteriorName',
                                                    addValue: skuAddInfo.addValue
                                                }
                                                orderAddInfos.push(orderAddInfo)
                                                break;
                                            case config.order.carInfo.skuAddInfos.actualMSRPInclusiveTax.refCode:
                                                item.actualMSRPInclusiveTax = skuAddInfo.addValue
                                                break;
                                            case config.order.carInfo.skuAddInfos.originalAddition.refCode:
                                                item.originalAddition = skuAddInfo.addValue
                                                break;
                                        }
                                    })
                                    item.orderAddInfos = orderAddInfos
                                    item.refDetailValue = refDetailValue
                                    stockCarInfoList.push(item)
                                }
                            })
                            let pager = {
                                pageNo: res.data.obj.pageNum,
                                pageSize: res.data.obj.pageSize,
                                total: res.data.obj.total,
                                totalPages: res.data.obj.pages
                            }
                            commit(types.CARINFO_ATTACH_STOCK_INFO_LIST, {
                                stockCarInfoList
                            })
                            commit(types.CARINFO_SET_PAGER, {
                                pager
                            })
                        }
                        params.callback && params.callback();
                    }
                    commit(types.CARINFO_HIDE_LOADING)
                })
        }
    })
}

export const resetStockCarInfoList = ({ commit }, params) => {
    let stockCarInfoList = []
    let loadingNoData = false
    commit(types.CARINFO_GET_STOCK_INFO_LIST, {
        stockCarInfoList
    })
    commit(types.CARINFO_SET_LOAD_NO_DATA, {
        loadingNoData
    })
    commit(types.CARINFO_HIDE_LOADING)
}

export const insertCarOrderInfo = ({ commit }, params) => {
    let carInfo = params.carInfo
    api.clearingsettlement
        .carOrderInfo
        .insertCarOrderInfo(carInfo, (res) => {
            if (res.data.code === 'success') {
                carInfo.callback()
            }
        })
}

export const getCarOrderInfoByOrderNo = ({ state, commit, dispatch }, params) => {
    api.clearingsettlement
        .carOrderInfo
        .getCarOrderInfoByOrderNo(params, (res) => {
            if (res.data.code === 'success') {
                let obj = res.data.obj 
                let carInfo = obj.carOrderDetailInfoList[0]
                carInfo.isDeceitedCar = false
                if (carInfo != null) {
                    carInfo.carVinNo = carInfo.vinNo
                    carInfo.productionCode = carInfo.productionNo
                    carInfo.displayName = carInfo.carName
                    let skuInfo = carInfo.skuInfo
                    if (skuInfo != null) {
                        carInfo.logisticsStatus = skuInfo.logisticsStatus
                        let skuAddInfoVoList = skuInfo.skuAddInfoVoList
                        if (skuAddInfoVoList != null && skuAddInfoVoList.length > 0) {
                            skuAddInfoVoList.forEach((skuAddInfo) => {
                                switch (skuAddInfo.addCode) {
                                    case config.order.carInfo.skuAddInfos.originalAddition.refCode:
                                        carInfo.originalAddition = skuAddInfo.addValue
                                        break;
                                    case config.order.carInfo.skuAddInfos.deceitCarAddCode.refCode:
                                        carInfo.isDeceitedCar = true
                                        break;
                                }
                            })
                        }
                    }
                    let orderAddInfos = carInfo.orderAddInfos
                    if (orderAddInfos != null && orderAddInfos.length > 0) {
                        orderAddInfos.forEach((skuAddInfo) => {
                            switch (skuAddInfo.addCode) {
                                case config.order.carInfo.carAppertanceName.refCode:
                                    carInfo.carAppertanceName = skuAddInfo.addValue
                                    break;
                                case config.order.carInfo.carInteriorName.refCode:
                                    carInfo.carInteriorName = skuAddInfo.addValue
                                    break;
                            }
                        })
                    }
                    commit(types.CARINFO_SET_CAR_INFO, {
                        carInfo
                    })
                    if (obj.currentOrderWfTypeCode == config.order.wfType.intentionOrder.code) {
                        params.hideMrsp = true
                        let actualMSRPInclusiveTax = params.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].msrp
                        commit(types.CARINFO_SET_CAR_MSRP, {
                            actualMSRPInclusiveTax
                        })
                    }
                    if (params.hideMrsp) {
                        return
                    }
                    dispatch('getMsrp', {
                        carFactoryCode: carInfo.carFactoryCode,
                        carBrandCode: carInfo.carBrandCode,
                        carModelCode: carInfo.carModelCode,
                        carSeriesCode: carInfo.carSeriesCode,
                        carCode: carInfo.carCode,
                        skuCode: carInfo.skuCode
                    })
                }
            }
        })

}

export const updateCarOrderInfo = ({ commit }, params) => {
    api.clearingsettlement
        .carOrderInfo
        .updateCarOrderInfo(params.carInfo, (res) => {
            if (res.data.code === 'success') {
                params.callback()
            }
        })
}

export const enableSelectCarInfo = ({ commit }, params) => {
    commit(types.CARINFO_ENABLE_SELECT_CAR_INFO)
}

export const disabledSelectCarInfo = ({ commit }, params) => {
    commit(types.CARINFO_DISABLED_SELECT_CAR_INFO)
}

export const showBandAndSeriesCondition = ({ commit }, params) => {
    commit(types.CARINFO_SHOW_BAND_AND_SERIES_CONDITION)
}

export const hideBandAndSeriesCondition = ({ commit }, params) => {
    commit(types.CARINFO_HIDE_BAND_AND_SERIES_CONDITION)
}
