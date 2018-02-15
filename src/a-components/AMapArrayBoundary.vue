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
    <gmap-polygon  
      v-for="index in count" 
      v-if="getPolygon(index) && getPolygon(index).length > 0" 
      :path="getPolygon(index)" 
      ref="polygon" 
      :key="index">
    </gmap-polygon>
  </gmap-map>
</template>

<script>
import Vue from 'vue'
import { FINISH_REFRESH_COMPONENT } from '../store/mutation-types'

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
  mounted () {
    this.$refs[this.attr.id].$mapCreated.then(() => {
      if (this.count > 0 && this.getPolygon(1) && this.getPolygon(1).length > 0) {
        let bounds = new window.google.maps.LatLngBounds()
        for (let num = 1; num <= this.count; num++) {
          let polygonArray = this.getPolygon(num)
          for (let idx = 0; idx < polygonArray.length; idx++) {
            if (polygonArray[idx] == null) continue
            var myLatLng = new window.google.maps.LatLng({ lat: polygonArray[idx].lat, lng: polygonArray[idx].lng })
            bounds.extend(myLatLng)
          }
        }
        this.$refs[this.attr.id].fitBounds(bounds)
        Vue.$gmapDefaultResizeBus.$emit('resize')
      }
    })
  },
  watch: {
    refreshComponentList (newList, oldList) {
      if (newList.length > 0 && newList.indexOf(this.attr.id) > -1) {
        let bounds = new window.google.maps.LatLngBounds()
        for (let num = 1; num <= this.count; num++) {
          let polygonArray = this.getPolygon(num)
          for (let idx = 0; idx < polygonArray.length; idx++) {
            if (polygonArray[idx] == null) continue
            var myLatLng = new window.google.maps.LatLng({ lat: polygonArray[idx].lat, lng: polygonArray[idx].lng })
            bounds.extend(myLatLng)
          }
        }
        this.$refs[this.attr.id].fitBounds(bounds)
        Vue.$gmapDefaultResizeBus.$emit('resize')
        this.$store.commit(FINISH_REFRESH_COMPONENT, {id: this.attr.id})
      }
    }
  },
  computed: {
    count () {
      return this.$store.state.generic.data[this.attr.modelCount + this.arraySequence]
    },
    refreshComponentList () {
      return this.$store.state.generic.componentToRefresh
    }
  },
  methods: {
    getPolygon (index) {
      if (this.attr.key) {
        if (this.$store.state.generic.data[this.attr.model + this.arraySequence + '_' + index] != null) {
          return this.$store.state.generic.data[this.attr.model + this.arraySequence + '_' + index][this.attr.key]
        } else {
          return []
        }
      } else {
        return this.$store.state.generic.data[this.attr.model + this.arraySequence + '_' + index]
      }
    }
  }
}
</script>

<style lang="scss">
</style>

