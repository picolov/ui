<template>
  <b-card :class="[data === attr.value?'card-toggle-selected':'']" @click="data = attr.value" style="text-align: center;">
    <i :class="[attr.icon]" style="font-size: 4vw;"></i><br/><br/>
    <p class="card-text">
      <span style="font-weight: bold;">{{attr.title | translate}}</span><br/>
      {{attr.text | translate}}
    </p>
  </b-card>
</template>

<script>
import { UPDATE_DATA } from '../store/mutation-types'

export default {
  name: 'a-cardToggle',
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

