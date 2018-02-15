<template>
  <span class="a-inputTextArea">
    <b-form-textarea 
      :id="attr.id"
      :name="attr.model + arraySequence"
      v-model="data"
      v-validate="!attr.validation ? '' : attr.validation.join('|')"
      :data-vv-as="attr.label | translate"
      :state="errors.has(attr.model + arraySequence) ? false : null"
      :style="attr.style"
      :placeholder="attr.placeholder"
      :rows="attr.rows !== undefined ? attr.rows : 3"
      :max-rows="attr.max_rows !== undefined ? attr.max_rows : 6">
      </b-form-textarea>
    <b-form-invalid-feedback v-if="attr.validation" tag="span" :force-show="errors.has(attr.model+arraySequence)">
      {{ errors.first(attr.model + arraySequence) }}
    </b-form-invalid-feedback>
  </span>
</template>

<script>
import { UPDATE_DATA } from '../store/mutation-types'

export default {
  name: 'a-inputTextArea',
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

