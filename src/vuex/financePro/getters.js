export const financeStatus = (state) => {
    let result = ''
    if (state.financeProDetailInfo != {}) {
        let financeStatus = state.financeProDetailInfo.wfStatus
        switch (financeStatus) {
            case 0: 
                result = '待报价'; break;
            case 1:
                result = '待协作'; break;     
            case 2:
                result = '销售顾问报价'; break;   
            case 3:
                result = 'SC准战败'; break; 
            case 4: 
                result = '金融专员报价'; break;
            case 5:
                result = '金融专员战败'; break;     
            case 6:
                result = '已完成'; break;   
            case 7:
                result = '已作废'; break;   
            default: 
                result = '待报价'; break;            
        } 
    }
    return result
}