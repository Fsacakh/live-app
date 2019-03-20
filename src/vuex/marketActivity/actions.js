import * as types from './mutation-types.js'
import api from 'common/api.js'
import config from 'common/config.js'

export const queryMarketList = ({ commit }, params) => {
    api.market.queryMarketActivity(params.poros, res => {
        if(res.data.code === "success") {
            commit(types.GET_MARKET_LIST, res.data.obj.list)
            params.callBack(res)
        }
    })
}

export const getMartketDetail = ({commit}, params) => {
    api.market.getMarketActivityDetails(params.poros, res => {
        if(res.data.code === 'success') {
            commit(types.GET_MARKET_DETAIL, res.data.obj)
            params.callBack(res)
        }
    })
}

export const queryInviteList = ({commit}, params) => {
    api.customercenter.querycustomercenter(params.poros, res => {
        if(res.data.code === "success") {
            commit(types.QUERY_INVITEL_LIST, res.data.obj.list)
            params.callBack(res)
        }
    })
}

export const custRelMarket = ({ commit }, params) => {
    api.market.custRelMarket(params.poros, res => {
        if(res.data.code === 'success') {
            commit(types.CUST_REL_MATKET, res.data.obj)
            params.callBack(res)
        }
    })
}

export const relationMarket = ({ commit }, params) => {
    api.market.relationMarket(params.poros, res => {
        if(res.data.code === "success") {
            params.callBack(res)
        }
    })
}

export const updataRelationMarket = ({ commit }, params) => {
    api.market.updataRelationMarket(params.poros, res => {
        if(res.data.code === "success") {
            params.callBack(res)
        }
    })
}

export const getListRelationCode = ({ commit }, params) => {
    api.ordinalInfo.getSequence(params.poros, res => {
        if(res.data.code === "success") {
            commit(types.GET_LISTRELATION_CODE, res.data.obj)
            params.callBack(res)
        }
    })
}