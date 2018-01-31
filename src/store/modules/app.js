import * as types from '../mutation-types'

// initial state
const state = {
  editMode: false,
  title: '',
  pageLang: '',
  alertTitle: '',
  alertMessage: '',
  path: [],
  infoAlertShow: false,
  yesNoAlertShow: false,
  mapPickerAlertShow: false,
  okCallback: () => {},
  selectLocationCallback: () => {}
}

// getters
const getters = {
}

// actions
const actions = {
}

// mutations
const mutations = {
  [types.ENABLE_EDIT_MODE] (state) {
    state.editMode = true
  },
  [types.DISABLE_EDIT_MODE] (state) {
    state.editMode = false
  },
  [types.SET_PAGE] (state, {title, lang}) {
    state.title = title
    state.pageLang = lang
  },
  [types.SHOW_ALERT] (state, {alertType, alertTitle, alertMessage, okCallback}) {
    state.alertTitle = alertTitle
    state.alertMessage = alertMessage
    state.okCallback = okCallback
    switch (alertType) {
      case 'info':
        state.infoAlertShow = true
        break
      case 'yesNo':
        state.yesNoAlertShow = true
        break
    }
  },
  [types.SET_ALERT_SHOW] (state, {alertType, alertIsShow}) {
    switch (alertType) {
      case 'info':
        state.infoAlertShow = alertIsShow
        break
      case 'yesNo':
        state.yesNoAlertShow = alertIsShow
        break
    }
  },
  [types.SET_MAPPICKER_SHOW] (state, {alertIsShow}) {
    state.mapPickerAlertShow = alertIsShow
  },
  [types.SELECT_LOCATION] (state, {path, selectLocationCallback}) {
    state.mapPickerAlertShow = true
    if (path) {
      state.path = path
    } else {
      state.path = []
    }
    state.selectLocationCallback = selectLocationCallback
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
