<template>
  <i :class="[attr.icon]" :style="attr.style"></i>
</template>

<script>
export default {
  name: 'a-icon',
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
  },
  methods: {
  }
}
</script>

<style lang="scss">
</style>

