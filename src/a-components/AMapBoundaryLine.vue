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
      v-if="getPolygonFrom() && getPolygonFrom().length > 0" 
      :path="getPolygonFrom()" 
      ref="polygonFrom" >
    </gmap-polygon>
    <gmap-polygon  
      v-if="getPolygonTo() && getPolygonTo().length > 0" 
      :path="getPolygonTo()" 
      ref="polygonTo" >
    </gmap-polygon>
    <gmap-polyline
      v-if="getPolygonFrom() && getPolygonFrom().length > 0 && getPolygonTo() && getPolygonTo().length > 0"
      :path="[getMiddlePoint(getPolygonFrom()), getMiddlePoint(getPolygonTo())]">
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
      if (this.getPolygonFrom() && this.getPolygonFrom().length > 0) {
        let bounds = new window.google.maps.LatLngBounds()
        let polygonArray = this.getPolygonFrom()
        if (polygonArray != null) {
          for (let idx = 0; idx < polygonArray.length; idx++) {
            if (polygonArray[idx] == null) continue
            let myLatLng = new window.google.maps.LatLng({ lat: polygonArray[idx].lat, lng: polygonArray[idx].lng })
            bounds.extend(myLatLng)
          }
        }
        polygonArray = this.getPolygonTo()
        if (polygonArray != null) {
          for (let idx = 0; idx < polygonArray.length; idx++) {
            if (polygonArray[idx] == null) continue
            let myLatLng = new window.google.maps.LatLng({ lat: polygonArray[idx].lat, lng: polygonArray[idx].lng })
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
        let polygonArray = this.getPolygonFrom()
        if (polygonArray != null) {
          for (let idx = 0; idx < polygonArray.length; idx++) {
            if (polygonArray[idx] == null) continue
            let myLatLng = new window.google.maps.LatLng({ lat: polygonArray[idx].lat, lng: polygonArray[idx].lng })
            bounds.extend(myLatLng)
          }
        }
        polygonArray = this.getPolygonTo()
        if (polygonArray != null) {
          for (let idx = 0; idx < polygonArray.length; idx++) {
            if (polygonArray[idx] == null) continue
            let myLatLng = new window.google.maps.LatLng({ lat: polygonArray[idx].lat, lng: polygonArray[idx].lng })
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
      let result = this.$util.getObjectOrDefault(this.$store.state.generic.data[this.dataId], this.attr.modelCount + this.arraySequence, 0)
      return result
    },
    refreshComponentList () {
      return this.$store.state.generic.componentToRefresh
    }
  },
  methods: {
    getPolygonFrom () {
      if (this.attr.keyFrom) {
        let result = this.$util.getObjectOrDefault(this.$store.state.generic.data[this.dataId], this.attr.modelFrom + this.arraySequence + (this.attr.keyFrom ? '.' + this.attr.keyFrom : ''), [])
        return result
      } else {
        return this.$util.getObjectOrDefault(this.$store.state.generic.data[this.dataId], this.attr.modelFrom + this.arraySequence, [])
      }
    },
    getPolygonTo () {
      if (this.attr.keyTo) {
        let result = this.$util.getObjectOrDefault(this.$store.state.generic.data[this.dataId], this.attr.modelTo + this.arraySequence + (this.attr.keyTo ? '.' + this.attr.keyTo : ''), [])
        return result
      } else {
        return this.$util.getObjectOrDefault(this.$store.state.generic.data[this.dataId], this.attr.modelTo + this.arraySequence, [])
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

