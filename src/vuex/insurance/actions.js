import api from '../../common/api'
import * as types from './mutation-types'

export const setTableList = ({ commit }, list) => {
    commit(types.INSURANCE_GET_TABLELIST, { list })
}
export const getCompanyList = ({ commit }, companyList) => {
    commit(types.INSURANCE_GET_COMPANYS, { companyList })
}
export const setTableShow = ({ commit }) => {
    commit(types.INSURANCE_SET_TABLESHOW)
}
export const setTempJiao = ({ commit }, obj) => {
    commit(types.INSURANCE_SET_TEMPJIAO, { obj })
}
export const setTempBusi = ({ commit }, obj) => {
    commit(types.INSURANCE_SET_TEMPBUSI, { obj })
}
export const removeTableList = ({ commit }) => {
    commit(types.INSURANCE_REMOVE_TABLELIST)
}
export const setInsuranceNo = ({ commit }, obj) => {
    commit(types.INSURANCE_SET_INSURANCENO, { obj })
}
export const setAccountTypes = ({ commit }, obj) => {
    commit(types.INSURANCE_SET_ACCOUNTTYPES, { obj })
}
export const deleteOne = ({ commit }, index) => {
    commit(types.INSURANCE_SET_REMOVEONE, { index })
}
export const setBackData = ({ commit }, obj) => {
    commit(types.INSURANCE_BACK_DATA, { obj })
}
export const saveInsuranceInfo = ({ commit }, obj) => {
    commit(types.INSURANCE_SET_SAVEINFO, { obj })
}
export const editUnsaveData = ({ commit }, obj) => {
    commit(types.INSURANCE_SET_UNSAVE, { obj })
}
export const resetTablelist = ({ commit }, obj) => {
    commit(types.INSURANCE_RESET_TABLELIST, { obj })
}
export const setHotPlanIndex = ({ commit }, index) => {
    commit(types.HOTPLAN_SET_NUM, { index })
}
export const setHotPlanList = ({ commit }, obj) => {
    commit(types.HOTPLAN_SET_ITEMLIST, { obj })
}
export const setMainOrder = ({ commit }, obj) => {
    commit(types.MAINORDER_SET_ORDER, { obj })
}
export const setCarCode = ({ commit }, obj) => {
    commit(types.HOTPLAN_SET_CARCODE, { obj })
}
export const resetJiao = ({ commit }) => {
    commit(types.INSURANCE_DELETE_JIAO)
}
export const resetBusi = ({ commit }) => {
    commit(types.INSURANCE_DELETE_TEMPBUSI)
}
export const pushInsuranceOrderToWorkbench = ({ commit }, params) => {
    api.clearingsettlement
        .insurance
        .pushInsuranceOrderToWorkbench(params, (res) => {
            if (res.data.code === 'success') {
                params.callback()
            }
        })
}
