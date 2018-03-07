<template>
  <div>
    <b-img :src="data?data.imgUrl:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8Vw8AAmEBb87E6jIAAAAASUVORK5CYII='" fluid style="float: left;width: 130px; height: 80px"/>
    <v-select 
      :id="attr.id" 
      :value="dropdownValue(data)" 
      @input="dropdownInput(attr.model + arraySequence, attr, $event)" 
      :options="optionList" 
      :label="attr.source.text"
      :style="attr.style"
      class="a-dropDownImage">
      <template slot="option" slot-scope="option">
          <b-img fluid :src="option.imgUrl" style="width: 130px; height: 80px"/>
          {{ option.name }}
      </template>
    </v-select>
  </div>
</template>

<script>
import { UPDATE_DATA, REFRESH_COMPONENT } from '../store/mutation-types'
import api from '../api/common'

export default {
  name: 'a-dropDownImage',
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
    refreshOn () {
      if (this.attr.refreshOn) {
        return this.$store.state.generic.data[this.dataId][this.attr.refreshOn]
      } else {
        return false
      }
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
          api.post(this.$util.stringInject(this.attr.source.url, {data: this.$store.state.generic.data[this.dataId], props: this.$props}), {},
            (response) => {
              this.optionList = response.data
            },
            () => {
              this.optionList = []
            }
          )
        } else {
          api.get(this.$util.stringInject(this.attr.source.url, {data: this.$store.state.generic.data[this.dataId], props: this.$props}),
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
</style>

