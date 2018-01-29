<template>
  <component :is="attr.viewAs?attr.viewAs:'div'">
    <grid-layout
      class="grid-layout"
      :layout="componentLayout"
      :col-num="12"
      :row-height="22"
      :is-draggable="editMode"
      :is-resizable="editMode"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[0, 0]"
      :use-css-transforms="true"
      @layout-updated="layoutUpdatedEvent">
        <grid-item v-for="(component, idx) in componentLayout" :key="idx" :style="{'z-index': component.content.zIndex || idx}"
          :class="{'grid-item': editMode}"
          :x="component.x"
          :y="component.y"
          :w="component.w"
          :h="component.h"
          :i="component.i">
          <!-- {{'[' + component.x + ',' + component.y + ']'}} -->
          <!-- <component :is="component.content.type" :attr="component.content"/> -->
          <resizeable>
            <component :is="component.content.type" :attr="component.content" :data-model="component.content.model"/>
          </resizeable>
        </grid-item>
    </grid-layout>
  </component>
</template>

<script>
import VueGridLayout from 'vue-grid-layout'
import { mapState } from 'vuex'
import Resizeable from '../components/Resizeable'

export default {
  name: 'a-container',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    Resizeable
  },
  props: {
    attr: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data () {
    return {
      componentLayout: []
    }
  },
  computed: {
    ...mapState({ editMode: state => state.app.editMode })
  },
  mounted () {
    for (let i = 0; i < this.attr.content.length; i++) {
      let component = this.attr.content[i]
      this.componentLayout.push({x: component.col, y: component.row, w: component.width, h: component.height, i: 'c_' + component.id, content: component})
    }
  },
  methods: {
    layoutUpdatedEvent (layout) {
      // console.log(layout)
    }
  }
}
</script>

<style scoped>
.grid-item {
  border: dashed thin black;
}
</style>
