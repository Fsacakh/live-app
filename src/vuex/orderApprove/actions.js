import api from '../../common/api'
import config from '../../common/config'
import * as types from './mutation-types'

export const getUserInfo = ({ commit }, params) => {
    api.getUserInfo
        .getUserAvailableInfo((res) => {
            let userInfo = res.data.obj
            params.callback(userInfo)
        })
}

export const insertOrderInfo = ({ commit }, params) => {
    commit(types.ORDERAPPROVE_SET_ORDER_INFO, params);
}

export const setApproved = ({ commit }) => {
    commit(types.ORDERAPPROVE_SET_APPROVED)
}

export const resetApproved = ({ commit }) => {
    commit(types.ORDERAPPROVE_RESET_APPROVED)
}

export const getSameAppertanceAndInteriorCar = ({ state, commit, dispatch }, params) => {
    dispatch('getUserInfo', {
        callback: (userInfo) => {
            dispatch('getSkuInfo', {
                skuInfo: {
                    skuCode: params.skuCode
                }, callback: (skuInfo) => {
                    params.storeCode = userInfo.storeInfoVo.storeCode
                    params.inStockSourceInvoiceBusinessCycle = (skuInfo.inStockSourceInvoiceBusinessCycle == null ? 0: skuInfo.inStockSourceInvoiceBusinessCycle) 
                    api.stockInfo
                        .queryCarStockOrderByStockAge(params, (res) => {
                            if (res.data.code === 'success') {
                                let carInfo = res.data.obj
                                if (carInfo != null) {
                                    carInfo.isDeceitedCar = false
                                    let skuAddInfoVos = carInfo.skuAddInfoVos
                                    if (skuAddInfoVos != null && skuAddInfoVos.length > 0) {
                                        skuAddInfoVos.forEach((skuAddInfo) => {
                                            switch (skuAddInfo.addCode) {
                                                case config.order.carInfo.skuAddInfos.carAppertanceName.refCode:
                                                    carInfo.carAppertanceName = skuAddInfo.addValue
                                                    break;
                                                case config.order.carInfo.skuAddInfos.carInteriorName.refCode:
                                                    carInfo.carInteriorName = skuAddInfo.addValue
                                                    break;
                                                case config.order.carInfo.skuAddInfos.actualMSRPInclusiveTax.refCode:
                                                    carInfo.actualMSRPInclusiveTax = skuAddInfo.addValue
                                                    break;
                                                case config.order.carInfo.skuAddInfos.originalAddition.refCode:
                                                    carInfo.originalAddition = skuAddInfo.addValue
                                                    break;
                                                case config.order.carInfo.skuAddInfos.deceitCarAddCode.refCode:
                                                    carInfo.isDeceitedCar = true
                                                    break;
                                            }
                                        })
                                    }
                                    dispatch('getDataRefDetails', {
                                        callback: (refDetailValue) => {
                                            carInfo.refDetailValue = refDetailValue
                                            commit(types.ORDERAPPROVE_GET_SAME_APPERANCE_AND_INTERIOR_CAR, {
                                                carInfo
                                            })
                                        }
                                    })
                                }
                            }
                        })
                }
            })
        }
    })
}

export const getSameAppertanceAndBrandCar = ({ state, commit, dispatch }, params) => {
    dispatch('getUserInfo', {
        callback: (userInfo) => {
            dispatch('getSkuInfo', {
                skuInfo: {
                    skuCode: params.skuCode
                }, callback: (skuInfo) => {
                    params.storeCode = userInfo.storeInfoVo.storeCode
                    params.inStockSourceInvoiceBusinessCycle = (skuInfo.inStockSourceInvoiceBusinessCycle == null ? 0: skuInfo.inStockSourceInvoiceBusinessCycle) 

                    api.stockInfo
                        .queryCarStockOrderByStockAge(params, (res) => {
                            if (res.data.code === 'success') {
                                let carInfo = res.data.obj
                                if (carInfo != null) {
                                    carInfo.isDeceitedCar = false
                                    let skuAddInfoVos = carInfo.skuAddInfoVos
                                    if (skuAddInfoVos != null && skuAddInfoVos.length > 0) {
                                        skuAddInfoVos.forEach((skuAddInfo) => {
                                            switch (skuAddInfo.addCode) {
                                                case config.order.carInfo.skuAddInfos.carAppertanceName.refCode:
                                                    carInfo.carAppertanceName = skuAddInfo.addValue
                                                    break;
                                                case config.order.carInfo.skuAddInfos.carInteriorName.refCode:
                                                    carInfo.carInteriorName = skuAddInfo.addValue
                                                    break;
                                                case config.order.carInfo.skuAddInfos.actualMSRPInclusiveTax.refCode:
                                                    carInfo.actualMSRPInclusiveTax = skuAddInfo.addValue
                                                    break;
                                                case config.order.carInfo.skuAddInfos.originalAddition.refCode:
                                                    carInfo.originalAddition = skuAddInfo.addValue
                                                    break;
                                                case config.order.carInfo.skuAddInfos.deceitCarAddCode.refCode:
                                                    carInfo.isDeceitedCar = true
                                                    break;
                                            }
                                        })
                                    }
                                    dispatch('getDataRefDetails', {
                                        callback: (refDetailValue) => {
                                            carInfo.refDetailValue = refDetailValue
                                            commit(types.ORDERAPPROVE_GET_SAME_APPERANCE_AND_INTERIOR_CAR, {
                                                carInfo
                                            })
                                        }
                                    })
                                }
                            }
                        })
                }
            })
        }
    })
}

export const getSkuInfo = ({ state, commit, dispatch }, params) => {
    api.skuInfo
        .query(params.skuInfo, (res) => {
            if (res.data.code === 'success') {
                let list = []
                let obj = res.data.obj
                if (obj) {
                    list = obj.list
                }
                if (list.length > 0) {
                    params.callback(list[0]) 
                }
            }
        })
}

export const getGpApperance = ({ state, commit, dispatch }, params) => {
    dispatch('getUserInfo', {
        callback: (userInfo) => {
            //params.storeCode = userInfo.storeInfoVo.storeCode
            api.clearingsettlement
                .order
                .queryGpApperanceBeforeOneWeek(params, (res) => {
                    if (res.data.code === 'success') {
                        api.clearingsettlement
                            .order
                            .queryGpApperanceCurrentMonth(params, (res) => {
                                if (res.data.code === 'success') {

                                }
                            })
                    }
                })
        }
    })
}

export const queryOrderInfoVosByCode = ({ commit }, params) => {
    api.orderApprove.queryOrderInfoVosByCode(params, function (res) {
        if (res != undefined) {
            if (res.data.code == 'success' && res.data.obj) {
                let orderApproveInfo = res.data.obj[0]
                commit(types.ORDERAPPROVE_SET_ORDER_APPROVE_INFO, {
                    orderApproveInfo
                })
            }
        }
    })
}

export const getOrderDerivativeProfit = ({ commit }, params) => {
    api.orderApprove.getOrderDerivativeProfit(params, function (res) {
        if (res != undefined) {
            if (res.data.code == 'success' && res.data.obj) {

                let derivativeProfit = res.data.obj                
                commit(types.ORDERAPPROVE_SET_ORDER_GETPROFIT, {
                    derivativeProfit
                })
            }
        }
    })
}

export const clearData = ({ commit }, params) => {
    let carInfo = {}
    commit(types.ORDERAPPROVE_GET_SAME_APPERANCE_AND_INTERIOR_CAR, {
        carInfo
    })
    commit(types.ORDERAPPROVE_GET_SAME_APPERANCE_AND_BRAND_CAR, {
        carInfo
    })
}

export const getDataRefDetails = ({ commit, dispatch }, params) => {
    api.getDataDetails({refDetailCode: 'stockDisplayType'}).then((res) => {
        params.callback(res.data.obj.refDetailValue);
    })
}