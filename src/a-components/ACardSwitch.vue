<template>
  <b-card style="text-align: center;">
    <i :class="[attr.icon]" style="font-size: 4vw;;"></i><br/><br/>
    <p class="card-text">
      <span style="font-weight: bold;">{{attr.title | translate}}</span><br/><br/>
      <toggle-button v-model="data" :height="30" :color="{checked: '#ffc928', unchecked: '#ffffff'}"/>
    </p>
  </b-card>
</template>

<script>
import { UPDATE_DATA } from '../store/mutation-types'

export default {
  name: 'a-cardSwitch',
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
  computed: {
    data: {
      get () {
        return this.$store.state.generic.data[this.dataId][this.attr.model + this.arraySequence]
      },
      set (value) {
        this.$store.commit(UPDATE_DATA, {id: this.dataId, key: this.attr.model + this.arraySequence, value: value})
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
</style>

