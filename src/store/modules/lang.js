import Vue from 'vue'
import axios from 'axios'
import * as types from '../mutation-types'
import api from '../../api/common'

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
      api.get('generic/language/' + pageLang,
        (response) => {
          if (response.data.content) {
            Vue.i18n.add(Vue.i18n.locale(), response.data.content)
            context.commit(types.LOAD_LANG, { pageLang })
            return setI18nLanguage(Vue.i18n.locale())
          }
        },
        () => { }
      )
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
