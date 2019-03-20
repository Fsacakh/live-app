import config from '../../common/config.js' 
import * as types from './mutation-types'

export default {
    [types.GET_LOGIN_INFO](state, logininfo) {
        state.loginInfo = logininfo
    }
}
