import * as getters from './getters'
import * as actions from './actions'
import mutations from './mutations'

const state = {
    gpInfo: [],
    gpList: [],
    isSc: false,
    // money: '',
    getCouponName: '',
    orderNo: '',
    order: {
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
        insuranceOrderInfoVoList: [{
            totalInsurancePrice: 0
        }],
        skuOrderInfoVoList: [],
        skuOrderTotalInfoVoList: [{
            totalActualSalesPrice: 0
        }],
        orderPromotionInfoVoList: [],
        orderSubstitutionInfoVoList: [],
        orderServiceFeeInfoVoList: [],
        totalOrderServiceFeeInfoVo: {
            totalActualServiceFee: 0
        },
        orderInfo: {},
        actualTotalPrice: 0
    },
    orderApproveHistory: [],
    orderwfInfo: {
        nodeName: ''
    },
    orderInfo: {},
    appranceOneWeek: {
        
    },
    appranceOneMonth: {
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
