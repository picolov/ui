// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
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
import App from './App'
import store from './store'
import router from './router'
import { VeeValidate, VeeConfig } from './validation'
import FileUploadBase64 from './components/FileUploadBase64'
import GenericContainer from './containers/Container'
import GenericTabs from './containers/Tabs'
import GenericMultiStep from './containers/MultiStep'

import 'vue-form-wizard/dist/vue-form-wizard.min.css'

Vue.use(vuexI18n.plugin, store)
Vue.use(BootstrapVue)
Vue.use(DatePicker)
Vue.use(VueFormWizard)
Vue.use(ToggleButton)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAf19UCebSUpJcNp9U0T6zz10GqY4dNlfc',
    libraries: 'places' // If you need to use place input
  }
})
Vue.use(vueEventCalendar, {locale: 'en', color: '#ffc928'})
Vue.use(window.VueCharts)

// set the start locale to use
Vue.i18n.set('en')
Vue.use(VeeValidate, VeeConfig)
// internal component
Vue.component('generic-container', GenericContainer)
Vue.component('generic-tabs', GenericTabs)
Vue.component('generic-multistep', GenericMultiStep)
Vue.component('generic-filebase64', FileUploadBase64)
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

/* utility function */
