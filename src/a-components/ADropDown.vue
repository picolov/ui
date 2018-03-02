<template>
  <v-select 
    class="a-dropDown"
    :id="attr.id" 
    :name="attr.model + arraySequence" 
    :value="dropdownValue(data)" 
    @input="dropdownInput(attr.model + arraySequence, attr, $event)" 
    :options="optionList" 
    :style="attr.style" 
    :label="attr.source.text"
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
    }
  },
  data () {
    return {
      optionList: []
    }
  },
  computed: {
    refreshOn () {
      if (this.attr.refreshOn) {
        return this.$store.state.generic.data[this.attr.refreshOn]
      } else {
        return false
      }
    },
    data: {
      get () {
        return this.$store.state.generic.data[this.attr.model + this.arraySequence]
      },
      set (value) {
        this.$store.commit(UPDATE_DATA, {key: this.attr.model + this.arraySequence, value: value})
      }
    }
  },
  watch: {
    refreshOn: {
      handler: function (newVal, oldVal) {
        if (oldVal !== newVal) {
          this.data = null
          this.fetchOption()
        }
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
          api.post(this.$util.stringInject(this.attr.source.url, {data: this.$store.state.generic.data, props: this.$props}), {},
            (response) => {
              this.optionList = response.data
            },
            () => {
              this.optionList = []
            }
          )
        } else {
          api.get(this.$util.stringInject(this.attr.source.url, {data: this.$store.state.generic.data, props: this.$props}),
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
      return value
    },
    dropdownInput (model, component, value) {
      this.data = value
      if (component.refreshId) {
        this.$store.commit(REFRESH_COMPONENT, {id: component.refreshId})
      }
    }
  }
}
</script>

<style lang="scss">
.a-dropDown {
}
</style>

