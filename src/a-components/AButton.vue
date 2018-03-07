<template>
  <b-button 
    :id="attr.i"
    @click="btnClick.bind(this, attr.action, attr)()"
    :style="[attr.style, attr.style == null || attr.style.width == null ? {minWidth: '120px'}:null]">
    <i v-if="attr.icon" :class="[attr.icon]"/> {{attr.text | translate}}
  </b-button>
</template>

<script>

export default {
  name: 'a-button',
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
    btnClick (action, component) {
      if (action === undefined) return
      this.$util.processAction(this, action, component, null, null, this.$route.query, this.dataId)
    }
  }
}
</script>

<style lang="scss">
</style>

