import api from '../../common/api'
import * as types from './mutation-types'

export const getServiceType = ({ commit }, params) => {
    api.ref.getDataDictionary(params.poros, (res) => {
        if (res.data.code == 'success') {
            let typeInfo = res.data.obj.referenceDetailInfos ? res.data.obj.referenceDetailInfos : []
            let type = [];
            typeInfo.forEach(function(value, index) {
                let obj = {};
                obj.value = value.refDetailCode;
                obj.text = value.refDetailName;
                obj.orderServiceFeeCode = '';
                obj.val = value.refDetailValue;
                obj.isShow = false;
                type.push(obj);
            })
            commit(types.GET_SERVICE_TYPE, {id: params.poros.refCode, type: type})
            params.callBack(res)
        }
    })
}
export const getCode = ({commit}, params) => {
    api.getSequence(params.poros, (res) => {
        if(res.data.code == "success") {
            let code = res.data.obj
            commit(types.GET_SERVICE_CODE, code)
        }
    })
}
export const addServiceFee = ({commit}, params) => {
    api.clearingsettlement.servicefee.addServiceFee(params.poros, (res) => {
        if(res.data.code == "success") {
            params.callBack(res)
        }
    })
}
export const addreplacement = ({commit}, params) => {
    api.clearingsettlement.replacement.addreplacement(params.poros, (res) => {
        params.callBack(res)
        if(res.data.code == 'success') {

        }
    })
}
export const editreplacement = ({commit}, params) => {
    api.clearingsettlement.replacement.editreplacement(params.poros, (res) => {
        params.callBack(res)
        if(res.data.code == 'success') {

        }
    })
}
export const queryServiceFee = ({commit}, params) => {
    api.clearingsettlement.servicefee.addServiceFee(params.poros, (res) => {
        if(res.data.code == "success") {
            params.callBack(res)
        }
    })
}