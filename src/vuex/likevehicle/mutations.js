import * as types from './mutation-types'

export default {
    [types.likevehicle](state, { menus }) {
        state.likevehicle = menus
    },
    [types.temporarydata](state, { temporarydata}){
        state.temporarydata = temporarydata
    }
}
