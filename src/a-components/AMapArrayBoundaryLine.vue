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
      v-if="getPolygonFrom(index) && getPolygonFrom(index).length > 0" 
      :path="getPolygonFrom(index)" 
      ref="polygonFrom" 
      :key="index">
    </gmap-polygon>
    <gmap-polygon  
      v-for="index in count" 
      v-if="getPolygonTo(index) && getPolygonTo(index).length > 0" 
      :path="getPolygonTo(index)" 
      ref="polygonTo" 
      :key="index">
    </gmap-polygon>
    <gmap-polyline v-for="index in count" 
      v-if="getPolygonFrom(index) && getPolygonFrom(index).length > 0 && getPolygonTo(index) && getPolygonTo(index).length > 0"
      :path="[getMiddlePoint(getPolygonFrom(index)), getMiddlePoint(getPolygonTo(index))]" :key="index">
    </gmap-polyline>
  </gmap-map>
</template>

<script>
import Vue from 'vue'
import { FINISH_REFRESH_COMPONENT } from '../store/mutation-types'

export default {
  name: 'a-mapArrayBoundaryLine',
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
  mounted () {
    this.$refs[this.attr.id].$mapCreated.then(() => {
      this.refreshMap()
    })
  },
  watch: {
    refreshComponentList (newList, oldList) {
      if (newList.length > 0 && newList.indexOf(this.attr.id) > -1) {
        let bounds = new window.google.maps.LatLngBounds()
        for (let num = 1; num <= this.count; num++) {
          let polygonArray = this.getPolygonFrom(num)
          if (polygonArray != null) {
            for (let idx = 0; idx < polygonArray.length; idx++) {
              if (polygonArray[idx] == null) continue
              let myLatLng = new window.google.maps.LatLng({ lat: polygonArray[idx].lat, lng: polygonArray[idx].lng })
              bounds.extend(myLatLng)
            }
          }
          polygonArray = this.getPolygonTo(num)
          if (polygonArray != null) {
            for (let idx = 0; idx < polygonArray.length; idx++) {
              if (polygonArray[idx] == null) continue
              let myLatLng = new window.google.maps.LatLng({ lat: polygonArray[idx].lat, lng: polygonArray[idx].lng })
              bounds.extend(myLatLng)
            }
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
      let result = this.$util.getObjectOrDefault(this.$store.state.generic.data[this.dataId], this.attr.modelCount + this.arraySequence, 0)
      return result
    },
    refreshComponentList () {
      return this.$store.state.generic.componentToRefresh
    }
  },
  methods: {
    refreshMap () {
      if (this.count > 0 && this.getPolygonFrom(1) && this.getPolygonFrom(1).length > 0) {
        let bounds = new window.google.maps.LatLngBounds()
        for (let num = 1; num <= this.count; num++) {
          let polygonArray = this.getPolygonFrom(num)
          if (polygonArray != null) {
            for (let idx = 0; idx < polygonArray.length; idx++) {
              if (polygonArray[idx] == null) continue
              let myLatLng = new window.google.maps.LatLng({ lat: polygonArray[idx].lat, lng: polygonArray[idx].lng })
              bounds.extend(myLatLng)
            }
          }
          polygonArray = this.getPolygonTo(num)
          if (polygonArray != null) {
            for (let idx = 0; idx < polygonArray.length; idx++) {
              if (polygonArray[idx] == null) continue
              let myLatLng = new window.google.maps.LatLng({ lat: polygonArray[idx].lat, lng: polygonArray[idx].lng })
              bounds.extend(myLatLng)
            }
          }
        }
        this.$refs[this.attr.id].fitBounds(bounds)
        Vue.$gmapDefaultResizeBus.$emit('resize')
      }
    },
    getPolygonFrom (index) {
      if (this.attr.keyFrom) {
        let result = this.$util.getObjectOrDefault(this.$store.state.generic.data[this.dataId], this.attr.modelFrom + this.arraySequence + '_' + index + (this.attr.keyFrom ? '.' + this.attr.keyFrom : ''), [])
        return result
      } else {
        return this.$util.getObjectOrDefault(this.$store.state.generic.data[this.dataId], this.attr.modelFrom + this.arraySequence + '_' + index, [])
      }
    },
    getPolygonTo (index) {
      if (this.attr.keyTo) {
        let result = this.$util.getObjectOrDefault(this.$store.state.generic.data[this.dataId], this.attr.modelTo + this.arraySequence + '_' + index + (this.attr.keyTo ? '.' + this.attr.keyTo : ''), [])
        return result
      } else {
        return this.$util.getObjectOrDefault(this.$store.state.generic.data[this.dataId], this.attr.modelTo + this.arraySequence + '_' + index, [])
      }
    },
    getMiddlePoint (pathList) {
      let bounds = new window.google.maps.LatLngBounds()
      for (let i = 0; i < pathList.length; i++) {
        bounds.extend(new window.google.maps.LatLng(pathList[i].lat, pathList[i].lng))
      }
      return bounds.getCenter()
    }
  }
}
</script>

<style lang="scss">
</style>

