import * as types from '../mutation-types'
import api from '../../api/common'

// initial state
const state = {
  editMode: false,
  route: '',
  title: '',
  pageLang: '',
  pageRoutes: [],
  alertTitle: '',
  alertMessage: '',
  path: [],
  infoAlertShow: false,
  yesNoAlertShow: false,
  mapPickerAlertShow: false,
  okCallback: () => {},
  cancelCallback: () => {},
  selectLocationCallback: () => {}
}

// getters
const getters = {
}

// actions
const actions = {
  loadPageRoute (context, {instance}) {
    if (instance) instance.$bus.$emit('show-full-loading', { key: 'fetchPageRoute' })
    api.get('generic/urlRoute',
      (response) => {
        if (instance) instance.$bus.$emit('hide-full-loading', { key: 'fetchPageRoute' })
        if (response.data) {
          let pageRoutes = response.data
          return context.commit(types.LOAD_PAGE_ROUTE, { pageRoutes })
        }
      },
      () => {
        console.log('error loading page route')
        if (instance) instance.$bus.$emit('hide-full-loading', { key: 'fetchPageRoute' })
      }
    )
  }
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
  [types.SHOW_ALERT] (state, {alertType, alertTitle, alertMessage, okCallback, cancelCallback}) {
    state.alertTitle = alertTitle
    state.alertMessage = alertMessage
    state.okCallback = okCallback
    state.cancelCallback = cancelCallback
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
  },
  [types.LOAD_PAGE_ROUTE] (state, {pageRoutes}) {
    state.pageRoutes = pageRoutes
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
