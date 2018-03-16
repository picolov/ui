<template>
  <v-select 
    class="a-dropDown"
    :id="attr.id" 
    :name="attr.model + arraySequence" 
    :value="dropdownValue(data)" 
    @input="dropdownInput(attr.model + arraySequence, attr, $event)" 
    :options="optionList"
    :label="attr.source.text"
    multiple
    :style="attr.style" 
    :placeholder="attr.placeholder">
  </v-select>
</template>

<script>
import { UPDATE_DATA, REFRESH_COMPONENT } from '../store/mutation-types'
import api from '../api/common'

export default {
  name: 'a-dropDown',
  props: {
    attr: {
      type: Object,
      required: true,
      default: () => {}
    },
    arraySequence: {
      type: String,
      required: false,
      default: () => ''
    },
    dataId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      optionList: []
    }
  },
  computed: {
    theValue () {
      let value = []
      if (this.data) {
        for (let i = 0; i < this.data.length; i++) {
          value.push(this.data[i])
        }
      }
      return value
    },
    data: {
      get () {
        return this.$store.state.generic.data[this.dataId][this.attr.model + this.arraySequence]
      },
      set (value) {
        this.$store.commit(UPDATE_DATA, {id: this.dataId, key: this.attr.model + this.arraySequence, value: value})
      }
    }
  },
  mounted () {
    this.fetchOption()
  },
  methods: {
    fetchOption () {
      if (this.attr.source) {
        if (this.attr.source.model && !this.attr.source.url) this.attr.source.url = 'generic/class/' + this.attr.source.model
        if (this.attr.source.method && this.attr.source.method === 'post') {
          api.post(this.$util.stringInject(this.attr.source.url, {data: this.$store.state.generic.data[this.dataId], props: this.$props}, this.dataId), {},
            (response) => {
              this.optionList = response.data
            },
            () => {
              this.optionList = []
            }
          )
        } else {
          api.get(this.$util.stringInject(this.attr.source.url, {data: this.$store.state.generic.data[this.dataId], props: this.$props}, this.dataId),
            (response) => {
              this.optionList = response.data
            },
            () => {
              this.optionList = []
            }
          )
        }
      }
    },
    dropdownValue (value) {
      return this.theValue
    },
    dropdownInput (model, component, value) {
      if (this.data) {
        let checkSame = 0
        for (let i = 0; i < value.length; i++) {
          for (let j = 0; j < this.data.length; j++) {
            if (value[i][this.attr.source.value] === this.data[j][this.attr.source.value]) {
              checkSame++
            }
          }
        }
        if (checkSame !== value.length) {
          if (component.source) {
            this.data = value
            if (component.refreshId) {
              this.$store.commit(REFRESH_COMPONENT, {id: component.refreshId})
            }
          }
        }
      } else {
        if (component.source) {
          this.data = value
          if (component.refreshId) {
            this.$store.commit(REFRESH_COMPONENT, {id: component.refreshId})
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.a-dropDown {
}
</style>

