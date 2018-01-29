<template>
  <span>
    <b-form-input 
      :id="attr.id"
      type="text"
      :name="dataModel"
      v-model="data"
      v-validate="!attr.validation ? '' : attr.validation.join('|')"
      :data-vv-as="attr.label | translate"
      :state="errors.has(dataModel) ? false : null"
      :style="attr.style"
      :placeholder="attr.placeholder"/>
    <b-form-invalid-feedback v-if="attr.validation" tag="span" :force-show="errors.has(dataModel)">
      {{ errors.first(dataModel) }}
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
    // model was put here so that we can send model + index for containerArray from parent, without the component itself need to know
    dataModel: {
      type: String,
      required: true,
      default: () => null
    }
  },
  computed: {
    data: {
      get () {
        return this.$store.state.generic.data[this.dataModel]
      },
      set (value) {
        this.$store.commit(UPDATE_DATA, {key: this.dataModel, value: value})
      }
    }
  },
  methods: {
  }
}
</script>

<style scoped>
</style>

