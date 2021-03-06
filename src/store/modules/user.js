import api from '../../api/common'
import * as types from '../mutation-types'

// initial state
const state = {
  user: null,
  logged: false,
  mode: 'client',
  menus: [],
  authMenus: {}
}

// getters
const getters = {
  mode: state => state.mode,
  logged: state => state.logged,
  menus: state => state.menus,
  authMenus: state => state.authMenus,
  filteredMenus: state => {
    let filtered = []
    for (let i = 0; i < state.menus.length; i++) {
      let menu = state.menus[i]
      if (state.authMenus[state.mode].includes(menu.id)) {
        let newMenu = {...menu}
        if (menu.children) {
          let childrenNew = []
          for (let j = 0; j < menu.children.length; j++) {
            let childrenMenu = menu.children[j]
            if (state.authMenus[state.mode].includes(childrenMenu.id)) {
              childrenNew.push(childrenMenu)
            }
          }
          if (childrenNew.length > 0) {
            newMenu.children = childrenNew
          }
        }
        filtered.push(newMenu)
      }
    }
    return filtered
  }
}

// actions
const actions = {
  getInfo ({ commit, state }) {
    api.post(
      'generic/flow/process/getInfo', {},
      (response) => {
        commit(types.SET_USER, response.data)
        commit(types.SET_MENU, {menus: response.data.menus, authMenus: response.data.authMenus})
        commit(types.LOGIN_SUCCESS)
      },
      () => commit(types.LOGIN_FAILED)
    )
  },
  logout ({ commit, state }) {
    localStorage.clear()
    api.post(
      'auth/logout', {},
      (response) => {
        commit(types.SET_USER, null)
        commit(types.USER_LOGOUT)
        window.location = '/sign-in.html'
      },
      () => {
        commit(types.USER_LOGOUT)
        window.location = '/sign-in.html'
      }
    )
  }
}

function attachChild (result, menus) {
  if (result.length === 0) {
    for (let i = 0; i < menus.length; i++) {
      if (menus[i].parent === '' || menus[i].parent === undefined) {
        result.push(menus[i])
      }
    }
    // sorting
    result.sort(function (menu1, menu2) {
      return menu1.idx - menu2.idx
    })
    attachChild(result, menus)
  } else {
    for (let i = 0; i < result.length; i++) {
      for (let j = 0; j < menus.length; j++) {
        if (menus[j].parent === result[i].id) {
          if (result[i].children) {
            result[i].children.push(menus[j])
          } else {
            result[i].children = [menus[j]]
          }
          attachChild([menus[j]], menus)
        }
      }
      // sorting
      if (result[i].children) {
        result[i].children.sort(function (menu1, menu2) {
          return menu1.idx - menu2.idx
        })
      }
    }
  }
}

// mutations
const mutations = {
  [types.SET_USER] (state, user) {
    state.user = user
    state.mode = user.authorities[0]
  },

  [types.SET_MENU] (state, {menus, authMenus}) {
    var resultMenus = []
    attachChild(resultMenus, menus)
    state.menus = resultMenus
    state.authMenus = authMenus
  },

  [types.USER_LOGOUT] (state) {
    state.logged = false
  },

  [types.LOGIN_SUCCESS] (state) {
    state.logged = true
  },

  [types.LOGIN_FAILED] (state) {
    state.logged = false
  },

  [types.SWITCH_MODE] (state) {
    if (state.user && state.user.authorities) {
      for (var i = 0; i < state.user.authorities.length; i++) {
        if (state.mode === state.user.authorities[i]) {
          if (i + 1 >= state.user.authorities.length) {
            state.mode = state.user.authorities[0]
            break
          } else {
            state.mode = state.user.authorities[i + 1]
            break
          }
        }
      }
    }
  },
  [types.SET_MODE] (state, {mode}) {
    state.mode = mode
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
