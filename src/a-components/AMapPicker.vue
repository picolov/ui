<template>
  <b-input-group>
    <b-form-input 
      :id="attr.id" 
      type="text" 
      readonly 
      @click.native="mapPickerClick(attr.model+arraySequence, attr)" 
      :name="attr.model+arraySequence" 
      :value="arrayToString(data)"
      v-validate="!attr.validation ? '' : attr.validation.join('|')" 
      :data-vv-as="attr.label | translate" 
      :state="errors.has(attr.model+arraySequence) ? false : null" 
      :style="[attr.style, {borderRadius: '5px 0 0 5px', backgroundColor: 'white'}]" 
      :placeholder="'map_selectlocation' | translate"/>
    <b-input-group-addon style="border-radius: 0 5px 5px 0;"><i class="fa fa-globe"></i></b-input-group-addon>
  </b-input-group>
</template>

<script>
import Vue from 'vue'
import { UPDATE_DATA, REFRESH_COMPONENT } from '../store/mutation-types'

export default {
  name: 'a-mapPicker',
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
    arrayToString (arrayObj) {
      let result = ''
      if (arrayObj) {
        for (let i = 0; i < arrayObj.length; i++) {
          result = result + arrayObj[i].lat + '-' + arrayObj[i].lng + ', '
        }
      }
      return result
    },
    mapPickerClick (model, component) {
      let pathModel = this.data[model]
      let instance = this
      this.selectMapLocation({
        path: pathModel,
        selectLocationCallback: (path) => {
          instance.data = path
          if (instance.attr.refreshId) {
            instance.$store.commit(REFRESH_COMPONENT, {id: instance.attr.refreshId})
          }
        }
      })
    },
    refreshMap (mapComp) { // put this on the map component itself, because now we use the event bus using vuex store componentToRefresh
      let refMap = this.shared.refs[mapComp.id]
      if (refMap && refMap[0]) {
        let markerList = []
        if (mapComp.type === 'map') {
          markerList.push(this.stringToLatlng(this.data[mapComp.model]))
        } else if (mapComp.type === 'mapBoundary') {
          if (this.data[mapComp.model]) markerList = this.data[mapComp.model]
        } else if (mapComp.type === 'mapArray') {
          for (let idx = 1; idx <= this.data[mapComp.modelCount]; idx++) {
            if (this.data[mapComp.model + '_' + idx]) {
              markerList.push(this.stringToLatlng(this.data[mapComp.model + '_' + idx]))
            }
          }
        } else if (mapComp.type === 'mapLineArray') {
          for (let idx = 1; idx <= this.data[mapComp.modelCount]; idx++) {
            if (this.data[mapComp.modelFrom + '_' + idx]) {
              let pathList = this.data[mapComp.modelFrom + '_' + idx]
              for (let i = 0; i < pathList.boundary.length; i++) {
                markerList.push(pathList.boundary[i])
              }
            }
            if (this.data[mapComp.modelTo + '_' + idx]) {
              let pathList = this.data[mapComp.modelTo + '_' + idx]
              for (let i = 0; i < pathList.boundary.length; i++) {
                markerList.push(pathList.boundary[i])
              }
            }
          }
        }
        refMap[0].$mapCreated.then(() => {
          let bounds = new window.google.maps.LatLngBounds()
          for (let idx = 0; idx < markerList.length; idx++) {
            if (markerList[idx] == null) continue
            var myLatLng = new window.google.maps.LatLng({ lat: markerList[idx].lat, lng: markerList[idx].lng })
            bounds.extend(myLatLng)
          }
          refMap[0].fitBounds(bounds)
          Vue.$gmapDefaultResizeBus.$emit('resize')
        })
      }
    }
  }
}
</script>

<style lang="scss">
</style>

