<template>
  <component :is="attr.viewAs?attr.viewAs:'div'" :class="{'w-100':fullwidth}">
    <div class="row py-1" v-for="(colComponentList, indexRow) in rowComponentList" :key="indexRow">
      <div v-for="(cellComponent, indexCol) in colComponentList" :key="indexCol" :style="cellComponent.style" :class="[cellComponent.isGroup?'group-cell':null, cellComponent.noMargin? 'm-0': null, cellComponent.noPadding? 'p-0': null, cellComponent.align?'align-' + cellComponent.align: null, cellComponent.width?'col-' + cellComponent.width:'col', cellComponent.offset?'offset-' + cellComponent.offset:null]">
        <template v-for="(component, indexCell) in cellComponent.content" v-if="component.ifCondition ? evaluateString(component.ifCondition, component, data) : true">
          <!-- Container -->
          <span v-if="component.type === 'container'" :class="{'float-right':component.h_align==='right', 'w-100':component.fullwidth !== false}" :key="indexCell">
            <generic-container :id="component.id" :components="component.content" :attr="component" :data="data" :fullwidth="component.fullwidth" :style="component.style"/>
          </span>
          <span v-else-if="component.type === 'tabs'" :class="{'float-right':component.h_align==='right', 'w-100':component.fullwidth !== false}" :key="indexCell">
            <generic-tabs :id="component.id" :components="component.content" :data="data" :fullwidth="component.fullwidth" :style="component.style"/>
          </span>
          <span v-else-if="component.type === 'multistep'" :class="{'float-right':component.h_align==='right', 'w-100':component.fullwidth !== false}" :key="indexCell">
            <generic-multistep :id="component.id" :components="component.content" :data="data" :back-button-text="component.backButtonText" :next-button-text="component.nextButtonText" :finish-button-text="component.finishButtonText" @finish="btnClick(component.finishAction, component)" :fullwidth="component.fullwidth" :style="component.style"/>
          </span>
          <!-- Basic Component -->
          <span v-else-if="component.type === 'hline'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <hr :style="component.style"/>
          </span>
          <span v-else-if="component.type === 'label' && component.text && !component.model" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <component :is="component.viewAs?component.viewAs:'label'" :id="component.id" :style="[component.style, {margin: 0, paddingTop: '0.5em'}]">{{component.text | translate}} <small v-if="component.mandatory" class="text-danger">*</small></component>
          </span>
          <span v-else-if="component.type === 'label' && !component.text && component.model" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <label :id="component.id" :style="[component.style, {margin: 0, paddingTop: '0.5em'}]">{{getObjectFromString(component.model)}}</label>
          </span>
          <span v-else-if="component.type === 'imageb64' && !component.source && component.model" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-img-lazy :id="component.id" :style="component.style" :src="getObjectFromString(component.model)?getObjectFromString(component.model):''" :rounded="component.shape==='circle'?'circle':'0'" :width="component.imgWidth" :height="component.imgHeight" />
          </span>
          <span v-else-if="component.type === 'imageb64' && component.source && !component.model" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-img-lazy :id="component.id" :style="component.style" :src="component.source" :rounded="component.shape==='circle'?'circle':'0'" :width="component.imgWidth" :height="component.imgHeight" />
          </span>
          <span v-else-if="component.type === 'uploadFile'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <generic-filebase64 
              :id="component.id" :style="component.style"
              accept="image/png,image/jpeg"
              @file="(file) => {}"
              @load="(dataUri) => { uploadb64(data, component, dataUri) }"
              :disable-preview = "true"
              :placeholder="component.text | translate" />
          </span>
          <span v-else-if="component.type === 'textfield'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-form-input :id="component.id" type="text" :name="component.model" v-model="data[component.model]" v-validate="!component.validation ? '' : component.validation.join('|')" :data-vv-as="component.label | translate" :state="errors.has(component.model) ? false : null" :style="component.style"/>
          </span>
          <span v-else-if="component.type === 'numberfield'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-form-input :id="component.id" type="number" :name="component.model" v-model="data[component.model]" v-validate="!component.validation ? '' : component.validation.join('|')" :data-vv-as="component.label | translate" :state="errors.has(component.model) ? false : null" :style="component.style"/>
          </span>
          <span v-else-if="component.type === 'passwordfield'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-form-input :id="component.id" type="password" :name="component.model" v-model="data[component.model]" v-validate="!component.validation ? '' : component.validation.join('|')" :data-vv-as="component.label | translate" :state="errors.has(component.model) ? false : null" :style="component.style"/>
          </span>
          <span v-else-if="component.type === 'emailfield'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-form-input :id="component.id" type="email" :name="component.model" v-model="data[component.model]" v-validate="!component.validation ? '' : component.validation.join('|')" :data-vv-as="component.label | translate" :state="errors.has(component.model) ? false : null" :style="component.style"/>
          </span>
          <span v-else-if="component.type === 'datepicker'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <date-picker :id="component.id" format="yyyy-MM-dd" :name="component.model" v-model="data[component.model]" v-validate="!component.validation ? '' : component.validation.join('|')" :data-vv-as="component.label | translate" :state="errors.has(component.model) ? false : null" lang="en" width="100%" class="full-width" :style="component.style"/>
          </span>
          <span v-else-if="component.type === 'daterangepicker'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <date-picker :id="component.id" range="true" format="yyyy-MM-dd" :name="component.model" v-model="data[component.model]" lang="en" width="100%" class="full-width" v-validate="!component.validation ? '' : component.validation.join('|')" :data-vv-as="component.label | translate" :state="errors.has(component.model) ? false : null" :style="component.style"/>
          </span>
          <span v-else-if="component.type === 'dropdown' && component.data" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-form-select :id="component.id" :name="component.model" v-model="data[component.model]" :options="component.data" :style="component.style"></b-form-select>
          </span>
          <span v-else-if="component.type === 'dropdown' && component.source" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-form-select :id="component.id" :name="component.model" :value="dropdownValue(data[component.model])" @input="dropdownInput(component, $event)" :options="options[component.source.model]" :style="component.style"></b-form-select>
          </span>
          <span v-else-if="component.type === 'radiobutton' && component.data" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-form-radio-group :id="component.id" :name="component.model" v-model="data[component.model]" :options="component.data" :style="component.style"/>
          </span>
          <span v-else-if="component.type === 'radiobutton' && component.source" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-form-radio-group :id="component.id" :name="component.model" :value="dropdownValue(data[component.model])" @input="dropdownInput(component, $event)" :options="options[component.source.model]" :style="component.style"/>      
          </span>
          <span v-else-if="component.type === 'checkbox' && component.data" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-form-checkbox-group :id="component.id" :name="component.model" v-model="data[component.model]" :options="component.data" :style="component.style"/>
          </span>
          <span v-else-if="component.type === 'checkbox' && component.source" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-form-checkbox-group :id="component.id" :name="component.model" :checked="checkboxValue(data[component.model])" @input="checkboxInput(component, $event)" :options="options[component.source.model]" :style="component.style"/>      
          </span>
          <span v-else-if="component.type === 'button'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-button :id="component.id" @click="btnClick(component.action, component)" :style="[component.style, component.style == null || component.style.width == null ? {minWidth: '120px'}:null]"><i v-if="component.icon" :class="[component.icon]"/> {{component.text | translate}}</b-button>
          </span>
          <!-- Complex Component -->
          <span v-else-if="component.type === 'map'" :key="indexCell">
            <gmap-map
              :center="{lat:-6.2152408, lng:106.8301251}"
              :zoom="12"
              map-type-id="hybrid"
              style="width: 100%; height: 300px"
              :options="{
                fullscreenControl: false,
                mapTypeControl: false,
                zoomControl: true,
                zoomControlOptions: {
                  position: 9
                },
                rotateControl: false,
                scaleControl: true,
                scaleControlOptions: {
                  position: 12
                },
                streetViewControl: false,
                backgroundColor: 'grey',
                scrollwheel: false
              }"
              :key="indexCell">
            </gmap-map>
          </span>
          <span v-else-if="component.type === 'table' && fields[component.id] != null" :key="indexCell">
            <b-table :ref="component.id"
              head-variant="dark"
              :apiUrl="component.id + ';' + component.model"
              :items="myProvider" 
              :fields="fields[component.id]" 
              :current-page="currentPage[component.id]"
              :per-page="perPage[component.id]"
              :style="component.style">
              <template v-for="field in fields[component.id]" :slot="'HEAD_' + field.key" v-if="field.key != 'actions'" slot-scope="data">
                <h6 class="text-center" :key="field.key">{{data.label | translate}}</h6>
                <input v-if="field.filter" type="text" @click.stop=";" v-model="filter[component.id][field.key]" @keyup="filterTyped(component)" :key="field.key" style="width: 100%;"/>
              </template>
              <template slot="HEAD_actions" v-if="component.actions != undefined" slot-scope="data">
                <h6 class="text-center">{{data.label | translate}}</h6>
              </template>
              <template slot="actions" v-if="component.actions != undefined" slot-scope="row">
                <b-button v-for="(action, index) in component.actions" :key="index" size="sm" @click.stop="rowActionClick(row.item, row.index, component, action)" class="row-action-button">
                  <i :class="[action.icon]"></i>
                </b-button>
              </template>
            </b-table>
            <b-pagination :total-rows="totalRows[component.id]" :per-page="perPage[component.id]" v-model="currentPage[component.id]" align="center"/>
          </span>
          <!-- Validation Addon -->
          <b-form-invalid-feedback v-if="component.validation" tag="span" :force-show="errors.has(component.model)" :key="indexCell">
            {{ errors.first(component.model) }}
          </b-form-invalid-feedback>
        </template>
      </div>
    </div>
  </component>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import bCard from 'bootstrap-vue/es/components/card/card'
import api from '../api/common'

export default {
  name: 'generic-container',
  components: {
    card: bCard
  },
  props: {
    components: {
      type: Array,
      required: true,
      default: () => []
    },
    attr: {
      type: Object,
      required: false,
      default: () => {
        return {
          viewAs: 'card'
        }
      }
    },
    data: {
      type: Object,
      required: true,
      default: () => {}
    },
    fullwidth: {
      type: Boolean,
      required: false,
      default: () => true
    }
  },
  data () {
    return {
      id: '',
      options: {},
      fields: {},
      filter: {},
      currentPage: {},
      perPage: {},
      totalRows: {}
    }
  },
  computed: {
    rowComponentList () {
      let componentList = orderComponentList(this.components)
      this.id = ''
      this.options = {}
      this.fields = {}
      this.filter = {}
      this.currentPage = {}
      this.perPage = {}
      this.totalRows = {}
      // get all options data
      for (let row = 0; row < componentList.length; row++) {
        let colComponentList = componentList[row]
        for (let col = 0; col < colComponentList.length; col++) {
          let cellComponentGroup = colComponentList[col]
          let cellComponentList = cellComponentGroup.content
          for (let cellNum = 0; cellNum < cellComponentList.length; cellNum++) {
            let component = cellComponentList[cellNum]
            if ((component.type === 'dropdown' || component.type === 'radiobutton' || component.type === 'checkbox') && component.source) {
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
              if (component.criteria) {
                let filterCrit = {}
                let processedCrit = stringInject(component.criteria, this.data)
                let tokenListCrit = processedCrit.split(',')
                for (let i = 0; i < tokenListCrit.length; i++) {
                  let tokenCrit = tokenListCrit[i].split(';')
                  let critKey = tokenCrit[0]
                  let critVal = tokenCrit[2]
                  filterCrit[critKey] = critVal
                }
                Vue.set(this.filter, component.id, filterCrit)
              } else {
                Vue.set(this.filter, component.id, {})
              }
              Vue.set(this.currentPage, component.id, 1)
              Vue.set(this.perPage, component.id, 5)
              Vue.set(this.totalRows, component.id, 0)
              for (let i = 0; i < component.fields.length; i++) {
                let field = component.fields[i]
                // let columnMap = {key: field.key, label: field.label, sortable: field.sortable, class: field.class}
                if (field.type === 'date') {
                  field.formatter = (value, key, item) => {
                    let format = 'YYYY-MM-DD'
                    if (field.format) format = field.format
                    let utcTime = moment.utc(getObjectFromString(item, key), 'x')
                    // momentjs is mutable, doing moment.utc(value, 'x').local() will change all
                    let localTime = moment(utcTime).local()
                    return localTime.format(format)
                  }
                } else if (field.type === 'stringlist') {
                  if (field.source) {
                    api.get('generic/class/' + field.source.model,
                      (response) => {
                        let optionList = []
                        for (let i = 0; i < response.data.length; i++) {
                          let option = response.data[i]
                          option.value = option[field.source.value]
                          option.text = option[field.source.text]
                          optionList.push(option)
                        }
                        Vue.set(this.options, field.source.model, optionList)
                      },
                      () => { }
                    )
                  }
                  field.formatter = (value, key, item) => {
                    let val = getObjectFromString(item, key)
                    let result = ''
                    if (field.source && val && this.options[field.source.model]) {
                      let option = this.options[field.source.model]
                      let optionMap = {}
                      for (let j = 0; j < option.length; j++) {
                        optionMap[option[j].value] = option[j]
                      }
                      for (let k = 0; k < val.length; k++) {
                        if (result === '') {
                          if (optionMap.hasOwnProperty(val[k])) result += optionMap[val[k]].text
                          else result += '<' + val[k] + '>'
                        } else {
                          if (optionMap.hasOwnProperty(val[k])) result += ', ' + optionMap[val[k]].text
                          else result += ', <' + val[k] + '>'
                        }
                      }
                    } else if (field.data && val) {
                      let option = field.data
                      let optionMap = {}
                      for (let j = 0; j < option.length; j++) {
                        optionMap[option[j].value] = option[j]
                      }
                      for (let k = 0; k < val.length; k++) {
                        if (result === '') {
                          result += optionMap[val[k]].text
                        } else {
                          result += ', ' + optionMap[val[k]].text
                        }
                      }
                    }
                    return result
                  }
                } else {
                  field.formatter = (value, key, item) => {
                    return getObjectFromString(item, key)
                  }
                }
                this.fields[component.id].splice(this.fields[component.id].length, 1, field)
              }
              this.fields[component.id].splice(this.fields[component.id].length, 1, { key: 'actions', label: 'Actions' })
            }
          }
        }
      }
      return componentList
    }
  },
  mounted () {
  },
  methods: {
    myProvider (ctx, callback) {
      let token = ctx.apiUrl.split(';')
      let compId = token[0]
      let apiUrl = token[1]
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
    btnClick (action, component) {
      this.processAction(action, component, null, null, this.$route.query)
    },
    processAction (action, component, item, index, urlParam) {
      let mapInject = {item: item, urlParam: urlParam, index: index, component: component, action: action}
      let url = stringInject(action.url, mapInject)
      switch (action.type) {
        case 'getData':
          if (action.method && action.method === 'post') {
            api.post(url, {},
              (response) => {
                for (let key in response.data) {
                  Vue.set(this.data, action.prefix ? action.prefix + '_' + key : key, response.data[key])
                }
              },
              () => { }
            )
          } else {
            api.get(url,
              (response) => {
                for (let key in response.data) {
                  Vue.set(this.data, action.prefix ? action.prefix + '_' + key : key, response.data[key])
                }
              },
              () => { }
            )
          }
          break
        case 'goto':
          this.$router.push({ path: url })
          break
        case 'goback':
          this.$router.go(-1)
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
    },
    execForm (action, component, item, index, urlParam) {
      let mapInject = {item: item, urlParam: urlParam, index: index, component: component, action: action}
      let url = stringInject(action.url, mapInject)
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
    checkboxValue (value) {
      return value
    },
    checkboxInput (component, value) {
      if (value) this.data[component.model] = value
    },
    labelValue (component) {
      let result = component.text ? component.text : (component.model ? getObjectFromString(this.data, component.model) : '')
      return result
    },
    getObjectFromString (key) {
      let result = getObjectFromString(this.data, key)
      if (result instanceof Array) {
        return result.join(', ')
      } else {
        return result
      }
    },
    evaluateString (strStatement, component, data) {
      // eslint-disable-next-line no-eval
      return eval(strStatement)
    },
    uploadb64 (data, component, dataUri) {
      Vue.set(data, component.model, dataUri)
    }
  }
}

function orderComponentList (componentList) {
  let result = []
  // group all row component
  let rowMap = {}
  let maxRow = 0
  componentList.sort(function (comp1, comp2) {
    if (!comp1.row && !comp2.row) return -1
    else if (comp1.row && !comp2.row) return -1
    else if (!comp1.row && comp2.row) return 1
    else return comp1.row - comp2.row
  })
  for (let i = 0; i < componentList.length; i++) {
    let component = componentList[i]
    if (!component.row) component.row = maxRow + 1
    if (component.row > maxRow) maxRow = component.row
    if (rowMap[component.row]) {
      rowMap[component.row].push(component)
    } else {
      rowMap[component.row] = [component]
    }
  }
  // sorting each column of row to start from little column number
  for (let row in rowMap) {
    if (rowMap.hasOwnProperty(row)) {
      rowMap[row].sort(function (comp1, comp2) {
        if (!comp1.col && !comp2.col) return -1
        else if (comp1.col && !comp2.col) return -1
        else if (!comp1.col && comp2.col) return 1
        else return comp1.col - comp2.col
      })
      // change rowMap[row] from list of component to list of [component, component,...]
      for (let i = 0; i < rowMap[row].length; i++) {
        let component = rowMap[row][i]
        if (component.type === 'group') {
          component.isGroup = true
          rowMap[row][i] = component
        } else {
          rowMap[row][i] = { isGroup: false, col: component.col, width: component.width, row: component.row, offset: component.offset, align: component.align, noPadding: component.noPadding, content: [component] }
        }
      }
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
/*
function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}
*/
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

  .align-center {
    text-align: center;
  }

  .align-right {
    text-align: right;
  }

  .align-left {
    text-align: left;
  }
</style>
