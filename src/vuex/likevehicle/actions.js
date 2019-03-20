import api from '../../common/api'
import * as types from './mutation-types'

export const likevehicle = ({ commit }, likevehicle) => {
    commit(types.likevehicle, likevehicle)
}
export const temporarydata = ({ commit }, temporary) => {
    commit(types.temporarydata, temporarydata)
}