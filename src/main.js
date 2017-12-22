// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import vuexI18n from 'vuex-i18n'
import BootstrapVue from 'bootstrap-vue'
import App from './App'
import store from './store'
import router from './router'

Vue.use(vuexI18n.plugin, store)
Vue.use(BootstrapVue)

// set the start locale to use
Vue.i18n.set('id')

router.beforeEach((to, from, next) => {
  if (!store.state.user.logged) {
    console.log('user not logged')
    // store.dispatch('getInfo')
  }
  if (from.path === '/') {
    store.dispatch('loadLang', {pageLang: 'Main_' + Vue.i18n.locale()})
  }
  store.dispatch('loadLang', {pageLang: to.name + '_' + Vue.i18n.locale()})
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
