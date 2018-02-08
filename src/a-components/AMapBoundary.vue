<template>
  <gmap-map
    :ref="attr.id"
    :center="{lat:-6.2152408, lng:106.8301251}"
    :zoom="12"
    map-type-id="hybrid"
    :style="[attr.style, attr.style == null || attr.style.width == null ? {width: '100%'}:null, attr.style == null || attr.style.height == null ? {height: '300px'}:null]"
    :options="{
      fullscreenControl: false,
      mapTypeControl: false,
      zoomControl: true,
      zoomControlOptions: {
        position: 9
      },
      rotateControl: false,
      scaleControl: true,
      scaleControlOptions: {
        position: 12
      },
      streetViewControl: false,
      backgroundColor: 'grey',
      scrollwheel: false
    }">
    <gmap-polygon v-if="data && data.length > 0" :path="data" ref="polygon">
    </gmap-polygon>
  </gmap-map>
</template>

<script>
import { UPDATE_DATA } from '../store/mutation-types'

export default {
  name: 'a-mapBoundary',
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
    data: {
      get () {
        return this.$store.state.generic.data[this.attr.model + this.arraySequence]
      },
      set (value) {
        this.$store.commit(UPDATE_DATA, {key: this.attr.model + this.arraySequence, value: value})
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
</style>

