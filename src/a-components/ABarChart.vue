<template>
  <chartjs-bar></chartjs-bar>
</template>

<script>
export default {
  name: 'a-barChart',
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

