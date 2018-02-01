<template>
  <b-img-lazy :id="attr.id" :style="attr.style" :src="attr.source" :rounded="attr.shape==='circle'?'circle':'0'" :width="attr.imgWidth" :height="attr.imgHeight" />
</template>

<script>
export default {
  name: 'a-imageLazy',
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
  }
}
</script>

<style lang="scss" scoped>

</style>
