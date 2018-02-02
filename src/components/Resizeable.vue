<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
let ResizeSensor = require('css-element-queries/src/ResizeSensor')

export default {
  name: 'resizeable',
  mounted () {
    const vm = this
    this.gridItem = this.$parent
    this.resizeSensor = new ResizeSensor(this.$el, () => {
      const widgetHeight = this.$el.scrollHeight
      if (widgetHeight !== vm.widgetHeight) {
        const h = Math.ceil((widgetHeight + vm.gridItem.margin[1]) / (vm.gridItem.rowHeight + vm.gridItem.margin[1]))
        const newH = h
        vm.widgetHeight = widgetHeight
        vm.gridItem.eventBus.$emit(
          'resizeEvent',
          'resizeend',
          vm.gridItem.i,
          vm.gridItem.x,
          vm.gridItem.y,
          newH,
          vm.gridItem.w
        )
      }
    })
    this.widgetHeight = this.$el.scrollHeight
    // initialize grid height to match content height
    this.$nextTick(() => {
      if (vm._uid === this._uid) {
        let h = Math.ceil((this.widgetHeight + vm.gridItem.margin[1]) / (vm.gridItem.rowHeight + vm.gridItem.margin[1]))
        vm.gridItem.eventBus.$emit(
          'resizeEvent',
          'resizeend',
          vm.gridItem.i,
          vm.gridItem.x,
          vm.gridItem.y,
          h,
          vm.gridItem.w
        )
      }
    })
  },
  data () {
    return {
      resizeSensor: null,
      clientHeight: null,
      text: ''
    }
  }
}
</script>

<style>

</style>
