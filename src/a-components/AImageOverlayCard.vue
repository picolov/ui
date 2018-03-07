<template>
  <div class="card bg-dark text-white" :style="attr.style">
    <img class="card-img" :src="attr.imageSrc" :alt="attr.imageAlt">
    <div class="card-img-overlay">
      <h4 class="card-title">{{ attr.title | translate }}</h4>
      <p class="card-text">{{ attr.subtitle | translate }}</p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'a-imageOverlayCard',
  components: {
  },
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
  data () {
    return {
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="scss">
</style>
