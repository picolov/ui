import Vue from 'vue'
import * as types from '../mutation-types'

// initial state
const state = {
  options: {},
  components: [],
  data: {},
  componentToRefresh: []
}

// getters
const getters = {
}

// actions
const actions = {
}

// mutations
const mutations = {
  [types.UPDATE_OPTION] (state, {key, option}) {
    Vue.set(state.options, key, option)
  },
  [types.UPDATE_DATA] (state, {key, value}) {
    Vue.set(state.data, key, value)
  },
  [types.UPDATE_DATA_COLLECTION] (state, {collection, prefix}) {
    for (let key in collection) {
      Vue.set(state.data, prefix ? prefix + '_' + key : key, collection[key])
    }
  },
  [types.REFRESH_COMPONENT] (state, {id}) {
    state.componentToRefresh.push(id)
  },
  [types.FINISH_REFRESH_COMPONENT] (state, {id}) {
    const index = state.componentToRefresh.indexOf(id)
    if (index !== -1) {
      state.componentToRefresh.splice(index, 1)
    }
  },
  [types.CLEAR_OPTION] (state) {
    state.options = {}
  },
  [types.CLEAR_DATA] (state) {
    state.data = {}
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
