<template>
  <b-img-lazy 
    :id="attr.id" 
    :style="attr.style" 
    :src="imgSrc" 
    :rounded="attr.shape==='circle'?'circle':'0'" 
    :width="attr.imgWidth" 
    :height="attr.imgHeight" />
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
  },
  computed: {
    imgSrc () {
      if (this.attr.source) {
        return this.attr.source
      } else {
        let imgSrc = this.$store.state.generic.data[this.attr.model + this.arraySequence]
        if (imgSrc == null) {
          imgSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8Vw8AAmEBb87E6jIAAAAASUVORK5CYII='
        }
        return imgSrc
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
