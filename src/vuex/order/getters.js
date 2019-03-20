export const getskuOrderTotalActualSalesPrice = (state) => {
    let price = 0
    if (state.order.skuOrderTotalInfoVoList && state.order.skuOrderTotalInfoVoList.length > 0 && state.order.skuOrderTotalInfoVoList[0]) {
        price = state.order.skuOrderTotalInfoVoList[0].totalActualSalesPrice.toFixed(2)
    } 
    return price
}

export const getTotalActualServiceFee = (state) => {
    let price = 0
    if (state.order.totalOrderServiceFeeInfoVo && state.order.totalOrderServiceFeeInfoVo.totalActualServiceFee > 0) {
        price = state.order.totalOrderServiceFeeInfoVo.totalActualServiceFee.toFixed(2)
    }
    return price
}

export const getTotalInsurancePrice = (state) => {
    let price = 0
    if (state.order.insuranceOrderInfoVoList && state.order.insuranceOrderInfoVoList.length > 0 && state.order.insuranceOrderInfoVoList[0]) {
        price = state.order.insuranceOrderInfoVoList[0].totalInsurancePrice.toFixed(2)
    }
    return price
}

export const getFinanceName = (state) => {
    let financeName = ''
    let financialOrderInfoVoList = state.order.financialOrderInfoVoList
    if (financialOrderInfoVoList && financialOrderInfoVoList.length > 0 && financialOrderInfoVoList[0] && financialOrderInfoVoList[0].financialOrderDetailInfo) {
        let financialOrder = state.order.financialOrderInfoVoList[0]
        switch (financialOrder.wfStatus) {
            case 0: 
                financeName = '待报价'; break;
            case 1:
                financeName = '待协助'; break;     
            case 2:
                financeName = financialOrder.financialOrderDetailInfo.financeName; break;   
            case 3:
                financeName = 'SC准战败'; break; 
            case 4: 
                financeName = financialOrder.financialOrderDetailInfo.financeName; break;
            case 5:
                financeName = '金融专员战败'; break;     
            case 6:
                financeName = '已完成'; break;   
            case 7:
                financeName = '已作废'; break;   
            default: 
                financeName = '待报价'; break;  
        }
    } else {
        financeName = '待报价'
    }
    return financeName
}

export const financeStatus = (state) => {
    let financeStatus = 0
    let financialOrderInfoVoList = state.order.financialOrderInfoVoList
    if (financialOrderInfoVoList && financialOrderInfoVoList.length > 0 && financialOrderInfoVoList[0] && financialOrderInfoVoList[0].financialOrderDetailInfo) {
        financeStatus = state.order.financialOrderInfoVoList[0].wfStatus
    }
    return financeStatus    
}

export const isOrderCanEdit = (state) => {
    let result = false
    if (state.order.carOrderInfoVoList != null && state.order.carOrderInfoVoList.length > 0) {
        if (state.order.carOrderInfoVoList[0].wfStatus == -1 && state.order.carOrderInfoVoList[0].currentOrderWfTypeCode != null) {
            result = true
        }
        if (state.order.carOrderInfoVoList[0].wfStatus == -1 && state.order.carOrderInfoVoList[0].currentOrderWfTypeCode == null) {
            result = true
        }
    } else {
        result = true
    }
    return result
}

export const wfStatus = (state) => {
    return state.order.carOrderInfoVoList[0].wfStatus
}     

export const gpApperance =  (state) => {
    let data = {}
    let gpNameSet = new Set(state.gpList)
    state.gpList.forEach((gpName) => {
        data[gpName + 'List'] = []
    })
    state.order.orderAddInfos.forEach((orderAddInfo) => {
        if (orderAddInfo.addCode.indexOf('_rate') > 0 && gpNameSet.has(orderAddInfo.addCode.replace('_rate', '%'))) {
            data[orderAddInfo.addCode.replace('_rate', '%List')].push(orderAddInfo.addValue)
        }
    })
    state.gpList.forEach((gpName) => {
        data[gpName + 'List'].push((state.appranceOneWeek[gpName.replace('%', '_rate')] ? state.appranceOneWeek[gpName.replace('%', '_rate')]: 0))
        data[gpName + 'List'].push((state.appranceOneMonth[gpName.replace('%', '_rate')] ? state.appranceOneMonth[gpName.replace('%', '_rate')]: 0))
    })
    return data
}     

export const hasNoSkuResson = (state) => { 
    let result = false
    if (state.order.noSkuReasonId) {
        result = true 
    } else {
        result = false 
    }
    return result
}