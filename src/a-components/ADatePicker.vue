<template>
  <date-picker
  class="a-datePicker"
  :id="attr.id"
  format="yyyy-MM-dd"
  :name="attr.model + arraySequence"
  v-model="data"
  v-validate="!attr.validation ? '' : attr.validation.join('|')" :data-vv-as="attr.label | translate"
  :state="errors.has(attr.model + arraySequence) ? false : null"
  lang="en"
  style="width: 100%"
  :style="attr.style"
  :placeholder="attr.placeholder"/>
</template>

<script>
import { UPDATE_DATA } from '../store/mutation-types'
export default {
  name: 'a-datePicker',
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
.a-datePicker {
  .mx-input {
    height: 40px;
  }
  .mx-datepicker-popup {
    left: 0!important;
  }
}
</style>

