import filters from 'common/filters'

//客流数
export const totalInStoreNum = state => {
    let data = filters.toThousands(state.flowInfo.totalInStoreNum);
    return data
}

export const totalFistInStoreNum = state => {
    let total = state.flowInfo.totalInStoreNum;
    let first = state.flowInfo.totalFistInStoreNum;
    let ratio = first/total*100
    return Math.round(ratio.toFixed(0))
}

export const totalInStockNum = state => {
    let data = 0;
    if (state.inventoryInfo.totalInStockNum) {
        state.inventoryInfo.totalInStockNum.forEach((item, index) => {
            data += Number(item.num)
        })
    }
    return filters.toThousands(data.toFixed(0));
}

export const quoteNumInfo = state => {
    let num = 0;
    let data = state.sellInfo
    if (data['9']) {
        let val = data['9']
        let n = val[0]
        num = (n.count ? n.count : 0)
    }
    return filters.toThousands(num.toFixed(0))
}

export const orderNumInfo = state => {
    let num = 0;
    let data = state.sellInfo
    if (data['9999']) {
        let val = data['9999']
        let n = val[0]
        num = (n.count ? n.count : 0)
    }
    return filters.toThousands(num.toFixed(0))
}

export const deliveryNumInfo = state => {
    let num = 0;
    let data = state.sellInfo
    if (data['5']) {
        let val = data['5']
        let n = val[0]
        num = (n.count ? n.count : 0)
    }
    return filters.toThousands(num.toFixed(0))
}

export const invoiceNumInfo = state => {
    let num = 0;
    let data = state.sellInfo
    if (data['4']) {
        let val = data['4']
        let n = val[0]
        num = (n.count ? n.count : 0)
    }
    return filters.toThousands(num.toFixed(0))
}

//销售订单锁定库存
export const totalSalesOrderStockNum = state => {
    let tatalNum = 0
    let orderLock = 0;
    state.inventoryInfo.totalInStockNum.forEach((item, index) => {
        tatalNum += Number(item.num)
    })
    state.inventoryInfo.totalSalesOrderStockNum.forEach(item => {
        orderLock += Number(item.num)
    })
    let ratio = orderLock/tatalNum*100
    return Math.round(ratio.toFixed(0))
}

export const outSixtyDayBussinesStockNum = state => {
    let data = 0;
    state.inventoryInfo.outSixtyDayBussinesStockNum.forEach(item => {
        data += Number(item.num)
    })
    return filters.toThousands(data.toFixed(0))
}

export const sellChartData = state => {
    let data = [
            {bgcolor:'#4D33EF',value:30},
            {bgcolor:'#FE691F',value:70},
       ]
    return data
}

//订单总收入
export const carBrandAndModelPriceInfoVos = state => {
    let totalPrice = 0
    state.gainInfo.carBrandAndModelPriceInfoVos.forEach(item => {
        totalPrice += Number(item.inComePrice)
    })
    return filters.toThousands(totalPrice.toFixed(0))
}

//  未开票订单金额
export const carBrandAndModelPriceInfoVosUnTicket = state => {
    let totalPrice =  state.gainInfoUnTicket.inComePrice || 0
    return filters.toThousands(totalPrice.toFixed(0))
}

//订单总收入GP
export const GPMap = (state) => {
    let GPInfo = []
    let GPList = []
    let key = []
    let count = 0
    if(state.GPInfo) {
        state.gpSortInfo.forEach((item) => {
            let index = state.GPInfo.findIndex((gp) => {
                return (gp.gp_code == item.value)
            })
            if (index >= 0 && count < 6) {
                GPList.push({
                    gp_code: state.GPInfo[index].gp_code,
                    gp_value_avg: state.GPInfo[index].gp_value_avg, 
                    sortedIndex: item.sortedIndex
                })
                count ++  
            }
            //state.GPInfo如果为空，也就是说如果当月还没有产生GP值
            if(state.GPInfo.length == 0){
                if(count < 6){
                    GPList.push({
                        gp_code: item.value,
                        gp_value_avg: 0,
                        sortedIndex: item.sortedIndex
                    });
                    count ++ 
                }
            }
        })
        GPList.sort((a, b) => {
            return (parseInt(a.sortedIndex) > parseInt(b.sortedIndex) ? 1: -1)
        })   
        GPList.forEach((item, index) => {
            let firstIndex =  parseInt(index/3)
            let secondIndex = parseInt(index%3)
            if (secondIndex == 0) {
                GPInfo[firstIndex] = []
            }

            let avgcode = Number(item.gp_value_avg) == 0 ? '0.0' : Number(item.gp_value_avg).toFixed(0)
            if (item.gp_code.indexOf('%') < 0) {
                GPInfo[firstIndex].push({
                    title: item.gp_code,
                    value: avgcode
                })
            } else if (item.gp_code.indexOf('%') >= 0) {
                GPInfo[firstIndex].push({
                    title: item.gp_code,
                    value: Number(item.gp_value_avg*100).toFixed(1) + '%' 
                })
            }
        })
    }
    return GPInfo
}

//未开票订单金额 GP
export const GPMapUnTicket = (state) => {
    let GPInfo = []
    let GPList = []
    let key = []
    let count = 0
    if(state.GPInfoUnTicket) {
        state.gpSortInfo.forEach((item) => {
            let index = state.GPInfoUnTicket.findIndex((gp) => {
                return (gp.gp_code == item.value)
            })
            if (index >= 0 && count < 6) {
                GPList.push({
                    gp_code: state.GPInfoUnTicket[index].gp_code,
                    gp_value_avg: state.GPInfoUnTicket[index].gp_value_avg, 
                    sortedIndex: item.sortedIndex
                })
                count ++  
            }
            //state.GPInfoUnTicket如果为空，也就是说如果当月还没有产生GP值
            if(state.GPInfoUnTicket.length == 0){
                if(count < 6){
                    GPList.push({
                        gp_code: item.value,
                        gp_value_avg: 0,
                        sortedIndex: item.sortedIndex
                    });
                    count ++ 
                }
            }
        })
        GPList.sort((a, b) => {
            return (parseInt(a.sortedIndex) > parseInt(b.sortedIndex) ? 1: -1)
        })   
       
        GPList.forEach((item, index) => {
            let firstIndex =  parseInt(index/3)
            let secondIndex = parseInt(index%3)
            if (secondIndex == 0) {
                GPInfo[firstIndex] = []
            }
           
            let avgucode = Number(item.gp_value_avg) == 0 ? '0.0' : Number(item.gp_value_avg).toFixed(0)
            if (item.gp_code.indexOf('%') < 0) {
                GPInfo[firstIndex].push({
                    title: item.gp_code,
                    value: avgucode
                })
            } else if (item.gp_code.indexOf('%') >= 0) {
                GPInfo[firstIndex].push({
                    title: item.gp_code,
                    value: Number(item.gp_value_avg*100).toFixed(1) + '%' 
                })
            }
        })
    }
    return GPInfo
}

//销售目标完成率
export const salesTargetPlanRate = state => {
    let data = state.sellInfo.salesTargetPlanRate?Number(state.sellInfo.salesTargetPlanRate) * 100:0
    return data
}
