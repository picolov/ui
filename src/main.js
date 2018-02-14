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
import vRateIt from 'vue-rate-it'
import underscore from 'vue-underscore'
import UtilityClass from './utility.js'
import App from './App'
import store from './store'
import router from './router'
import { VeeValidate, VeeConfig } from './validation'

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
// load components
const reqComponent = require.context('./a-components/', true, /\.(vue)$/i)
reqComponent.keys().map(key => {
  const name = key.match(/\w+/)[0]
  return Vue.component(name, () => import('./a-components/' + name))
})
// load containers
const reqContainer = require.context('./a-containers/', true, /\.(vue)$/i)
reqContainer.keys().map(key => {
  const name = key.match(/\w+/)[0]
  return Vue.component(name, () => import('./a-containers/' + name))
})

// external component
Vue.component('v-select', vSelect)
Vue.component('star-rating', vRateIt.StarRating)
Vue.component('fa-rating', vRateIt.FaRating)

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
