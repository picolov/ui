<template>
  <div class="animated fadeIn">
    <generic-container v-if="componentList !== null" :name="id" :components="componentList" :attr="attr" :data="data" :shared="shared"/>
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
import Vue from 'vue'
import {_} from 'vue-underscore'
import { mapState, mapMutations } from 'vuex'
import { SET_PAGE, SET_ALERT_SHOW, SET_MAPPICKER_SHOW } from '../store/mutation-types'
import api from '../api/common'

export default {
  name: 'genericPage',
  data () {
    return {
      id: '',
      componentList: null,
      attr: {
        viewAs: 'div'
      },
      data: {},
      shared: {
        refs: {},
        components: [],
        refreshArray: [],
        filter: {}
      },
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
      this.componentList = null
      // reset data
      this.data = {}
      this.shared = {
        refs: {},
        components: [],
        refreshArray: [],
        filter: {}
      }
      // load language
      this.$store.dispatch('loadLang', {page: this.$route.params.page, instance: this})
      // load layout
      api.get(
        'generic/flow/layout/' + this.$route.params.page,
        (response) => {
          let page = response.data
          if (page.lang) {
            // if from server return map containing lang key, it means that we need to load ekstra language, as the layout is custom
            this.$store.dispatch('loadLang', {page: page.lang, instance: this})
            page = page.content
          }
          this.id = page.id
          if (page.title) this.$store.commit(SET_PAGE, page.title)
          // get init action
          if (page.init && page.init.length > 0) {
            for (let i = 0; i < page.init.length; i++) {
              let action = page.init[i]
              let mapInject = {item: null, urlParam: this.$route.query, index: null, component: null, action: action}
              switch (action.type) {
                case 'getData':
                  let url = stringInject(action.url, mapInject)
                  if (action.method && action.method === 'post') {
                    api.post(url, {},
                      (response) => {
                        for (let key in response.data) {
                          Vue.set(this.data, action.prefix ? action.prefix + '_' + key : key, response.data[key])
                        }
                        this.componentList = page.content
                        this.attr = page
                      },
                      () => {
                        this.componentList = page.content
                        this.attr = page
                      }
                    )
                  } else {
                    api.get(url,
                      (response) => {
                        for (let key in response.data) {
                          Vue.set(this.data, action.prefix ? action.prefix + '_' + key : key, response.data[key])
                        }
                        this.componentList = page.content
                        this.attr = page
                      },
                      () => {
                        this.componentList = page.content
                        this.attr = page
                      }
                    )
                  }
                  break
                case 'initData':
                  for (let key in action.keyVal) {
                    Vue.set(this.data, key, action.keyVal[key])
                  }
                  this.componentList = page.content
                  this.attr = page
                  break
              }
            }
          } else {
            this.componentList = page.content
            this.attr = page
          }
        }, () => {
          console.log('ERROR when loading page ' + this.$route.params.page)
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
      if (this.path.length > 0) this.locationPicked = this.path[0]
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

function stringInject (str, data) {
  if (typeof str === 'string' && (data instanceof Array)) {
    return str.replace(/({\d})/g, function (i) {
      return data[i.replace(/{/, '').replace(/}/, '')]
    })
  } else if (typeof str === 'string' && (data instanceof Object)) {
    for (let key in data) {
      return str.replace(/({([^}]+)})/g, function (i) {
        let key = i.replace(/{/, '').replace(/}/, '')
        let result = getObjectFromString(data, key)
        if (result === null) {
          return i
        }
        return result
      })
    }
  } else {
    return false
  }
}

function getObjectFromString (data, key) {
  let tokenArr = key.split('.')
  let result = null
  for (let i = 0; i < tokenArr.length; i++) {
    let token = tokenArr[i]
    if (result === null) {
      if (data.hasOwnProperty(token)) {
        result = data[token]
      } else {
        break
      }
    } else if (result.hasOwnProperty(token)) {
      result = result[token]
    } else {
      break
    }
  }
  return result
}
</script>

<style lang="css">
</style>