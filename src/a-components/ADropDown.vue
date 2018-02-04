<template>
  <b-form-select 
    class="a-dropDown"
    :id="attr.id" 
    :name="attr.model + arraySequence" 
    :value="dropdownValue(data)" 
    @input="dropdownInput(attr.model + arraySequence, attr, $event)" 
    :options="attr.data ? attr.data : this.$store.state.generic.options[attr.source.model]" 
    :style="attr.style" 
    :placeholder="attr.placeholder">
  </b-form-select>
</template>

<script>
import { UPDATE_DATA, UPDATE_OPTION, REFRESH_COMPONENT } from '../store/mutation-types'
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
    }
  },
  computed: {
    data: {
      get () {
        return this.$store.state.generic.data[this.attr.model + this.arraySequence]
      },
      set (value) {
        this.$store.commit(UPDATE_DATA, {key: this.attr.model + this.arraySequence, value: value})
      }
    }
  },
  mounted () {
    if (this.attr.source) {
      api.get('generic/class/' + this.attr.source.model,
        (response) => {
          let optionList = []
          for (let i = 0; i < response.data.length; i++) {
            let option = response.data[i]
            option.value = option[this.attr.source.value]
            option.text = option[this.attr.source.text]
            optionList.push(option)
          }
          this.$store.commit(UPDATE_OPTION, {key: this.attr.source.model, option: optionList})
        },
        () => { }
      )
    }
  },
  methods: {
    dropdownValue (value) {
      if (value !== null && typeof value === 'object') {
        if (value._id) return value._id
        else if (value.id) return value.id
        else if (value.value) return value.value
        else return value
      } else {
        return value
      }
    },
    dropdownInput (model, component, value) {
      if (component.source) {
        let option = this.$store.state.generic.options[component.source.model]
        if (option) {
          for (let i = 0; i < option.length; i++) {
            if (option[i].value === value) {
              this.data = option[i]
              break
            }
          }
          if (component.refreshId) {
            this.$store.commit(REFRESH_COMPONENT, {id: component.refreshId})
          }
        }
      } else if (component.data) {
        let option = component.data
        if (option) {
          for (let i = 0; i < option.length; i++) {
            if (option[i].value === value) {
              this.data = option[i]
              break
            }
          }
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

