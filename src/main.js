// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import vuexI18n from 'vuex-i18n'
import BootstrapVue from 'bootstrap-vue'
import VueSwal from 'vue-swal'
import DatePicker from 'vue2-datepicker'
import VeeValidate from 'vee-validate'
import App from './App'
import store from './store'
import router from './router'

Vue.use(vuexI18n.plugin, store)
Vue.use(BootstrapVue)
Vue.use(VueSwal)
Vue.use(DatePicker)

const config = {
  errorBagName: 'errors', // change if property conflicts.
  fieldsBagName: 'inputs ', // Default is fields
  delay: 0,
  locale: 'en',
  dictionary: null,
  strict: true,
  enableAutoClasses: false,
  classNames: {
    touched: 'touched', // the control has been blurred
    untouched: 'untouched', // the control hasn't been blurred
    valid: 'valid', // model is valid
    invalid: 'invalid', // model is invalid
    pristine: 'pristine', // control has not been interacted with
    dirty: 'dirty' // control has been interacted with
  },
  events: 'input|blur',
  inject: true
}
Vue.use(VeeValidate, config)

// set the start locale to use
Vue.i18n.set('en')

router.beforeEach((to, from, next) => {
  if (!store.state.user.logged) {
    console.log('user not logged')
    store.dispatch('getInfo')
  }
  if (from.path === '/') {
    store.dispatch('loadLang', {pageLang: 'main_' + Vue.i18n.locale()})
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
