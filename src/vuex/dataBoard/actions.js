import api from 'common/api'
import config from 'common/config'
import * as types from './mutation-types'

export const getSales = ({ commit }, params) => {
    api.board.getSaleswInfo(params.poros, res => {
        if(res.data.code === 'success') {
            params.callBack(res)
        }
    })
}

export const getFlowInfo = ({ commit }, params) => {
    api.board.getFlowInfo(params.poros, res => {
        if(res.data.code === 'success') {
            commit(types.GET_FLOW_INFO, res.data.obj)
            params.callBack(res)
        }
    })
}

export const getSellInfo = ({ commit }, params) => {
    api.board.getSellInfo(params.poros, res => {
        if(res.data.code === 'success') {
            commit(types.GET_SELL_INFO, res.data.obj)
            params.callBack(res)
        }
    })
}

// 开票订单收入
export const getGainInfo = ({ commit }, params) => {
    api.board.getGainInfo(params.poros, res => {
        if(res.data.code === 'success') {
            commit(types.GET_GAIN_INFO, res.data.obj)
            params.callBack(res)
        }
    })
}

// 未开票订单金额
export const getGainInfoUnTicket = ({ commit }, params) => {
    api.board.getGainInfoUnTicket(params.poros, res => {
        if(res.data.code === 'success') {
            commit(types.GET_GAIN_INFO_UN_TICKET, res.data.obj)
            params.callBack(res)
        }
    })
}

// 开票订单收入GP
export const getGPInfo = ({ dispatch, commit, state }, params) => {
    dispatch('getGPSortType',  {
        callback: () => {
            api.board.getGPInfo(params.poros, res => {
                if(res.data.code === 'success') {
                    commit(types.GET_GP_INFO, res.data.obj)
                    params.callBack(res)
                }
            }) 
        }
    })  
}

// 未开票订单金额 GP
export const getGPInfoUnTicket = ({ dispatch, commit, state }, params) => {
    dispatch('getGPSortType',  {
        callback: () => {
            api.board.getGPInfoUnTicket(params.poros, res => {
                if(res.data.code === 'success') {
                    commit(types.GET_GP_INFO_UN_TICKET, res.data.obj)
                    params.callBack(res)
                }
            }) 
        }
    })  
}

export const statistics = ({ commit }, params) => {
    api.board.statistics(params.poros, res => {
        if(res.data.code === 'success') {
            let obj = {
                type: params.poros.minLifeCycle,
                num: res.data.obj.count
            }
            commit(types.GET_STAT_INFO, obj)
            params.callBack(res)
        }
    })
}
// 新增
export const queryPureStockInfoNums = ({ commit }, params) => {
    api.board.queryPureStockInfoNums(params.poros, res => {
        if(res.data.code === 'success') {
            
             let num =  res.data.obj.totalStockNums

            commit(types.GET_TOTAL_INFO, num)
        }
    })
}


export const stockLockedInfo = ({ commit }, params) => {
    api.board.stockLockedInfo(params.poros, res => {
        if(res.data.code === 'success') {
            commit(types.GET_LOCK_INFO, res.data.obj.stock_result.actual_rate)
            params.callBack(res)
        }
    })
}

//库存周转天数
export const inventoryDays = ({ commit }, params) => {
    api.board.inventoryDays(params.poros, res => {
        if(res.data.code === 'success') {
            commit(types.GET_DAYS_INFO, res.data.obj && res.data.obj.actual_count)
            params.callBack(res)
        }
    })
}

//销售主数据
export const saleMainData = ({commit}, params) => {
    api.board.saleMainData(params.poros, res => {
        if(res.data.code === 'success') {
            commit(types.GET_SALE_INFO, res.data.obj)
            params.callBack(res)
        }
    })
}

export const getInventoryInfo = ({ commit }, params) => {
    api.board.getInventoryInfo(params.poros, res => {
        if(res.data.code === 'success') {
            commit(types.GET_INVENTORY_INFO, res.data.obj)
            params.callBack(res)
        }
    })
}

export const mommitIsStore = ({ commit }, params) => {
    commit(types.IS_STORE, params)
}

export const setStore = ({commit}, params) => {
    commit(types.SET_STORE, params)
}

export const setTime = ({ commit }, params) => {
    commit(types.SET_TIME, params)
}

export const getGPSortType = ({ commit }, params) => {
    api.ref.getDataDictionary({
        refCode: config.ref.gpSortType
    }, res => {
        if (res.data.code == "success") {
            let gpSortInfo = []
            let referenceDetailInfos = res.data.obj.referenceDetailInfos
            referenceDetailInfos.forEach((referenceDetailInfo) => {
                gpSortInfo.push({
                    value: referenceDetailInfo.refDetailName,
                    sortedIndex: referenceDetailInfo.addField1
                }) 
            })
            gpSortInfo.sort((a, b) => {
                return (parseInt(a.sortedIndex) > parseInt(b.sortedIndex) ? 1: -1) 
            })
            commit(types.GET_GP_SORT_INFO, {
                gpSortInfo
            })
            params.callback()
        }
    })
}