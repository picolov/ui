<template>
  <toggle-button 
    :id="attr.id" 
    v-model="data" 
    :height="30" 
    :color="{checked: '#ffc928', unchecked: '#ffffff'}" 
    :style="attr.style"/>
</template>

<script>
import { UPDATE_DATA } from '../store/mutation-types'
export default {
  name: 'a-switch',
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
  methods: {
  }
}
</script>

<style lang="scss">
</style>

