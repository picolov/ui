// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import vuexI18n from 'vuex-i18n'
import BootstrapVue from 'bootstrap-vue'
import DatePicker from 'vue2-datepicker'
import VueFormWizard from 'vue-form-wizard'
import * as VueGoogleMaps from 'vue2-google-maps'
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
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAf19UCebSUpJcNp9U0T6zz10GqY4dNlfc',
    libraries: 'places' // If you need to use place input
  }
})

// set the start locale to use
Vue.i18n.set('en')
Vue.use(VeeValidate, VeeConfig)
Vue.component('generic-container', GenericContainer)
Vue.component('generic-tabs', GenericTabs)
Vue.component('generic-multistep', GenericMultiStep)
Vue.component('generic-filebase64', FileUploadBase64)

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
