<template>
  <date-picker
  :id="attr.id"
  format="yyyy-MM-dd"
  :name="dataModel"
  v-model="data"
  v-validate="!attr.validation ? '' : attr.validation.join('|')" :data-vv-as="attr.label | translate"
  :state="errors.has(dataModel) ? false : null"
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

