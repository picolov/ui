import * as types from '../mutation-types'

// initial state
const state = {
  currPage: '',
  alertTitle: '',
  alertMessage: '',
  locationPicked: {lat: -6.2152408, lng: 106.8301251},
  infoAlertShow: false,
  yesNoAlertShow: false,
  mapPickerAlertShow: false,
  okCallback: () => {},
  selectLocationCallback: () => {}
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
  [types.SELECT_LOCATION] (state, {latlng, selectLocationCallback}) {
    state.mapPickerAlertShow = true
    if (latlng) {
      state.locationPicked.lat = latlng.lat
      state.locationPicked.lng = latlng.lng
    } else {
      state.locationPicked.lat = -6.2152408
      state.locationPicked.lng = 106.8301251
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
