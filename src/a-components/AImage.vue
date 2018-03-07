<template>
  <b-img :id="attr.id" :style="attr.style" fluid :src="attr.source" :rounded="attr.shape==='circle'?'circle':'0'" :width="attr.imgWidth" :height="attr.imgHeight" />
</template>

<script>
export default {
  name: 'a-image',
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
  }
}
</script>

<style lang="scss" scoped>

</style>
