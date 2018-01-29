import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import user from './modules/user'
import lang from './modules/lang'
import app from './modules/app'
import generic from './modules/generic'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  actions,
  getters,
  modules: {
    lang,
    user,
    app,
    generic
  },
  strict: debug,
  plugins: []
})
