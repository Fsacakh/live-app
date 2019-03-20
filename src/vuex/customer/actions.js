import api from 'common/api'
import * as types from './mutation-types'

export const setCusLeadInfo = ({commit}, params) => {
    api.lead.queryLeadDetail(params).then(res => {
        let obj = res.data.obj
        if(res.data.code === 'success' && obj) {
            commit(types.SET_CUS_LEAD_INFO, obj[0])
        }
    })
}
export const setCusLeadMarketInfo = ({commit}, params) => {
    api.lead.queryLeadDetail(params.poros).then(res => {
        let obj = res.data.obj
        if(res.data.code === 'success' && obj) {
            commit(types.SET_CUS_LEAD_INFO, obj[0])
            params.callBack(obj[0])
        }
    })
}
// 获取用户登陆权限信息 => 用于区分 SC / SM
export const setLoginInfo = ({commit}, sc) => {
    api.login.getLoginInfo().then(res => {
        if(res.data.code === 'success') {
            let obj = res.data.obj;
            commit(types.SET_LOGIN_INFO, obj)
            sc()
        }
    })
}

export const setPersonInfo = ({commit}, params) => {  
    commit(types.GET_PERSON_INFO, params)
}
//现有车辆
export const setDisplayName = ({commit}, params) => {  
    commit(types.GET_DISPLAYNAME_INFO, params)
}