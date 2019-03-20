import * as types from './mutation-types.js'

export default {
    [types.INSURANCE_GET_TABLELIST](state, { list }) {
        let judge = false
        let judgeIndex
        state.tablelist.forEach(function(element, index) {
            if( element.name === list.name ){
                judge = true
                judgeIndex = index
            }
        })
        if( !judge ) {
            state.tablelist.push(list)
        }else {
            state.tablelist[judgeIndex] = list
        }
    },
    [types.INSURANCE_SET_TABLESHOW](state) {
        state.tableShow = true
    },
    // [types.INSURANCE_SET_COMPANYCODE](state, { code }) {
    //     state.companycode = code
    // },
    // [types.INSURANCE_SET_JIAOCODE](state, { code }) {
    //     state.jiaoCode = code
    // },
    [types.INSURANCE_SET_TEMPJIAO](state, { obj }) {
        state.tempJiao = obj
    },
    [types.INSURANCE_DELETE_JIAO](state) {
        state.tempJiao = {}
    },
    [types.INSURANCE_DELETE_TEMPBUSI](state) {
        state.tempBusi = {}
    },
    [types.INSURANCE_SET_TEMPBUSI](state, { obj }) {
        state.tempBusi = obj
    },
    [types.INSURANCE_REMOVE_TABLELIST](state) {
        state.tablelist = []
    },
    [types.INSURANCE_GET_COMPANYS](state, { companyList }) {
        state.companyList = companyList
    },
    [types.INSURANCE_SET_INSURANCENO](state, { obj }) {
        state.insuranceNo = obj
    },
    [types.INSURANCE_SET_ACCOUNTTYPES](state, { obj }) {
        state.accountTypes = obj
    },
    [types.INSURANCE_SET_REMOVEONE](state, { index }) {
        state.tablelist.splice(index, 1)
    },
    [types.INSURANCE_BACK_DATA](state, { obj }) {
        state.backData = obj
    },
    [types.INSURANCE_SET_SAVEINFO](state, { obj }) {
        state.saveInfo = obj
    },
    [types.INSURANCE_SET_UNSAVE](state, { obj }) {
        let judge = false
        let judgeIndex
        let tempIndex = obj.index
        state.tablelist.splice(tempIndex, 1)
        console.log(obj)
        state.tablelist.forEach(function(element, index) {
            if( element.name === obj.tempArray.name ){
                judge = true
                judgeIndex = index
            }
        })
        if(judge) {
            state.tablelist[judgeIndex] = obj.tempArray
        }else {
            state.tablelist.push(obj.tempArray)
        }
    },
    [types.INSURANCE_RESET_TABLELIST](state, { obj }) {
        state.tablelist = obj
    },
    [types.HOTPLAN_SET_NUM](state, { index }) {
        state.num = index
    },
    [types.HOTPLAN_SET_ITEMLIST](state, { obj }) {
        state.itemList = obj
    },
    [types.MAINORDER_SET_ORDER](state, { obj }) {
        state.orderNo = obj
    },
    [types.HOTPLAN_SET_CARCODE](state, { obj }) {
        state.carCode = obj
    }
}
