import api from '../../common/api'
import * as types from './mutation-types'

export const queryUpcomingInfo = ({ commit }, params) => {
   api.homepage.queryUpcomingInfo(params.poros, (res) => {
       if(res.data.code == "success") {
           params.callBack(res);
       }
   })
}
export const getLoginInfo = ({commit}, sc) => {
    api.login.getLoginInfo().then(res => {
        if(res.data.code === 'success') {
            let obj = res.data.obj;
            commit(types.GET_LOGIN_INFO, obj)
            sc(res)
        }
    })
}