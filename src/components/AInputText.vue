<template>
  <span class="a-inputText">
    <b-form-input 
      :id="attr.id"
      type="text"
      :name="attr.model + arraySequence"
      v-model="data"
      v-validate="!attr.validation ? '' : attr.validation.join('|')"
      :data-vv-as="attr.label | translate"
      :state="errors.has(attr.model + arraySequence) ? false : null"
      :style="attr.style"
      :placeholder="attr.placeholder"/>
    <b-form-invalid-feedback v-if="attr.validation" tag="span" :force-show="errors.has(attr.model+arraySequence)">
      {{ errors.first(attr.model + arraySequence) }}
    </b-form-invalid-feedback>
  </span>
</template>

<script>
import { UPDATE_DATA } from '../store/mutation-types'

export default {
  name: 'a-inputText',
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
.a-inputText {
}
</style>

