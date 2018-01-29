import Vue from 'vue'
import vuexI18n from 'vuex-i18n'
import BootstrapVue from 'bootstrap-vue'
import DatePicker from 'vue2-datepicker'
import VueFormWizard from 'vue-form-wizard'
import ToggleButton from 'vue-js-toggle-button'
import * as VueGoogleMaps from 'vue2-google-maps'
import 'vue-event-calendar/dist/style.css'
import vueEventCalendar from 'vue-event-calendar'
import 'chart.js'
import 'hchs-vue-charts'
import vSelect from 'vue-select'
import underscore from 'vue-underscore'
import UtilityClass from './utility.js'
import App from './App'
import store from './store'
import router from './router'
import { VeeValidate, VeeConfig } from './validation'
import FileUploadBase64 from './components/FileUploadBase64'
import ALabel from './components/ALabel'
import AButton from './components/AButton'
import AInputText from './components/AInputText'
import ATable from './components/ATable'
import ADatePicker from './components/ADatePicker'

import AContainer from './containers/AContainer'
import AStackContainer from './containers/AStackContainer'
import GenericTabs from './containers/Tabs'
import GenericMultiStep from './containers/MultiStep'

import 'vue-form-wizard/dist/vue-form-wizard.min.css'

Vue.use(vuexI18n.plugin, store)
Vue.use(BootstrapVue)
Vue.use(DatePicker)
Vue.use(VueFormWizard)
Vue.use(ToggleButton)
Vue.use(VueGoogleMaps, { load: { key: 'AIzaSyAf19UCebSUpJcNp9U0T6zz10GqY4dNlfc', libraries: 'places' } })
Vue.use(vueEventCalendar, { locale: 'en', color: '#ffc928' })
Vue.use(window.VueCharts)
Vue.use(UtilityClass)
Vue.use(underscore)

// set the start locale to use
Vue.i18n.set('en')
Vue.use(VeeValidate, VeeConfig)

// internal component
Vue.component('a-container', AContainer)
Vue.component('a-stackContainer', AStackContainer)
Vue.component('generic-tabs', GenericTabs)
Vue.component('generic-multistep', GenericMultiStep)
Vue.component('generic-filebase64', FileUploadBase64)
Vue.component('a-label', ALabel)
Vue.component('a-button', AButton)
Vue.component('a-inputText', AInputText)
Vue.component('a-table', ATable)
Vue.component('a-datePicker', ADatePicker)
// external component
Vue.component('v-select', vSelect)

const EventBus = new Vue()

Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function () {
      return EventBus
    }
  }
})

router.beforeEach((to, from, next) => {
  if (!store.state.user.logged) {
    store.dispatch('getInfo')
  }
  next()
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: {
    App
  }
})
