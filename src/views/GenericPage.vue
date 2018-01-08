<template>
  <div class="animated fadeIn">
    <generic-container v-if="componentList !== null" :name="id" :components="componentList" :attr="attr" :data="data"/>
  </div>
</template>

<script>
import Vue from 'vue'
import { SET_PAGE } from '../store/mutation-types'
import api from '../api/common'

export default {
  name: 'genericPage',
  data () {
    return {
      id: '',
      componentList: null,
      attr: {
        viewAs: 'div'
      },
      data: {}
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    '$route': 'fetchData'
  },
  methods: {
    fetchData () {
      // this is set to be null so that the generic-container will got re-mounted, if not then if will not see that it need to be re-mounted, because changing props doesn't count
      this.componentList = null
      // reset data
      this.data = {}
      // load language
      this.$store.dispatch('loadLang', {page: this.$route.params.page, instance: this})
      // load layout
      api.get(
        'generic/flow/layout/' + this.$route.params.page,
        (response) => {
          let page = response.data
          this.id = page.id
          if (page.title) this.$store.commit(SET_PAGE, page.title)
          // get init action
          if (page.init) {
            for (let i = 0; i < page.init.length; i++) {
              let action = page.init[i]
              this.processAction(action, null, null, null, this.$route.query)
            }
          }
          this.componentList = page.content
          this.attr = page
        }, () => {
          console.log('ERROR when loading page ' + this.$route.params.page)
        }
      )
    },
    processAction (action, component, item, index, urlParam) {
      let mapInject = {item: item, urlParam: urlParam, index: index, component: component, action: action}
      let url = stringInject(action.url, mapInject)
      switch (action.type) {
        case 'getData':
          api.get(url,
            (response) => {
              for (let key in response.data) {
                Vue.set(this.data, action.prefix ? action.prefix + '_' + key : key, response.data[key])
              }
            },
            () => { }
          )
          break
        case 'goto':
          this.$router.push({ path: url })
          break
        case 'exec':
          if (!action.use_validate) {
            this.execForm(action, component, item, index, urlParam)
          } else {
            this.$validator.validateAll().then((isValid) => {
              if (!isValid) {
                // eslint-disable-next-line
                console.log('Correct them errors!')
                return
              }

              this.execForm(action, component, item, index, urlParam)
            })
          }
          break
      }
    }
  }
}

function stringInject (str, data) {
  if (typeof str === 'string' && (data instanceof Array)) {
    return str.replace(/({\d})/g, function (i) {
      return data[i.replace(/{/, '').replace(/}/, '')]
    })
  } else if (typeof str === 'string' && (data instanceof Object)) {
    for (let key in data) {
      return str.replace(/({([^}]+)})/g, function (i) {
        let key = i.replace(/{/, '').replace(/}/, '')
        let result = getObjectFromString(data, key)
        if (result === null) {
          return i
        }
        return result
      })
    }
  } else {
    return false
  }
}

function getObjectFromString (data, key) {
  let tokenArr = key.split('.')
  let result = null
  for (let i = 0; i < tokenArr.length; i++) {
    let token = tokenArr[i]
    if (result === null) {
      if (data.hasOwnProperty(token)) {
        result = data[token]
      } else {
        break
      }
    } else if (result.hasOwnProperty(token)) {
      result = result[token]
    } else {
      break
    }
  }
  return result
}
</script>

<style lang="css">
</style>