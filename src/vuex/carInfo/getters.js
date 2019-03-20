export const getLogisticsStatus = (state) => {
    let status = state.carInfo.logisticsStatus == 1 ? '在途': (state.carInfo.logisticsStatus == 2 ?  '在库': '')
    return status
}