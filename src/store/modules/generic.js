import Vue from 'vue'
import * as types from '../mutation-types'

// initial state
const state = {
  options: {},
  component: {},
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
  [types.UPDATE_DATA] (state, {id, key, value}) {
    if (state.data[id] == null) {
      Vue.set(state.data, id, {})
    }
    Vue.set(state.data[id], key, value)
  },
  [types.UPDATE_COMPONENT] (state, {id, attr, key, value}) {
    if (state.component[id]) {
      if (key) {
        if (state.component[id][attr]) {
          Vue.set(state.component[id][attr], key, value)
        } else {
          Vue.set(state.component[id], attr, {})
          Vue.set(state.component[id][attr], key, value)
        }
      } else {
        if (value) {
          Vue.set(state.component[id], attr, value)
        } else {
          Vue.set(state.component[id], attr, {})
        }
      }
    } else {
      Vue.set(state.component, id, {})
      if (key) {
        if (state.component[id][attr]) {
          Vue.set(state.component[id][attr], key, value)
        } else {
          Vue.set(state.component[id], attr, {})
          Vue.set(state.component[id][attr], key, value)
        }
      } else {
        if (value) {
          Vue.set(state.component[id], attr, value)
        } else {
          Vue.set(state.component[id], attr, {})
        }
      }
    }
  },
  [types.UPDATE_DATA_COLLECTION] (state, {id, collection, prefix}) {
    if (state.data[id] == null) {
      Vue.set(state.data, id, {})
    }
    for (let key in collection) {
      Vue.set(state.data[id], prefix ? prefix + '_' + key : key, collection[key])
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
  [types.CLEAR_DATA] (state, {id}) {
    Vue.set(state.data, id, {})
  },
  [types.CLEAR_COMPONENT] (state, {id, attr}) {
    if (attr) {
      state.component[id][attr] = {}
    } else {
      state.component[id] = {}
    }
  },
  [types.REMOVE_ROW] (state, {id, arraySequence, arrayCount}) {
    // still only support for '_' sequenceNotation
    const containerData = state.data[id]
    let sequenceNotation = ''
    let currentIndex = parseInt(arraySequence)
    let lastIndex = containerData[arrayCount]
    if (isNaN(currentIndex)) {
      sequenceNotation = arraySequence[0]
      currentIndex = parseInt(arraySequence.substring(1))
      if (sequenceNotation === '.') { lastIndex-- }
    }
    let currentSequence = arraySequence

    // only when currentIndex is in the array
    if (currentIndex <= lastIndex) {
      let nextIndex = currentIndex + 1
      let nextSequence = null
      // recursively copy data
      for (let i = currentIndex; i <= lastIndex; i++, nextIndex++) {
        nextSequence = sequenceNotation + nextIndex
        for (var key in containerData.componentModelName) {
          Vue.set(state.data[id], containerData.componentModelName[key] + currentSequence, containerData[containerData.componentModelName[key] + nextSequence])
        }
        currentSequence = nextSequence
      }
    }
    // remove last row
    if (state.data[id][arrayCount] && state.data[id][arrayCount] > 0) {
      Vue.set(state.data[id], arrayCount, state.data[id][arrayCount] - 1)
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
