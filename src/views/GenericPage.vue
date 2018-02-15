<template>
  <div class="animated fadeIn">
    <component v-if="attr !== null" :is="attr.type" :attr="attr"/>
    <!-- Modal Component -->
    <b-modal id="info-alert" v-model="infoAlertShow" @ok="okAlertClick" centered :title="alertTitle" :hide-header-close="true" :ok-only="true" :no-close-on-backdrop="true">
      <h3>{{alertMessage}}</h3>
    </b-modal>
    <b-modal id="yesNo-alert" v-model="yesNoAlertShow" @ok="okAlertClick" centered :title="alertTitle" :hide-header-close="true" :no-close-on-backdrop="true">
      <h3>{{alertMessage}}</h3>
    </b-modal>
    <b-modal id="mapPicker-alert" ref="mapPickerModal" v-model="mapPickerAlertShow" @show="mapPickerShow" @shown="mapPickerShown" centered :hide-header="true" :hide-footer="true">
      <div style="padding-bottom: 1em">
        <label style="float:left; width:8em;;">Search Location :</label>
        <div style="margin-left: 8em;"><gmap-autocomplete :value="locationSearch" @place_changed="searchLocation" style="width: 100%"></gmap-autocomplete></div>
      </div>
      <gmap-map
        ref="mapPickerMap"
        :center="locationPicked"
        :zoom="12"
        map-type-id="hybrid"
        style="width: 100%; height: 20em"
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
        <gmap-polygon v-if="path.length > 0" :path="path" :editable="true" @path_changed="updateEdited($event)"
          @rightclick="handleClickForDelete"
          ref="polygon">
        </gmap-polygon>
      </gmap-map>
      <b-button @click="setPath" style="width: 100%; margin-top: 1em;">Set Boundary Path</b-button>
      <b-button @click="selectLocationClick" style="width: 100%; margin-top: 1em;">Pick This Location</b-button>
    </b-modal>
  </div>
</template>

<script>
import {_} from 'vue-underscore'
import { mapState, mapMutations } from 'vuex'
import { SET_ALERT_SHOW, SET_MAPPICKER_SHOW, SET_PAGE, UPDATE_DATA_COLLECTION, CLEAR_DATA } from '../store/mutation-types'
import api from '../api/common'

export default {
  name: 'genericPage',
  components: {
  },
  data () {
    return {
      attr: null,
      locationSearch: '',
      locationPicked: {lat: 0, lng: 0},
      path: [],
      mvcPath: null
    }
  },
  watch: {
    '$route': 'fetchData',
    polygonPath: _.throttle(function (path) {
      if (path) {
        this.path = path
      }
    }, 1000)
  },
  computed: {
    polygonPath: function () {
      if (!this.mvcPath) return null
      let path = []
      for (let j = 0; j < this.mvcPath.getLength(); j++) {
        let point = this.mvcPath.getAt(j)
        path.push({lat: point.lat(), lng: point.lng()})
      }
      return path
    },
    infoAlertShow: {
      get: function () {
        return this.$store.state.app.infoAlertShow
      },
      set: function (newValue) {
        this.setAlertShow({alertType: 'info', alertIsShow: newValue})
      }
    },
    yesNoAlertShow: {
      get: function () {
        return this.$store.state.app.yesNoAlertShow
      },
      set: function (newValue) {
        this.setAlertShow({alertType: 'yesNo', alertIsShow: newValue})
      }
    },
    mapPickerAlertShow: {
      get: function () {
        return this.$store.state.app.mapPickerAlertShow
      },
      set: function (newValue) {
        this.setMapPickerShow({alertIsShow: newValue})
      }
    },
    ...mapState({ alertTitle: state => state.app.alertTitle }),
    ...mapState({ alertMessage: state => state.app.alertMessage }),
    ...mapState({ okCallback: state => state.app.okCallback }),
    ...mapState({ selectLocationCallback: state => state.app.selectLocationCallback })
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      // this is set to be null so that the generic-container will got re-mounted, if not then if will not see that it need to be re-mounted, because changing props doesn't count
      this.attr = null
      this.$store.commit(CLEAR_DATA)
      this.$bus.$emit('show-full-loading', { key: 'fetchLayout' })
      // load layout
      api.get(
        'generic/flow/layout/' + this.$route.params.page,
        (response) => {
          this.$bus.$emit('hide-full-loading', { key: 'fetchLayout' })
          let page = response.data
          if (page.lang) {
            this.$store.dispatch('loadLang', {page: page.lang, instance: this})
          }
          this.id = page.id
          if (page.title && page.lang) this.$store.commit(SET_PAGE, {title: page.title, lang: page.lang})
          // get init action
          if (page.init && page.init.length > 0) {
            for (let i = 0; i < page.init.length; i++) {
              let action = page.init[i]
              let mapInject = {item: null, urlParam: this.$route.query, index: null, component: null, action: action}
              switch (action.type) {
                case 'getData':
                  let url = this.$util.stringInject(action.url, mapInject)
                  if (action.method && action.method === 'post') {
                    api.post(url, {},
                      (response) => {
                        this.$store.commit(UPDATE_DATA_COLLECTION, {collection: response.data, prefix: action.prefix})
                        this.attr = page.container
                      },
                      () => {
                        this.attr = page.container
                      }
                    )
                  } else {
                    api.get(url,
                      (response) => {
                        this.$store.commit(UPDATE_DATA_COLLECTION, {collection: response.data, prefix: action.prefix})
                        this.attr = page.container
                      },
                      () => {
                        this.attr = page.container
                      }
                    )
                  }
                  break
                case 'initData':
                  this.$store.commit(UPDATE_DATA_COLLECTION, {collection: action.keyVal})
                  this.attr = page.container
                  break
              }
            }
          } else {
            this.attr = page.container
          }
        }, () => {
          console.log('ERROR when loading page ' + this.$route.params.page)
          this.$bus.$emit('hide-full-loading', { key: 'fetchLayout' })
        }
      )
    },
    okAlertClick () {
      this.okCallback()
    },
    selectLocationClick () {
      this.selectLocationCallback(this.path)
      this.$refs.mapPickerModal.hide()
    },
    mapPickerShow () {
      this.path = this.$store.state.app.path
      if (this.path.length > 0) this.locationPicked = {lat: this.path[0].lat, lng: this.path[0].lng}
      else this.locationPicked = {lat: -6.2152408, lng: 106.8301251}
    },
    mapPickerShown () {
      this.$refs.mapPickerMap.resizePreserveCenter()
    },
    updateLocation (obj) {
      this.locationPicked.lat = obj.latLng.lat()
      this.locationPicked.lng = obj.latLng.lng()
    },
    searchLocation (place) {
      this.locationPicked.lat = place.geometry.location.lat()
      this.locationPicked.lng = place.geometry.location.lng()
    },
    setPath: function () {
      // obtain the bounds, so we can guess how big the polygon should be
      var bounds = this.$refs.mapPickerMap.$mapObject.getBounds()
      var northEast = bounds.getNorthEast()
      var southWest = bounds.getSouthWest()
      var center = bounds.getCenter()
      var degree = 1
      var f = Math.pow(0.66, degree)

      // Draw a triangle. Use f to control the size of the triangle.
      // i.e., every time we add a path, we reduce the size of the triangle
      var path = [
        { lng: center.lng(), lat: (1 - f) * center.lat() + (f) * northEast.lat() },
        { lng: (1 - f) * center.lng() + (f) * southWest.lng(), lat: (1 - f) * center.lat() + (f) * southWest.lat() },
        { lng: (1 - f) * center.lng() + (f) * northEast.lng(), lat: (1 - f) * center.lat() + (f) * southWest.lat() }
      ]
      this.path = path
    },
    handleClickForDelete ($event) {
      if ($event.vertex) {
        this.$refs.polygon.$polygonObject.getPaths()
          .getAt($event.path)
          .removeAt($event.vertex)
      }
    },
    updateEdited: function (mvcPath) {
      this.mvcPath = mvcPath
    },
    ...mapMutations({
      setAlertShow: SET_ALERT_SHOW
    }),
    ...mapMutations({
      setMapPickerShow: SET_MAPPICKER_SHOW
    })
  }
}
</script>

<style scoped>
</style>