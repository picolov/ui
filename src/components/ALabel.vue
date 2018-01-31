<template>
  <label 
    :id="attr.i" 
    :style="[attr.style, {margin: 0, height: '40px', paddingTop: '0.5em'}]">
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
        value = this.$t(this.$util.stringInject(this.attr.text, {data: this.$store.state.generic.data}))
      } else if (!this.attr.text && this.attr.model) {
        value = this.getObjectFromString(this.attr.model + this.arraySequence + (this.attr.key ? '.' + this.attr.key : ''), '')
        if (this.attr.format === 'date') {
          value = this.$util.datetimeToString(value)
        }
      }
      return value
    }
  },
  methods: {
    getObjectFromString (key, defaultValue) {
      let result = this.$util.getObjectFromString(this.$store.state.generic.data, key)
      if (result === null) {
        return defaultValue
      } else if (result instanceof Array) {
        return result.join(', ')
      } else {
        return result
      }
    }
  }
}
</script>

<style lang="scss">
</style>

