import api from 'common/api'
import * as types from './mutation-types'

export const screeningconditionsEMP  = ({commit}, params) => {
    commit(types.SCREENING_CODEITIONS_EMP, params)
}

export const setParams =  ({commit}, params) => {
    let newParams = JSON.parse(JSON.stringify(params))
    commit(types.CUSTOMER_CENTER_SET_PARAMS, 
        newParams
    )
}    