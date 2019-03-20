import * as getters from './getters.js'
import * as actions from './actions.js'
import mutations from './mutations.js'

const state = {
    time: '',
    store: '',
    isStore: false,
    saleInfo: {},
    lockedInfo: 0,
    invenDays: 0,
    inven60: 0,
    invenall: 0,
    GPInfo: [],            // 本月开票订单收入的GP信息
    GPInfoUnTicket: [],    // 未开票订单金额的GP信息
    gpSortInfo: [],
    sellDetailList: [],
    //销售
    sellInfo: {
    },
    flowInfo: {
        totalInStoreNum: '',
        totalFistInStoreNum: 0,
    },
    quoteNumInfo: [],  //报价数
    orderNumInfo: [],  //订单数
    deliveryNumInfo: [],  //交车数
    sellInfo: {},
    sellChartData: [
        { bgcolor: '#4D33EF', value: 30 },
        { bgcolor: '#FE691F', value: 70 },
    ],
    gainInfo: {
        carBrandAndModelPriceInfoVos: [
            { inComePrice: 0 },
            { inComePrice: 0 },
            { inComePrice: 0 },
            { inComePrice: 0 },
        ],
        gpMap: {},
        orderNoSet: [],
    },
    gainInfoUnTicket: {
        carBrandAndModelPriceInfoVos: 0,
        gpMap: {},
        orderNoSet: [],
    },
    //库存
    inventoryInfo: {
        totalInStockNum: [
            { num: 30 },
            { num: 40 },
            { num: 30 },
        ],
        outSixtyDayBussinesStockNum: [
            { num: 0 },
            { num: 0 },
            { num: 0 },
        ],
        totalSalesOrderStockNum: [
            { num: 30 },
            { num: 20 },
            { num: 10 },
        ]
    },
}

export default {
    namespaced: true,
    getters,
    actions,
    mutations,
    state,
}