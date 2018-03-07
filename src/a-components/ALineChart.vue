<template>
  <chartjs-line></chartjs-line>
</template>

<script>
export default {
  name: 'a-lineChart',
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
    },
    dataId: {
      type: String,
      required: true
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

