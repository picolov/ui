<template>
  <span class="fa-stack">
      <i :class="[attr.icon, 'fa-stack-2x']"></i>
      <strong class="fa-stack-1x">
          {{$util.stringInject(attr.text, {data: this.$store.state.generic.data, props: $props}) | translate}}   
      </strong>
  </span>
</template>

<script>
export default {
  name: 'a-iconStack',
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

