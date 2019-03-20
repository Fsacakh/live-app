import * as types from './mutation-types'

export default {
    [types.GET_REFERRER](state, info) {
        state.referrer = info
    },
    [types.SET_CUS_LEAD_INFO](state, info) {
        state.cusLeadInfo = info
    },
    [types.SET_LOGIN_INFO](state, loginInfo) {
        state.loginInfo = loginInfo
    },
    [types.GET_PERSON_INFO](state, personInfo) {
        state.personInfo = personInfo
    },
    [types.SET_INTENTION_CAR_INFO](state, intentionCarInfo) {
        state.intentionCarInfo = intentionCarInfo
    },
    [types.SET_IS_INSERT](state, isInsert) {
        state.isInsert = isInsert
    },
    [types.SET_MODEL_INFO](state, modelInfo) {
        state.modelInfo = modelInfo
    },
    [types.SET_FOLLOW_ITEM](state, followItem) {
        state.followItem = followItem
    },
    [types.SET_CURRENT_TAB_INDEX](state, currentTabIndex) {
        state.currentTabIndex = currentTabIndex  
    },
    [types.SET_CURRENT_TAB_CONTENT](state, currentTabContent) {
        state.currentTabContent = currentTabContent
    },
    [types.GET_DISPLAYNAME_INFO](state, displayName) {
        state.displayName = displayName
    }
}
