import api from '../../common/api'
import config from '../../common/config'
import _ from '../../common/common'
import * as types from './mutation-types'

export const getUserInfo = ({ commit }, params) => {
    api.getUserInfo.getUserAvailableInfo((res) => {
            let userInfo = res.data.obj
            params.callback(userInfo)
        })
}

export const getFinanceProList = ({ state, commit, dispatch }, params) => {
    dispatch('getUserInfo', {
        callback: (userInfo) => {
            commit(types.FINANCEPRO_SHOW_LOADING)
            params.storeCode = userInfo.storeInfoVo.storeCode
            api.clearingsettlement
                .finance
                .queryDetailInfoByCarInfo(params, (res) => {
                    if (res.data.code === 'success') {
                        let obj = res.data.obj
                        let list = []
                        if (!obj) {
                            let loadingNoData = true
                            commit(types.FINANCEPRO_ATTACH_DETAIL_INFO_LIST, {
                                list
                            })
                            commit(types.FINANCEPRO_SET_LOAD_NO_DATA, {
                                loadingNoData
                            })
                        } else {
                            list = obj.list
                        }
                        if (!list || !list.length) {
                            let loadingNoData = true
                            commit(types.FINANCEPRO_SET_LOAD_NO_DATA, {
                                loadingNoData
                            })
                        }
                        if (list != null) {
                            let pager = {
                                pageNo: res.data.obj.pageNum,
                                pageSize: res.data.obj.pageSize,
                                total: res.data.obj.total,
                                totalPages: res.data.obj.pages
                            }
                            commit(types.FINANCEPRO_ATTACH_DETAIL_INFO_LIST, {
                                list
                            })
                            commit(types.FINANCEPRO_SET_PAGER, {
                                pager
                            })
                        }
                    }
                    commit(types.FINANCEPRO_HIDE_LOADING)
                })
        }
    })
}

export const getFinanceProByPriorityLevel = ({ state, commit, dispatch }, params) => {
    dispatch('getUserInfo', {
        callback: (userInfo) => {
            params.storeCode = userInfo.storeInfoVo.storeCode
            api.clearingsettlement
                .finance
                .queryDetailInfoByCarInfo(params, (res) => {
                    if (res.data.code === 'success') {
                        let list = res.data.obj.list
                        let orderNo = params.orderNo
                        let actualSalesPrice = params.actualSalesPrice
                        if (list != null && list.length > 0) {
                            let financialOrderDetailInfo = list[0]
                            let financeProDetailInfo = {
                                orderNo: orderNo,
                                financialOrderNo: '',
                                financialOrderDetailInfo: {
                                    orderNo: orderNo,
                                    financialOrderNo: '',
                                    financeDetailCode: financialOrderDetailInfo.financeDetailCode ? financialOrderDetailInfo.financeDetailCode : '',
                                    financialOrderDetailCode: financialOrderDetailInfo.financialOrderDetailCode ? financialOrderDetailInfo.financialOrderDetailCode : '',
                                    financeName: financialOrderDetailInfo.financeName ? financialOrderDetailInfo.financeName : '',
                                    financeCode: financialOrderDetailInfo.financeCode ? financialOrderDetailInfo.financeCode : '',
                                    financeTypeCode: financialOrderDetailInfo.financeType,
                                    financeTypeName: financialOrderDetailInfo.financeTypeName,
                                    loanTypeCode: financialOrderDetailInfo.loanType,
                                    loanTypeName: financialOrderDetailInfo.loanTypeName,
                                    financeOrgCode: financialOrderDetailInfo.financeOrgCode,
                                    financeOrgName: financialOrderDetailInfo.financeOrgName,
                                    downpaymentType: financialOrderDetailInfo.downpaymentType,
                                    downPaymentAmount: financialOrderDetailInfo.downpaymentType == 0 ? financialOrderDetailInfo.downpaymentMin : (actualSalesPrice * financialOrderDetailInfo.downpaymentMin).toFixed(2),
                                    downpaymentMin: _.filterIsPercent(financialOrderDetailInfo.downpaymentType, financialOrderDetailInfo.downpaymentMin),
                                    downpaymentMax: _.filterIsPercent(financialOrderDetailInfo.downpaymentType, financialOrderDetailInfo.downpaymentMax),
                                    bpIsPercent: financialOrderDetailInfo.bpIsPercent,
                                    balancePaymentValue: financialOrderDetailInfo.bpIsPercent == 0 ? financialOrderDetailInfo.balancePaymentMinValue : (actualSalesPrice * financialOrderDetailInfo.balancePaymentMinValue).toFixed(2),
                                    balancePaymentMinValue: _.filterIsPercent(financialOrderDetailInfo.bpIsPercent, financialOrderDetailInfo.balancePaymentMinValue),
                                    balancePaymentMaxValue: _.filterIsPercent(financialOrderDetailInfo.bpIsPercent, financialOrderDetailInfo.balancePaymentMaxValue),
                                    valueOfLoan: 0,
                                    rateType: financialOrderDetailInfo.rateType,
                                    taxRate: parseFloat(financialOrderDetailInfo.rates * 100).toFixed(2),
                                    cycleMonth: financialOrderDetailInfo.cycleMonth,
                                    payForMonth: 0,
                                    repaymentMethod: '',
                                    cautionMoney: financialOrderDetailInfo.dfInPercent == 0 ? financialOrderDetailInfo.depositFree : (actualSalesPrice * financialOrderDetailInfo.depositFree).toFixed(2),
                                    finalMileage: financialOrderDetailInfo.finalMileage,
                                    evIsPercent: financialOrderDetailInfo.evIsPercent,
                                    finalValue: financialOrderDetailInfo.evIsPercent == 0 ? financialOrderDetailInfo.endingValue : (actualSalesPrice * financialOrderDetailInfo.endingValue).toFixed(2),
                                    remark: ''
                                }
                            }
                            if (financialOrderDetailInfo.tDetailIntersubsidyInfoList != null && financialOrderDetailInfo.tDetailIntersubsidyInfoList.length > 0) {
                                financeProDetailInfo.financialOrderDetailInfo.storeInPercent = financialOrderDetailInfo.tDetailIntersubsidyInfoList[0].dealerInPercent
                                financeProDetailInfo.financialOrderDetailInfo.storeSubsidyInterest = (financialOrderDetailInfo.tDetailIntersubsidyInfoList[0].dealerInPercent == 0 ? financialOrderDetailInfo.tDetailIntersubsidyInfoList[0].dealerIntersubsidyValue : (actualSalesPrice * financialOrderDetailInfo.tDetailIntersubsidyInfoList[0].dealerIntersubsidyValue).toFixed(2))
                                financeProDetailInfo.financialOrderDetailInfo.financeInPercent = financialOrderDetailInfo.tDetailIntersubsidyInfoList[0].isPercent
                                financeProDetailInfo.financialOrderDetailInfo.financeSubsidyInterest = (financialOrderDetailInfo.tDetailIntersubsidyInfoList[0].isPercent == 0 ? financialOrderDetailInfo.tDetailIntersubsidyInfoList[0].intersubsidyValue : (actualSalesPrice * financialOrderDetailInfo.tDetailIntersubsidyInfoList[0].intersubsidyValue).toFixed(2))
                            }
                            financeProDetailInfo.financialOrderDetailInfo.valueOfLoan = (actualSalesPrice - financeProDetailInfo.financialOrderDetailInfo.downPaymentAmount).toFixed(2)
                            if (financeProDetailInfo.financialOrderDetailInfo.taxRate >= 0 && financeProDetailInfo.financialOrderDetailInfo.cycleMonth > 1) {
                                let rateMonth = parseFloat(financeProDetailInfo.financialOrderDetailInfo.taxRate / 100) / 12
                                let cycleMonth = financeProDetailInfo.financialOrderDetailInfo.cycleMonth
                                let rateType = financeProDetailInfo.financialOrderDetailInfo.rateType
                                let valueOfLoan = (actualSalesPrice - financeProDetailInfo.financialOrderDetailInfo.downPaymentAmount - financeProDetailInfo.financialOrderDetailInfo.balancePaymentValue).toFixed(2)
                                if (rateMonth <= 0 && rateType == config.order.financePro.rateType.interest) {
                                    financeProDetailInfo.financialOrderDetailInfo.payForMonth = (valueOfLoan / cycleMonth).toFixed(2)
                                } else if (rateMonth > 0 && rateType == config.order.financePro.rateType.interest) {
                                    financeProDetailInfo.financialOrderDetailInfo.payForMonth = (valueOfLoan * rateMonth * Math.pow((1 + rateMonth), cycleMonth) / (Math.pow((1 + rateMonth), cycleMonth) - 1) + financeProDetailInfo.financialOrderDetailInfo.balancePaymentValue * rateMonth).toFixed(2)
                                } else {
                                    financeProDetailInfo.financialOrderDetailInfo.payForMonth = (valueOfLoan / cycleMonth + (valueOfLoan * rateMonth * 12 / cycleMonth)).toFixed(2)
                                }
                            }
                            commit(types.FINANCEPRO_SET_DETAIL_INFO, {
                                financeProDetailInfo
                            })
                        }
                    }
                })
        }
    })
}

export const resetFinanceProList = ({ commit }, params) => {
    let list = []
    let pager = {
        pageNo: 1,
        pageSize: 15,
        total: 0,
        totalPages: 0
    }
    let loadingNoData = false
    commit(types.FINANCEPRO_SET_LOAD_NO_DATA, {
        loadingNoData
    })
    commit(types.FINANCEPRO_SET_DETAIL_INFO_LIST, {
        list
    })
    commit(types.FINANCEPRO_SET_PAGER, {
        pager
    })
    commit(types.FINANCEPRO_HIDE_LOADING)
}

export const getFinanceTypes = ({ commit }, params) => {
    let newParams = { 'refCode': config.order.financePro.financeType.refCode }
    api.ref.getDataDictionary(newParams, (res) => {
            if (res.data.code === 'success') {
                let detailList = []
                let index = 0
                let arr = []
                arr = res.data.obj.referenceDetailInfos
                if (arr != null) {
                    if (params.hasAll) {
                        arr.unshift({
                            refDetailFatherCode: config.order.financePro.financeType.refDetailFatherCode,
                            refDetailName: '全部',
                            refDetailCode: ''
                        })
                    }
                    arr.forEach((item, index) => {
                        switch (item.refDetailFatherCode) {
                            case config.order.financePro.financeType.refDetailFatherCode:
                                let children = []
                                arr.forEach((arrItem) => {
                                    if (arrItem.refDetailFatherCode == item.refDetailCode) {
                                        children.push({
                                            text: arrItem.refDetailName,
                                            value: arrItem.refDetailCode
                                        })
                                    }
                                })
                                detailList.push({
                                    name: item.refDetailName,
                                    icon: '',
                                    value: item.refDetailCode,
                                    selectIndex: index,
                                    children: children
                                })
                                break;
                        }
                    })
                }
                params.callback(detailList)
            }
        })
}

export const getAuthorizationOrgs = ({ commit }, params) => {
    let empTokenKey = config.empTokenKey
    let newParams = { 'empToken': _.getCookie(empTokenKey) }
    api.clearingsettlement.finance.getAuthorizationOrgs(newParams, (res) => {
            if (res.data.code === 'success') {
                let detailList = []
                let arr = res.data.obj
                if (arr != null) {
                    if (params.hasAll) {
                        arr.unshift({
                            financeOrgName: '全部',
                            financeOrgCode: ''
                        })
                    }
                    arr.forEach((item, index) => {
                        detailList.push({
                            name: item.financeOrgName,
                            icon: '',
                            value: item.financeOrgCode,
                            selectIndex: index
                        })
                    })
                    params.callback(detailList)
                }
            }
        })
}

export const getRepaymentMethods = ({ commit }, params) => {
    let newParams = { 'refCode': config.order.financePro.repaymentMethod.refCode }
    api.ref.getDataDictionary(newParams, (res) => {
            if (res.data.code === 'success') {
                let detailList = []
                let index = 0
                let arr = res.data.obj.referenceDetailInfos
                arr.forEach((item, index) => {
                    detailList.push({
                        name: item.refDetailName,
                        icon: '',
                        value: item.refDetailCode,
                        selectIndex: index
                    })
                })
                params.callback(detailList)
            }
        })
}

export const getFinanceFailReasonTypes = ({ commit }, params) => {
    let newParams = { 'refCode': config.ref.financeFailReason }
    api.ref.getDataDictionary(newParams, (res) => {
            if (res.data.code === 'success') {
                let detailList = []
                let index = 0
                let arr = res.data.obj.referenceDetailInfos
                arr.forEach((item, index) => {
                    detailList.push({
                        name: item.refDetailName,
                        icon: '',
                        value: item.refDetailCode,
                        selectIndex: index
                    })
                })
                params.callback(detailList)
            }
        })
}

export const setFinanceDetailCode = ({ commit }, params) => {
    let financeDetailCode = params
    commit(types.FINANCEPRO_SET_FINANCE_DETAIL_CODE, {
        financeDetailCode
    })
}

export const insertFinancialOrderInfo = ({ state, commit, dispatch }, params) => {
    api.clearingsettlement.finance.insertFinancialOrderInfo(params.financeDetailInfo, (res) => {
            if (res.data.code === 'success') {
                params.callback()
            }
        })
}

// 新建订单后直接在报价单页面点击订单审批有关战败的请求
export const newEditFinancialOrderInfo = ({ state, commit, dispatch }, params) => {
    api.clearingsettlement.finance.newEditFinancialOrderInfo(params.financeDetailInfo, (res) => {
            if (res.data.code === 'success') {
                params.callback()
            }
        })
}

// 报价单-金融保存接口
export const updateFinancialOrderInfo = ({ state, commit, dispatch }, params) => {
    api.clearingsettlement.finance.editFinancialOrderInfoVo(params.financeDetailInfo, (res) => {
            if (res.data.code === 'success') {
                params.callback()
            }
        })
}

export const getFinancialOrderInfoByOrderNo = ({ state, commit, dispatch }, params) => {
    api.clearingsettlement.finance.getFinancialOrderInfoByOrderNo(params, (res) => {
            if (res.data.code === 'success') {
                let financeProDetailInfo = res.data.obj
                commit(types.FINANCEPRO_SET_DETAIL_INFO, {
                    financeProDetailInfo
                })
            }
        })
}

export const clearFinancialOrderInfo = ({ state, commit, dispatch }, params) => {
    let financeProDetailInfo = {
        financialOrderDetailInfo: {}
    }
    let financeDetailCode = ''
    commit(types.FINANCEPRO_SET_DETAIL_INFO, {
        financeProDetailInfo
    })
    commit(types.FINANCEPRO_SET_FINANCE_DETAIL_CODE, {
        financeDetailCode
    })
}

export const getFinanceWbCode = ({ state, commit, dispatch }, params) => {
    let newParams = config.financeWorkbenchInfo.sequence
    api.ordinalInfo.getSequence(newParams, (res) => {
            if (res.data.code === 'success') {
                let financeWbCode = res.data.obj
                params.callback(financeWbCode)
            }
        })
}

export const pushFinanceWorkbenchInfo = ({ state, commit, dispatch }, params) => {
    api.finWorkbench.pushFinanceWorkbenchInfo(params.financeWorkbenchInfo, (res) => {
            if (res.data.code === 'success') {
                params.callback()
            }
        })
}

export const getFinanceWorkbenchInfo = ({ state, commit, dispatch }, params) => {
    api.finWorkbench.getFinanceWorkbenchInfo(params, (res) => {
            if (res.data.code === 'success') {
                let financeWorkbenchInfo = res.data.obj
                if (financeWorkbenchInfo != null) {
                    commit(types.FINANCEPRO_SET_FINANCE_WORK_BENCH_INFO, {
                        financeWorkbenchInfo
                    })
                }
            }
        })
}
