<template>
  <div class="animated fadeIn">
    <generic-container :name="id" :components="componentList" :view-as="viewAs" :data="data"/>
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
      componentList: [],
      viewAs: 'div',
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
      // load language
      this.$store.dispatch('loadLang', {pageLang: this.$route.params.page + '_' + Vue.i18n.locale(), instance: this})
      // load layout
      api.get(
        'generic/flow/path/' + this.$route.params.page,
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
          if (page.viewAs) this.viewAs = page.viewAs
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
  .table {display: table;}

  .table-cell {
      display: table-cell;
  }

  .vertical-align {
    vertical-align: middle;
  }

  .row-action-button {
    margin-right: 5px;
  }

  .mx-datepicker-popup {
    left: 0!important;
  }

  .full-width {
    width: 100%;
  }
</style>