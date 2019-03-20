/**
 * Created by NS-5_lwx on 2017/11/09.
 */
import api from './api'
// 获取数据字典主信息
export function getRefMainInfo(code, next) {
    const params = {refCode: code}
    api.ref.getDataDictionary(params, res => {
        if(res.data.code === 'success' && res.data.obj) {
            let items = res.data.obj.referenceDetailInfos
            if(items) {
                next(items)
            }
        }
    })
}
// 获取数据字典明细
export function getRefDetail(refDetailCode, next) {
    api.ref.getDictionaryDetails({
        refDetailCode: refDetailCode
    }).then((res) => {
        const obj = res.data.obj
        if (res.data.code === 'success') {
            next(obj)
        } 
    })
}

export function getScrollTop() {
    var scrollTop = 0;
    if(document.documentElement && document.documentElement.scrollTop){
        scrollTop=document.documentElement.scrollTop;
    }else if(document.body){
        scrollTop=document.body.scrollTop;
    }
    return scrollTop;
}

