// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import vuexI18n from 'vuex-i18n'
import BootstrapVue from 'bootstrap-vue'
import VueSwal from 'vue-swal'
import DatePicker from 'vue2-datepicker'
import App from './App'
import store from './store'
import router from './router'
import { VeeValidate, VeeConfig } from './validation'
import GenericContainer from './containers/Container'
import GenericTabs from './containers/Tabs'

Vue.use(vuexI18n.plugin, store)
Vue.use(BootstrapVue)
Vue.use(VueSwal)
Vue.use(DatePicker)

// set the start locale to use
Vue.i18n.set('en')
Vue.use(VeeValidate, VeeConfig)
Vue.component('generic-container', GenericContainer)
Vue.component('generic-tabs', GenericTabs)

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
    console.log('user not logged')
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
