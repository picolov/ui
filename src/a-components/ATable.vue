<template>
  <div>
    <b-table :ref="attr.id"
      head-variant="dark"
      :items="myProvider" 
      :fields="fields" 
      :current-page="currentPage"
      :per-page="perPage"
      :style="attr.style">
      <template v-for="field in fields" :slot="'HEAD_' + field.key" v-if="field.key != 'actions'" slot-scope="data">
        <h6 class="text-center" :key="field.key">{{data.label | translate}}</h6>
        <input v-if="field.filter" type="text" @click.stop=";" :value="filterValue(field.key)" @input="filterInput(field.key, $event)" :key="field.key" style="width: 100%;"/>
      </template>
      <template v-for="field in fields" :slot="field.key" v-if="field.key != 'actions'" slot-scope="data">
        {{data.value}}
      </template>
      <template slot="HEAD_actions" v-if="attr.actions != undefined" slot-scope="data">
        <h6 class="text-center">{{data.label | translate}}</h6>
      </template>
      <template slot="actions" v-if="attr.actions != undefined" slot-scope="row">
        <template v-for="(action, index) in attr.actions" v-if="action.ifCondition ? $util.evaluateString.bind(this)(action.ifCondition, attr, row.item, row.index) : true">
          <template v-if="action.component && action.component === 'switch'">
            <toggle-button @change="rowActionClick(row.item, row.index, attr, action)" :height="30" :color="{checked: '#ffc928', unchecked: '#ffffff'}" v-model="row.item[action.model]" :style="attr.style" :key="index" style="margin-right: 0.5em"/>
          </template>
          <template v-else>
            <b-button size="sm" @click.stop="rowActionClick(row.item, row.index, attr, action)" class="row-action-button" :key="index" style="margin-right: 0.5em">
              <i v-if="action.icon" :class="[action.icon]"></i> {{action.text | translate}}
            </b-button>
          </template> 
        </template>
      </template>
    </b-table>
    <b-pagination :total-rows="totalRows" :per-page="perPage" v-model="currentPage" align="center"/>
  </div>
</template>

<script>
import { UPDATE_DATA, UPDATE_COMPONENT, FINISH_REFRESH_COMPONENT } from '../store/mutation-types'
import moment from 'moment'
import api from '../api/common'
// TODO for other component (ex. inputTextFilter) to modify the filter, the component will suplly method to be called with the filter as param
export default {
  name: 'a-table',
  props: {
    attr: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data () {
    return {
      fields: [],
      currentPage: 1,
      perPage: 5,
      totalRows: 0,
      options: {}
    }
  },
  computed: {
    data: {
      get () {
        return this.$store.state.generic.data[this.attr.model]
      },
      set (value) {
        this.$store.commit(UPDATE_DATA, {key: this.attr.model, value: value})
      }
    },
    refreshComponentList () {
      return this.$store.state.generic.componentToRefresh
    }
  },
  watch: {
    refreshComponentList (newList, oldList) {
      if (newList.length > 0 && newList.indexOf(this.attr.id) > -1) {
        this.$refs[this.attr.id].refresh()
        this.$store.commit(FINISH_REFRESH_COMPONENT, {id: this.attr.id})
      }
    }
  },
  methods: {
    myProvider (ctx, callback) {
      if (this.$store.state.generic.component[this.attr.id]) {
        let empty = []
        let params = '?page=' + (ctx.currentPage - 1) + '&size=' + ctx.perPage
        if (ctx.sortBy) {
          params = params + '&sort=' + ctx.sortBy + ';' + (ctx.sortDesc ? 'desc' : 'asc')
        }
        let hasFilter = false
        let filterCrit = ''
        this.filter = this.$store.state.generic.component[this.attr.id]['filter']
        if (this.attr.criteria) {
          let processedCrit = this.$util.stringInject(this.attr.criteria, this.$store.state.generic.data)
          if (processedCrit) {
            let tokenListCrit = processedCrit.split(',')
            for (let i = 0; i < tokenListCrit.length; i++) {
              let tokenCrit = tokenListCrit[i].split(';')
              let critKey = tokenCrit[0]
              let critOps = tokenCrit[1]
              let critVal = tokenCrit[2]
              // this.filter[critKey] = critOps + ':' + critVal
              this.$store.commit(UPDATE_COMPONENT, {id: this.attr.id, attr: 'filter', key: critKey, value: critOps + ':' + critVal})
            }
          }
        }
        for (var key in this.filter) {
          if (this.filter.hasOwnProperty(key) && this.filter[key] != null && this.filter[key].length > 0) {
            hasFilter = true
            let filterVal = this.filter[key]
            let filterOperator = 'filter'
            let pos = filterVal.indexOf(':')
            if (pos > -1) {
              filterOperator = filterVal.substr(0, pos)
              filterVal = filterVal.substr(pos + 1)
            }
            if (filterCrit.length === 0) {
              filterCrit = key + ';' + filterOperator + ';' + filterVal
            } else {
              filterCrit = filterCrit + ',' + key + ';' + filterOperator + ';' + filterVal
            }
          }
        }
        if (hasFilter) {
          params = params + '&criteria=' + filterCrit
        }
        if (this.attr.model) {
          this.totalRows = 0
          if (this.data) this.totalRows = this.data.length
          return this.data
        } else {
          if (this.attr.method === 'get') {
            api.get(
              this.attr.url + params,
              (response) => {
                let dataMap = response.data
                this.totalRows = dataMap.totalRows
                callback(dataMap.list)
              },
              () => {
                this.totalRows = 0
                callback(empty)
              }
            )
          } else if (this.attr.method === 'post') {
            api.post(
              this.attr.url + params, {},
              (response) => {
                let dataMap = response.data
                this.totalRows = dataMap.totalRows
                callback(dataMap.list)
              },
              () => {
                this.totalRows = 0
                callback(empty)
              }
            )
          }
        }
      }
      // Must return null or undefined to signal b-table that callback is being used
      return null
    },
    rowActionClick (item, index, component, action) {
      if (action === undefined) return
      this.$util.processAction(this, action, component, item, index, this.$route.query)
    },
    filterValue (key) {
      return this.$store.state.generic.data[this.attr.id]['filter'][key]
    },
    filterInput (key, value) {
      this.$store.commit(UPDATE_COMPONENT, {id: this.attr.id, attr: 'filter', key: key, value: value})
      this.$refs[this.attr.id].refresh()
    }
  },
  mounted () {
    this.$store.commit(UPDATE_COMPONENT, {id: this.attr.id, attr: 'filter'})
    this.fields = []
    this.currentPage = 1
    this.perPage = 5
    this.totalRows = 0
    this.options = {}
    if (this.attr.criteria) {
      let processedCrit = this.$util.stringInject(this.attr.criteria, this.data)
      if (processedCrit) {
        let tokenListCrit = processedCrit.split(',')
        for (let i = 0; i < tokenListCrit.length; i++) {
          let tokenCrit = tokenListCrit[i].split(';')
          let critKey = tokenCrit[0]
          let critOps = tokenCrit[1]
          let critVal = tokenCrit[2]
          this.filter[critKey] = critOps + ':' + critVal
        }
      } else {
      }
    } else {
    }

    for (let i = 0; i < this.attr.fields.length; i++) {
      let field = this.attr.fields[i]
      // let columnMap = {key: field.key, label: field.label, sortable: field.sortable, class: field.class}
      if (field.type === 'date') {
        field.formatter = (value, key, item) => {
          let format = 'YYYY-MM-DD'
          if (field.format) format = field.format
          let utcTime = moment.utc(this.$util.getObjectFromString(item, key), 'x')
          // momentjs is mutable, doing moment.utc(value, 'x').local() will change all
          let localTime = moment(utcTime).local()
          return localTime.format(format)
        }
      } else if (field.type === 'datetime') {
        field.formatter = (value, key, item) => {
          let format = 'YYYY-MM-DD h:mm:ss'
          if (field.format) format = field.format
          let utcTime = moment.utc(this.$util.getObjectFromString(item, key), 'x')
          // momentjs is mutable, doing moment.utc(value, 'x').local() will change all
          let localTime = moment(utcTime).local()
          return localTime.format(format)
        }
      } else {
        field.formatter = (value, key, item) => {
          return this.$util.getObjectFromString(item, key)
        }
      }
      this.fields.splice(this.fields.length, 1, field)
    }
    this.fields.splice(this.fields.length, 1, { key: 'actions', label: 'Actions' })
  }
}
</script>

<style lang="scss">
</style>

