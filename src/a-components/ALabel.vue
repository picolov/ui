<template>
  <label 
    :id="attr.i" 
    class="a-label"
    :style="[attr.style, {margin: 0, minHeight: '40px', paddingTop: '0.5em'}]">
    {{labelText}} <small v-if="attr.mandatory" class="text-danger">*</small>
  </label>
</template>

<script>
export default {
  name: 'a-label',
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
    labelText () {
      let value = ''
      if (this.attr.text && !this.attr.model) {
        let result = this.$util.stringInject(this.attr.text, {data: this.$store.state.generic.data, props: this.$props})
        value = this.$t(result)
      } else if (!this.attr.text && this.attr.model) {
        value = this.$util.getObjectOrDefault(this.$store.state.generic.data, this.attr.model + this.arraySequence + (this.attr.key ? '.' + this.attr.key : ''), '')
        if (this.attr.format === 'date') {
          value = this.$util.datetimeToString(value, this.attr.dateFormat)
        } else if (this.attr.format === 'currency') {
          value = this.$util.moneyFormat(value, 'Rp', 0, '.', ',')
        }
      }
      return value
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
.a-label {
  width: 100%;
}
</style>

