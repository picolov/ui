<template>
  <span class="a-inputText">
    <b-form-input 
      :id="attr.id"
      :type="inputType"
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
import { UPDATE_DATA, UPDATE_COMPONENT } from '../store/mutation-types'

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
  data () {
    return {
      filterStr: ''
    }
  },
  computed: {
    data: {
      get () {
        if (this.attr.filterKey && this.attr.filterComponentId) {
          return this.filterStr
        } else {
          return this.$store.state.generic.data[this.attr.model + this.arraySequence]
        }
      },
      set (value) {
        if (this.attr.filterKey && this.attr.filterComponentId) {
          this.$store.commit(UPDATE_COMPONENT, {id: this.attr.filterComponentId, attr: 'filter', key: this.attr.filterKey, value: value})
          this.filterStr = value
        } else {
          this.$store.commit(UPDATE_DATA, {key: this.attr.model + this.arraySequence, value: value})
        }
      }
    },
    inputType () {
      if (this.attr.format && this.attr.format === 'password') {
        return 'password'
      } else if (this.attr.format && this.attr.format === 'number') {
        return 'number'
      } else {
        return 'text'
      }
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="scss">
.a-inputText {
}
</style>

