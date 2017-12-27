import * as types from '../mutation-types'

// initial state
const state = {
  currPage: ''
}

// getters
const getters = {
  currPage: state => state.currPage
}

// actions
const actions = {
}

// mutations
const mutations = {
  [types.SET_PAGE] (state, currPage) {
    state.currPage = currPage
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
