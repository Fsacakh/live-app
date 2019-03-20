import api from '../../common/api'
import * as types from './mutation-types'

export const getMenus = ({ commit }, menu) => {
    let params = menu
    api.menu
        .queryMenuInfo(params, (res) => {
            let menus = res.data.obj.list
            commit(types.MENU_GET_MENUS, {
                menus
            })
        })
}

export const setAddModal = ({ commit }) => {
    commit(types.MENU_SET_ADD_MODAL)
}
export const setUpdateModal = ({ commit }) => {
    commit(types.MENU_SET_UPDATE_MODAL)
}