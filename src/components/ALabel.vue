<template>
  <label 
    :id="attr.i" 
    :style="[attr.style, {margin: 0, height: '40px'}]">
    <!-- {{stringInjectFunc(attr.text, {data: $data, props: $props}) | translate}} <small v-if="attr.mandatory" class="text-danger">*</small> -->
    {{attr.text | translate}} <small v-if="attr.mandatory" class="text-danger">*</small>
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
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style scoped>
</style>

