import * as types from './mutation-types'

export default {
    [types.MENU_GET_MENUS](state, { menus }) {
        state.list = menus
    },
    [types.MENU_SET_ADD_MODAL](state) {
        state.showAddModal = !state.showAddModal
    },
    [types.MENU_SET_UPDATE_MODAL](state) {
        state.showUpdateModal = !state.showAddModal
    },
    [types.MENU_SET_SELECTED_ROW](state, { index }) {
        state.selectedRow = index
    }
}
