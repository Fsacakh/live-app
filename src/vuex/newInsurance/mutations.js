export default {
    setOrderData(state, data) {
        state.orderData = data; //页面保险单数据
    },
    setOrderType(state, type) {
        state.orderType = type; //当前保险单状态 类型：boolean, 更新状态: true, 新增状态: false
    },
    setChangeInsuranceStatus(state, type) {
        state.changeInsurancePlanStatus = type  
    },
    setInsuranceCode(state, code) {
        state.insuranceCode = code 
    }
}