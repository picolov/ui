<template>
  <div class="animated fadeIn">
    <div class="row py-1" v-for="(colComponentList, index) in rowComponentList" :key="index">
      <div v-for="(component, index) in colComponentList" :key="index" :class="['col-' + component.width]">
        <span v-if="component.type === 'label' && component.text && !component.model" :class="{'float-right':component.h_align==='right'}">
          <label :id="component.id">{{component.text | translate}}</label>
        </span>
        <span v-if="component.type === 'label' && !component.text && component.model" :class="{'float-right':component.h_align==='right'}">
          <label :id="component.id">{{getObjectFromString(component.model)}}</label>
        </span>
        <span v-if="component.type === 'textfield'"  :class="{'float-right':component.h_align==='right'}">
          <b-form-input :id="component.id" type="text" v-model="data[component.model]"></b-form-input>
        </span>
        <span v-if="component.type === 'numberfield'"  :class="{'float-right':component.h_align==='right'}">
          <b-form-input :id="component.id" type="number" v-model="data[component.model]"></b-form-input>
        </span>
        <span v-if="component.type === 'datepicker'"  :class="{'float-right':component.h_align==='right'}">
          <date-picker :id="component.id" format="yyyy-MM-dd" v-model="data[component.model]" lang="en" width="100%" class="full-width"/>
        </span>
        <span v-if="component.type === 'daterangepicker'"  :class="{'float-right':component.h_align==='right'}">
          <date-picker :id="component.id" range="true" format="yyyy-MM-dd" v-model="data[component.model]" lang="en" width="100%" class="full-width"/>
        </span>
        <span v-if="component.type === 'dropdown' && component.data"  :class="{'float-right':component.h_align==='right'}">
          <b-form-select :id="component.id" v-model="data[component.model]" :options="component.data"></b-form-select>
        </span>
        <span v-if="component.type === 'dropdown' && component.source"  :class="{'float-right':component.h_align==='right'}">
          <b-form-select :id="component.id" :value="dropdownValue(data[component.model])" @input="dropdownInput(component, $event)" :options="options[component.source.model]"></b-form-select>
        </span>
        <span v-if="component.type === 'table' && fields[component.id] != null">
          <b-table :ref="component.id"
            bordered
            head-variant="dark"
            :apiUrl="component.id + ';' + component.model"
            :items="myProvider" 
            :fields="fields[component.id]" 
            :current-page="currentPage[component.id]"
            :per-page="perPage[component.id]">
            <template v-for="field in fields[component.id]" :slot="'HEAD_' + field.key" v-if="field.key != 'actions'" slot-scope="data">
              <h6 class="text-center" :key="field.key">{{data.label}}</h6>
              <input type="text" @click.stop=";" v-model="filter[component.id][field.key]" @keyup="filterTyped(component)" :key="field.key" style="width: 100%;"/>
            </template>
            <template slot="HEAD_actions" v-if="component.actions != undefined" slot-scope="data">
              <h6 class="text-center">{{data.label}}</h6>
            </template>
            <template slot="actions" v-if="component.actions != undefined" slot-scope="row">
              <b-button v-for="(action, index) in component.actions" :key="index" size="sm" @click.stop="rowActionClick(row.item, row.index, component, action)" class="row-action-button">
                <i :class="[action.icon]"></i>
              </b-button>
            </template>
          </b-table>
          <b-pagination :total-rows="totalRows[component.id]" :per-page="perPage[component.id]" v-model="currentPage[component.id]" align="center"/>
        </span>
        <span v-if="component.type === 'button'"  :class="{'float-right':component.h_align==='right'}">
          <b-button :id="component.id" @click="btnClick(component)">{{component.text | translate}}</b-button>
        </span>
        <span v-if="component.type === 'space'"></span>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import { SET_PAGE } from '../store/mutation-types'
import api from '../api/common'

export default {
  name: 'genericPage',
  data () {
    return {
      id: '',
      rowComponentList: [],
      data: {},
      options: {},

      isBusy: {},
      fields: {},
      filter: {},
      currentPage: {},
      perPage: {},
      totalRows: {}
      /*
      isBusy: false,
      fields: [ ],
      filter: {},
      currentPage: 1,
      perPage: 5,
      totalRows: 0
      */
    }
  },
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.fetchData()
  },
  watch: {
    // call again the method if the route changes
    '$route': 'fetchData'
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    fetchData () {
      // resetting local state
      this.id = ''
      this.rowComponentList = []
      this.data = {}
      this.options = {}
      this.isBusy = {}
      this.fields = {}
      this.filter = {}
      this.currentPage = {}
      this.perPage = {}
      this.totalRows = {}

      // load layout
      api.get(
        'generic/layout/name/' + this.$route.params.page,
        (response) => {
          let page = response.data
          this.id = page.id
          this.$store.commit(SET_PAGE, page.title)
          // get init action
          if (page.init) {
            for (let i = 0; i < page.init.length; i++) {
              let action = page.init[i]
              this.processAction(action, null, null, null, this.$route.query)
            }
          }
          let componentList = page.content
          this.rowComponentList = orderComponentList(componentList)
          // get all options data
          for (let row = 0; row < this.rowComponentList.length; row++) {
            let colComponentList = this.rowComponentList[row]
            for (let col = 0; col < colComponentList.length; col++) {
              let component = colComponentList[col]
              if (component.type === 'dropdown' && component.source) {
                api.get('generic/class/' + component.source.model,
                  (response) => {
                    let optionList = []
                    for (let i = 0; i < response.data.length; i++) {
                      let option = response.data[i]
                      option.value = option[component.source.value]
                      option.text = option[component.source.text]
                      optionList.push(option)
                    }
                    Vue.set(this.options, component.source.model, optionList)
                  },
                  () => { }
                )
              } else if (component.type === 'table') {
                Vue.set(this.fields, component.id, [])
                Vue.set(this.isBusy, component.id, false)
                Vue.set(this.filter, component.id, {})
                Vue.set(this.currentPage, component.id, 1)
                Vue.set(this.perPage, component.id, 5)
                Vue.set(this.totalRows, component.id, 0)
                for (let i = 0; i < component.fields.length; i++) {
                  let field = component.fields[i]
                  // let columnMap = {key: field.key, label: field.label, sortable: field.sortable, class: field.class}
                  if (field.type === 'date') {
                    field.formatter = 'tableCellAsDate'
                  }
                  this.fields[component.id].splice(this.fields[component.id].length, 1, field)
                }
                this.fields[component.id].splice(this.fields[component.id].length, 1, { key: 'actions', label: 'Actions' })
              }
            }
          }
        },
        () => {
          console.log('ERROR when loading page ' + this.$route.params.page)
        }
      )
    },
    myProvider (ctx, callback) {
      let token = ctx.apiUrl.split(';')
      let compId = token[0]
      let apiUrl = token[1]
      this.isBusy[compId] = true
      let empty = []
      let filter = this.filter[compId]
      let params = '?page=' + (ctx.currentPage - 1) + '&size=' + ctx.perPage
      if (ctx.sortBy) {
        params = params + '&sort=' + ctx.sortBy + ';' + (ctx.sortDesc ? 'desc' : 'asc')
      }
      let hasFilter = false
      let filterCrit = ''
      for (var key in filter) {
        if (filter.hasOwnProperty(key) && filter[key] != null && filter[key].length > 0) {
          hasFilter = true
          if (filterCrit.length === 0) {
            filterCrit = key + ';filter;' + filter[key]
          } else {
            filterCrit = filterCrit + ',' + key + ';filter;' + filter[key]
          }
        }
      }
      if (hasFilter) {
        params = params + '&criteria=' + filterCrit
      }
      api.get(
        'generic/class/findAllWithTotal/' + apiUrl + params,
        (response) => {
          let dataMap = response.data
          this.totalRows[compId] = dataMap.totalRows
          callback(dataMap.list)
        },
        () => {
          this.totalRows[compId] = 0
          callback(empty)
        }
      )
      // Must return null or undefined to signal b-table that callback is being used
      return null
    },
    rowActionClick (item, index, component, action) {
      this.processAction(action, component, item, index, this.$route.query)
    },
    filterTyped (component) {
      this.$refs[component.id][0].refresh()
    },
    btnClick (component) {
      this.processAction(component.action, component, null, null, this.$route.query)
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
          let payload = {}
          if (action.data) {
            for (let i = 0; i < action.data.length; i++) {
              let sentKey = action.data[i]
              if (action.unprefix) {
                sentKey = replaceAll(action.unprefix + '_', '', sentKey)
              }
              payload[sentKey] = this.data[action.data[i]]
            }
          } else {
            payload = this.data
          }
          console.log(payload)
          switch (action.method) {
            case 'post':
              api.post(component.action.url, payload,
                (response) => {
                  this.$swal('Success', 'Data Successfully Submitted', 'success').then(() => {
                    if (component.action.redirect) {
                      this.$router.push({ path: component.action.redirect })
                    }
                  })
                },
                () => {
                  console.log('ERROR button click' + component.type + '-' + component.text)
                }
              )
              break
            case 'put':
              api.put(component.action.url, payload,
                (response) => {
                  this.$swal('Success', 'Data Successfully Submitted', 'success').then(() => {
                    if (component.action.redirect) {
                      this.$router.push({ path: component.action.redirect })
                    }
                  })
                },
                () => {
                  console.log('ERROR button click' + component.type + '-' + component.text)
                }
              )
              break
            case 'get':
              api.get(
                url,
                (response) => {
                },
                () => {
                }
              )
              break
            case 'delete':
              this.$swal({
                title: 'Are you sure?',
                text: 'Once deleted, you will not be able to recover the data',
                icon: 'warning',
                buttons: true,
                dangerMode: true
              }).then((isDelete) => {
                if (isDelete) {
                  api.delete(
                    url,
                    (response) => {
                      if (component.type === 'table') {
                        this.$refs[component.id][0].refresh()
                      }
                    },
                    () => {
                    }
                  )
                }
              })
              break
          }
          break
      }
    },
    dropdownValue (value) {
      if (value !== null && typeof value === 'object' && value._id) {
        if (value._id) return value._id
        else if (value.id) return value.id
        else return value
      } else {
        return value
      }
    },
    dropdownInput (component, value) {
      let option = this.options[component.source.model]
      if (option) {
        for (let i = 0; i < option.length; i++) {
          if (option[i].value === value) {
            this.data[component.model] = option[i]
            break
          }
        }
      }
    },
    labelValue (component) {
      let result = component.text ? component.text : (component.model ? getObjectFromString(this.data, component.model) : '')
      return result
    },
    tableCellAsDate (value, key, item) {
      let format = 'YYYY-MM-DD'
      let utcTime = moment.utc(value, 'x')
      // momentjs is mutable, doing moment.utc(value, 'x').local() will change all
      let localTime = moment(utcTime).local()
      return localTime.format(format)
    },
    getObjectFromString (key) {
      return getObjectFromString(this.data, key)
    }
  }
}

function orderComponentList (componentList) {
  let result = []
  // group all row component
  let rowMap = {}
  let maxRow = 0
  for (let i = 0; i < componentList.length; i++) {
    let component = componentList[i]
    if (component.row > maxRow) maxRow = component.row
    if (rowMap[component.row]) {
      rowMap[component.row].push(component)
    } else {
      rowMap[component.row] = [component]
    }
  }
  // sorting each column of row to start from little column number
  for (let property in rowMap) {
    if (rowMap.hasOwnProperty(property)) {
      rowMap[property].sort(function (comp1, comp2) {
        return comp1.col - comp2.col
      })
      let rowContent = []
      let colComponentList = rowMap[property]
      // add space to gap between columns
      let currentCol = 1
      for (let i = 0; i < colComponentList.length; i++) {
        let colComponent = colComponentList[i]
        if (colComponent.col > currentCol) {
          rowContent.push({'row': property - 0, 'col': currentCol, 'width': colComponent.col - currentCol, 'type': 'space'})
          rowContent.push(colComponent)
        } else {
          rowContent.push(colComponent)
        }
        currentCol = colComponent.col + colComponent.width
      }
      if (currentCol < 12) {
        rowContent.push({'row': property - 0, 'col': currentCol, 'width': 12 - (currentCol - 1), 'type': 'space'})
      }
      rowMap[property] = rowContent
    }
  }

  for (let i = 0; i <= maxRow; i++) {
    if (rowMap.hasOwnProperty(i)) {
      result.push(rowMap[i])
    }
  }
  return result
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

function escapeRegExp (str) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')
}

function replaceAll (find, replace, str) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace)
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