//页面保险单数据
export const setOrderData = ({ commit }, data) => {
    commit('setOrderData', data)
}
//当前保险单状态 类型：boolean, 更新状态: true, 新增状态: false
export const setOrderType = ({ commit }, type) => {
    commit('setOrderType', type)
}

export const changeInsurance = ({ commit }, type) => {
    commit('setChangeInsuranceStatus', type)
} 


//储存保险单号
export const setInsuranceCode = ({ commit }, code) => {
    commit('setInsuranceCode', code)
} 