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
      const widgetHeight = this.$el.clientHeight
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
    this.widgetHeight = this.$el.clientHeight
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
