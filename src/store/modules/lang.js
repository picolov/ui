import Vue from 'vue'
import axios from 'axios'
import * as types from '../mutation-types'

// initial state
const state = {
  langList: []
}

// getters
const getters = {
  langList: state => state.langList
}

// actions
const actions = {
  loadLang (context, { pageLang }) {
    // context.commit(types.RECEIVE_PRODUCTS, { products })
    pageLang = pageLang.replace(/ /g, '_')
    let loaded = false
    let langList = context.state.langList
    for (let i = 0; i < langList.length; i++) {
      if (langList[i] === pageLang) {
        loaded = true
        break
      }
    }
    if (!loaded) {
      return import(/* webpackChunkName: "lang-[request]" */ `@/lang/${pageLang}`).then(msgs => {
        Vue.i18n.add(Vue.i18n.locale(), msgs.default)
        context.commit(types.LOAD_LANG, { pageLang })
        return setI18nLanguage(Vue.i18n.locale())
      }).catch(error => {
        console.log('error loading page language: ' + pageLang + '\nerror: ' + error)
      })
    } else {
    }
  }
}

function setI18nLanguage (lang) {
  axios.defaults.headers.common['Accept-Language'] = lang
  document.querySelector('html').setAttribute('lang', lang)
  return lang
}

// mutations
const mutations = {
  [types.LOAD_LANG] (state, { pageLang }) {
    state.langList.push(pageLang)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
