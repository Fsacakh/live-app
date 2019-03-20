import api from '../../common/api'
import config from '../../common/config'
import * as types from './mutation-types'

export const getGPConfig = ({ commit }, params) => {
    api.ref.getDataDictionary(params.poros, res => {
        if (res.data.code == "success") {
            let gpInfo = []
            let data = res.data.obj.referenceDetailInfos
            data.forEach((item, index) => {
                let num = Number(item.refDetailRemark) - 1
                gpInfo[num] = item
            })
            commit(types.GET_GP_CONFIG, gpInfo)
            params.callBack(res)
        }
    })
}

export const getOrderInfo = ({ commit }, params) => {
    api.clearingsettlement.correlation.getOrderInfo(params.poros, (res) => {
        if (res.data.code == "success") {
            let orderInfo = res.data.obj
            commit(types.GET_ORDER_INFO, orderInfo)
            params.callBack(res)
        }
    })
}

export const addOrderInfo = ({ commit }, params) => {
    api.clearingsettlement.correlation.insertOrderInfo(params.poros, (res) => {
        if (res.data.code == "success") {
            params.callBack(res)
        }
    })
}

export const getOrderNo = ({ commit }, params) => {
    let newParams = config.order.sequence
    api.ordinalInfo
        .getSequence(newParams, (res) => {
            if (res.data.code === 'success') {
                let orderNo = res.data.obj
                commit(types.ORDER_GET_ORDER_NO, {
                    orderNo
                })
                params.callback(orderNo)
            }
        })
}

export const setOrderInfo = ({ state, commit, dispatch }, params) => {
    let order = params
    //let carOrderDetailInfo = order.carOrderInfoVoList[0].carOrderDetailInfoList[0]
    let carOrderDetailInfo = order.carOrderDetailInfoList[0]
    let orderAddInfos = []
    //orderAddInfos = order.carOrderInfoVoList[0].carOrderDetailInfoList[0].orderAddInfos
    orderAddInfos = order.carOrderDetailInfoList[0].orderAddInfos
    if (orderAddInfos != null && orderAddInfos.length > 0) {
        orderAddInfos.forEach((item) => {
            switch (item.addName) {
                case 'carAppertanceName':
                    carOrderDetailInfo.carAppertanceName = item.addValue
                    break;
                case 'carInteriorName':
                    carOrderDetailInfo.carInteriorName = item.addValue
                    break;
                case 'standardMSRPInclusiveTax':
                    carOrderDetailInfo.standardMSRPInclusiveTax = item.addValue
                    break;
                case 'originalAddition':
                    carOrderDetailInfo.originalAddition = item.addValue
                    break;
            }
        })
    }
    commit(types.ORDER_SET_ORDER_INFO, {
        order
    })
}

export const setCarOrderInfo =  ({ state, commit, dispatch }, params) => {
    let order = params
    let carOrderDetailInfo = order.carOrderInfoVoList[0].carOrderDetailInfoList[0]
    let orderAddInfos = []
    orderAddInfos = order.carOrderInfoVoList[0].carOrderDetailInfoList[0].orderAddInfos
    if (orderAddInfos != null && orderAddInfos.length > 0) {
        orderAddInfos.forEach((item) => {
            switch (item.addName) {
                case 'carAppertanceName':
                    carOrderDetailInfo.carAppertanceName = item.addValue
                    break;
                case 'carInteriorName':
                    carOrderDetailInfo.carInteriorName = item.addValue
                    break;
                case 'standardMSRPInclusiveTax':
                    carOrderDetailInfo.standardMSRPInclusiveTax = item.addValue
                    break;
                case 'originalAddition':
                    carOrderDetailInfo.originalAddition = item.addValue
                    break;
            }
        })
    }
    commit(types.ORDER_SET_ORDER_INFO, {
        order
    })
}

export const clearOrderInfo = ({ state, commit, dispatch }, params) => {
    let order = {
        orderAddInfos: [],
        carOrderInfoVoList: [{
            totalActualSalesPrice: 0,
            carOrderDetailInfoList: [
                {
                    carBrandCode: '',
                    carBrandName: '',
                    carSeriesCode: '',
                    carSeriesName: '',
                    actualSalesPrice: 0,
                    accountTypeCode: '',
                    orderNo: ''
                }
            ],
        }],
        insuranceOrderInfoVoList: [],
        skuOrderInfoVoList: [],
        skuOrderTotalInfoVoList: [{
            totalActualSalesPrice: 0
        }],
        orderPromotionInfoVoList: [],
        orderSubstitutionInfoVoList: [],
        orderServiceFeeInfoVoList: [],
        orderInfo: {},
        actualTotalPrice: 0
    }
    commit(types.ORDER_SET_ORDER_INFO, {
        order
    })
}

export const insertOrderInfo = ({ commit }, params) => {
    let order = params.order
    api.clearingsettlement
        .order
        .insertOrder(order, (res) => {
            if (res.data.code === 'success') {
                let order = res.data.obj
                let orderNo = res.data.obj.orderInfo.orderNo
                commit(types.ORDER_SET_ORDER_INFO, {
                    order
                })
                params.sc(orderNo)
            } else if (res.data.code === 'fail') {
                params.fc()
            }
        })
}

export const queryOrderInfoVosByCodeFromDB = ({ commit }, params) => {
    api.clearingsettlement.order.queryOrderInfoVosByCodeFromDB(params, (res) => {
            if (res.data.code === 'success') {
                let order = res.data.obj
                order.financeServiceFee_rate = order.financeServiceFeeRate
                let carInfo = order.carOrderInfoVoList[0].carOrderDetailInfoList[0]
                let orderAddInfos = carInfo.orderAddInfos
                let orderAddInfosList = res.data.obj.orderAddInfos
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
                if (orderAddInfosList != null && orderAddInfosList.length > 0) {
                    orderAddInfosList.forEach((orderAddInfo) => {
                        order[orderAddInfo.addCode] = orderAddInfo.addValue
                        switch (orderAddInfo.addCode) {
                            case config.order.snp:
                                order.SNPCODE = orderAddInfo.addValue
                                break;
                            case config.order.gp1:
                                order.GP1_value = orderAddInfo.addValue
                                break;
                            case config.order.gp1_rate:
                                order.GP1_rate = orderAddInfo.addValue
                                break;
                            case config.order.gp2:
                                order.GP2_value = orderAddInfo.addValue
                                break;
                            case config.order.gp2_rate:
                                order.GP2_rate = orderAddInfo.addValue
                                break;
                            case config.order.gp15:
                                order.GP15_value = orderAddInfo.addValue
                                break;
                            case config.order.GP15_rate:
                                order.GP15_rate = orderAddInfo.addValue
                                break;
                            case config.order.gp3_rate:
                                order.GP3_rate = orderAddInfo.addValue
                                break;
                            case config.order.gp4:
                                order.GP4_value = orderAddInfo.addValue
                                break;
                            case config.order.gp4_rate:
                                order.GP4_rate = orderAddInfo.addValue
                                break;
                            case config.order.gp45:
                                order.GP45_value = orderAddInfo.addValue
                                break;
                            case config.order.gp45perc:
                                order.GP45_rate = orderAddInfo.addValue
                                break;
                            case config.order.orderAddInfoPlateType:
                                order.orderAddInfoPlateType = orderAddInfo.addValueName
                                break;
                            case config.order.orderAddInfoSalesType:
                                order.orderAddInfoSalesType = orderAddInfo.addValueName
                                break;
                            case config.order.noSkuReason:
                                order.noSkuReasonId = orderAddInfo.id
                                order.noSkuReasonName = orderAddInfo.addValueName
                                order.noSkuReasonCode = orderAddInfo.addValue
                                break;
                        }
                    })
                }
                commit(types.ORDER_SET_ORDER_INFO, {
                    order
                })
            }
        })
}

export const submitOrderInfoForNewCarSales = ({ state, commit, dispatch }, params) => {
    api.clearingsettlement
        .order
        .submitOrderInfoForNewCarSales(params, (res) => {
            if (res.data.code === 'success') {
                let orderNo = params.orderNo
                dispatch('queryOrderInfoVosByCodeFromDB', {
                    orderNo: orderNo,
                    allSubOrderFlag: true,
                    ignoreDefault: 1
                })
                dispatch('queryOrderWfDetailInfo', {
                    orderNo: orderNo
                })
                dispatch('queryOrderWfInfoByOrderNo', {
                    orderNoSet: [
                        orderNo
                    ]
                })
            }
        })
}

export const withdrawOrderInfoForNewCarSales = ({ state, commit, dispatch }, params) => {
    api.clearingsettlement
        .order
        .withdrawOrderInfoForNewCarSales(params, (res) => {
            if (res.data.code === 'success') {
                let orderNo = params.orderNo
                dispatch('queryOrderInfoVosByCodeFromDB', {
                    orderNo: orderNo,
                    allSubOrderFlag: true,
                    ignoreDefault: 1
                })
                dispatch('queryOrderWfDetailInfo', {
                    orderNo: orderNo
                })
                dispatch('queryOrderWfInfoByOrderNo', {
                    orderNoSet: [
                        orderNo
                    ]
                })
            }
        })
}

export const finishCar = ({ state, commit, dispatch }, params) => {
    api.clearingsettlement
        .order
        .finishCar(params, (res) => {
            if (res.data.code === 'success') {
                let orderNo = params.orderNo
                dispatch('queryOrderInfoVosByCodeFromDB', {
                    orderNo: orderNo,
                    allSubOrderFlag: true,
                    ignoreDefault: 1
                })
                dispatch('queryOrderWfDetailInfo', {
                    orderNo: orderNo
                })
                dispatch('queryOrderWfInfoByOrderNo', {
                    orderNoSet: [
                        orderNo
                    ]
                })
            }
        })
}

export const queryOrderWfDetailInfo = ({ state, commit, dispatch }, params) => {
    api.orderApprove
        .queryOrderWfDetailInfo(params, (res) => {
            if (res.data.code === 'success') {
                let list = res.data.obj
                let orderApproves = []
                if (list != null && list.length > 0) {
                    list.forEach((item) => {
                        orderApproves.push({
                            navTitle: item.orderTypeName,
                            title: item.nodeName,
                            time: item.updateTimeStr,
                            scName: item.operatorName,
                            remark: item.remark,
                            nodeStatus: item.nodeStatus,
                            nodeType: item.nodeType,
                            orderTypeCode: item.orderTypeCode,
                            wfCode: item.wfCode,
                        })
                    })
                    commit(types.ORDER_SET_ORDER_APPROVE_HISTORY, {
                        orderApproves
                    })
                }
            }
        })
}

export const queryOrderWfInfoByOrderNo = ({ state, commit, dispatch }, params) => {
    api.clearingsettlement
        .order
        .queryOrderWfInfoByOrderNo(params, (res) => {
            if (res.data.code === 'success') {
                let orderwfInfo = res.data.obj[0]
                if (orderwfInfo != undefined) {
                    commit(types.ORDER_GET_WORK_FLOW_INFO, {
                        orderwfInfo
                    })
                }
            }
        })
}

export const setCarActualSalesPrice = ({ commit }, params) => {
    let actualSalePrice = params.actualSalePrice
    commit(types.ORDER_SET_CAR_ACTUAL_SALES_PRICE, {
        actualSalePrice
    })
}

export const getUserPermissionsInfo = ({ commit }, params) => {
    api.login
        .getLoginInfo()
        .then((res) => {
            if (res.data.code === 'success') {
                if (res.data.obj.postnTypes != undefined && res.data.obj.postnTypes != null) {
                    let isSc = false
                    let postnTypes = new Set(res.data.obj.postnTypes)
                    if (postnTypes.has(config.root.scPostTypeCode)) {
                        isSc = true                                   //为true时是销售顾问
                    } else if (postnTypes.has(config.root.smPostTypeCode)) {
                        isSc = false                                    //为false时是销售经理
                    }
                    commit(types.ORDER_SET_IS_SC, {
                        isSc
                    })
                }
            }
        })
}

export const resetIsSc = ({ commit }, params) => {
    let isSc = false
    commit(types.ORDER_SET_IS_SC, {
        isSc
    })
}

export const getGpApperance = ({ state, commit, dispatch }, params) => {
    dispatch('getUserInfo', {
        callback: (userInfo) => {
            params.storeCode = userInfo.storeInfoVo.storeCode
            dispatch('getGpConverConfig', {
                callback: () => {
                    dispatch('getGpApperanceBeforeOneWeek', params)
                    dispatch('getGpApperanceCurrentMonth', params)
                }
            })
        }
    })
}

export const getGpApperanceBeforeOneWeek = ({ state, commit, dispatch }, params) => {
    api.clearingsettlement
        .order
        .queryGpApperanceBeforeOneWeek(params, (res) => {
            if (res.data.code === 'success') {
                let gpApprance = {
                }
                let gpNameSet = new Set(state.gpList)
                let gpAppranceList = res.data.obj
                gpAppranceList.forEach((orderAddInfo) => {
                    if (gpNameSet.has(orderAddInfo.gpName.replace('_rate', '%'))) {
                        gpApprance[orderAddInfo.gpName] = orderAddInfo.gpValue
                    } else {
                        gpApprance[orderAddInfo.gpName] = 0
                    }
                })
                commit(types.ORDER_GET_GP_APPRANCE_ONE_WEEK, {
                    gpApprance
                })
            }
        })
}

export const getGpApperanceCurrentMonth = ({ state, commit, dispatch }, params) => {
    api.clearingsettlement
        .order
        .queryGpApperanceCurrentMonth(params, (res) => {
            if (res.data.code === 'success') {
                let gpApprance = {
                }
                let gpNameSet = new Set(state.gpList)
                let gpAppranceList = res.data.obj
                gpAppranceList.forEach((orderAddInfo) => {
                    if (gpNameSet.has(orderAddInfo.gpName.replace('_rate', '%'))) {
                        gpApprance[orderAddInfo.gpName] = orderAddInfo.gpValue
                    } else {
                        gpApprance[orderAddInfo.gpName] = 0
                    }
                })
                commit(types.ORDER_GET_GP_APPRANCE_ONE_MONTH, {
                    gpApprance
                })
            }
        })
}

export const getGpConverConfig = ({ state, commit, dispatch }, params) => {
    api.ref
        .getDataDictionary({
            refCode: config.order.gpConverType
        }, (res) => {
            if (res.data.code === 'success') {
                let gpList = []
                let referenceDetailInfos = res.data.obj.referenceDetailInfos
                referenceDetailInfos.forEach((referenceDetailInfo) => {
                    gpList.push(referenceDetailInfo.refDetailName + '%')
                })
                gpList.sort((a, b) => {
                    return (a > b ? 1: -1)
                })
                commit(types.ORDER_GET_GP_LIST, {
                    gpList
                })
                params.callback()
            }
        })
}

export const getUserInfo = ({ commit }, params) => {
    api.getUserInfo
        .getUserAvailableInfo((res) => {
            let userInfo = res.data.obj
            params.callback(userInfo)
        })
}

export const getSelCouponMoney = ({ state, commit }, params) => {
    if(state.isSc){
        commit(types.ORDER_USE)
    }else{
        api.getCouponInfo.getSelectCouponMoney( params ,(res) => {
            if(res.data.code === 'success'){
                let money = res.data.obj.num
                commit(types.ORDER_MONEY, {
                    money
                })
            }
        })
    }

}
