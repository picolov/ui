<template>
  <b-card style="display: inline-block; margin-right: 1em;" :style="attr.style" align="center">
    <a-image class="d-block mx-auto" :attr="{source: attr.imageSrc==null ? 'http://via.placeholder.com/100x100' : attr.imageSrc, imgWidth: attr.imgWidth | 100, imgHeight: attr.imgHeight | 100, shape: 'circle'}" :data-id="dataId"/>
    <a-label :attr="{text: attr.text}" :data-id="dataId"/>
  </b-card>
</template>

<script>
export default {
  name: 'a-cardAvatarBox',
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

