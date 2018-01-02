import Vue from 'vue'
import axios from 'axios'
import * as types from '../mutation-types'
import api from '../../api/common'
import generateLang from '../../validation/generateLang'

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
  loadLang (context, { page, instance }) {
    let mainLang = 'main_' + Vue.i18n.locale()
    let mainLoaded = false
    let pageLang = page.replace(/ /g, '_') + '_' + Vue.i18n.locale()
    let loaded = false
    let langList = context.state.langList
    for (let i = 0; i < langList.length; i++) {
      if (langList[i] === pageLang) {
        loaded = true
      } else if (langList[i] === mainLang) {
        mainLoaded = true
      }
    }
    let promises = []
    if (!mainLoaded) {
      if (instance) instance.$bus.$emit('show-full-loading', { key: 'fetchMainLang' })
      promises.push(api.get('generic/language/' + mainLang,
        (response) => {
          if (response.data.content) {
            Vue.i18n.add(Vue.i18n.locale(), response.data.content)
            context.commit(types.LOAD_LANG, { pageLang: mainLang })
            if (instance) instance.$validator.localize(instance.$i18n.locale(), generateLang)
            return setI18nLanguage(Vue.i18n.locale())
          }
        },
        () => { }
      ))
    } else {
      if (instance) instance.$validator.localize(instance.$i18n.locale())
    }
    if (!loaded) {
      if (instance) instance.$bus.$emit('show-full-loading', { key: 'fetchPageLang' })
      promises.push(api.get('generic/language/' + pageLang,
        (response) => {
          if (response.data.content) {
            Vue.i18n.add(Vue.i18n.locale(), response.data.content)
            context.commit(types.LOAD_LANG, { pageLang })
            return setI18nLanguage(Vue.i18n.locale())
          }
        },
        () => { }
      ))
    }
    Promise.all(promises).then(() => {
      /*
      setTimeout(() => {
        if (instance) instance.$bus.$emit('hide-full-loading')
      }, 2000)
      */
      if (instance) instance.$bus.$emit('hide-full-loading', {key: ['fetchPageLang', 'fetchMainLang']})
    })
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
