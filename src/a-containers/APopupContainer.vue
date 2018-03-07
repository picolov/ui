<template>
  <div :style="attr.style">
    <b-btn v-if="this.attr.hidePopUpButton" @click="showPopUp()" variant="primary">Show Modal</b-btn>
    <b-modal :ref="popUpRef" lazy
      :id="attr.id + arraySequence"
      :style="attr.style"
      :title="attr.title"
      :header-bg-variant="attr.headerBgVariant"
      :header-text-variant="attr.headerTextVariant"
      :body-bg-variant="attr.bodyBgVariant"
      :body-text-variant="attr.bodyTextVariant"
      :footer-bg-variant="attr.footerBgVariant"
      :footer-text-variant="attr.footerTextVariant"
      :centered="attr.centered == undefined ? true : attr.centered" 
      :size="attr.size == undefined ? 'md' : attr.size"
      :no-close-on-backdrop="attr.closeOnBackdrop == undefined ? false : attr.closeOnBackdrop"
      :no-close-on-esc="attr.closeOnEsc == undefined ? false : attr.closeOnEsc"
      :hide-footer="attr.hideFooter == undefined ? false : attr.hideFooter"
      :ok-disabled="attr.okDisabled == undefined ? false : attr.okDisabled"
      :ok-title="attr.closeOnEsc == undefined ? $t('Ok') : attr.closeOnEsc"
      :cancel-disabled="attr.cancelDisabled == undefined ? false : attr.cancelDisabled"
      :cancel-title="attr.closeOnEsc == undefined ? $t('Cancel') : attr.closeOnEsc"
      @ok="handleOk"
      @cancel="handleCancel"
      @show="onShow"
      @shown="onShown">

      <div v-if="!layoutLoaded">
        // Todo Loader
      </div>
      <a-container v-if="!isExternalLayout" :attr="attr" :array-sequence="arraySequence" :data-id="dataId"/>
      <a-container v-if="isExternalLayout && layoutLoaded && popUpLayoutAttr != null" :attr="popUpLayoutAttr" :array-sequence="arraySequence" :data-id="dataId"/>
      <template slot="modal-footer" v-if="attr.footerButtons != undefined && Array.isArray(attr.footerButtons)">
        <template v-for="(button, index) in attr.footerButtons">
          <b-button 
            :key="index"
            :id="button.id"
            @click="btnClick.bind(this, button.action, button)()"
            :style="[button.style, button.style == null || button.style.width == null ? {minWidth: '120px'}:null]">
            <i v-if="button.icon" :class="[button.icon]"/> {{button.text | translate}}
          </b-button>
        </template>
      </template>
    </b-modal>
  </div>
</template>

<script>
import { UPDATE_DATA, UPDATE_COMPONENT, UPDATE_DATA_COLLECTION, REFRESH_COMPONENT } from '../store/mutation-types'
import api from '../api/common'

export default {
  name: 'a-popupContainer',
  components: {
  },
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
  data () {
    return {
      popUpLayoutAttr: null,
      modalToggle: false,
      isExternalLayout: false,
      layoutLoaded: false,
      loadLayout: true,
      popUpRef: 'popUp' + this.attr.id + this.arraySequence,
      urlParam: null
    }
  },
  mounted () {
    if (this.attr.url) {
      this.urlParam = this.$util.getQueryStringObject(this.attr.url)
      this.isExternalLayout = true
    } else {
      this.layoutLoaded = true
    }
  },
  methods: {
    fetchData () {
      // return setTimeout((resolve) => { this.layoutLoaded = true }, 3000)
      // this is set to be null so that the generic-container will got re-mounted, if not then if will not see that it need to be re-mounted, because changing props doesn't count
      this.popUpLayoutAttr = null // this.attr = null
      this.$store.commit(UPDATE_DATA, {id: this.dataId, key: this.attr.model + this.arraySequence, value: {}}) // this.$store.commit(CLEAR_DATA)
      this.$bus.$emit('show-full-loading', { key: 'fetchPopUpLayout' })
      // load layout
      new Promise((resolve, reject) => {
        return api.get(
          'generic/flow/layout/' + this.attr.url,
          (response) => {
            this.$bus.$emit('hide-full-loading', { key: 'fetchPopUpLayout' })
            let page = response.data
            if (page.lang) {
              this.$store.dispatch('loadLang', {page: page.lang, instance: this})
            }
            this.id = page.id
            // if (page.title && page.lang) this.$store.commit(SET_PAGE, {title: page.title, lang: page.lang})
            // get init action
            let promises = []
            if (page.init && page.init.length > 0) {
              for (let i = 0; i < page.init.length; i++) {
                let action = page.init[i]
                let mapInject = {item: null, urlParam: this.urlParam, index: null, component: null, action: action}
                switch (action.type) {
                  case 'getData':
                    let url = this.$util.stringInject(action.url, mapInject)
                    if (action.method && action.method === 'post') {
                      let getDataPromise = new Promise((resolve, reject) => {
                        api.post(url, {},
                          (response) => {
                            this.$store.commit(UPDATE_DATA_COLLECTION, {id: this.dataId, collection: response.data, prefix: action.prefix})
                            if (action.refreshId) {
                              this.$store.commit(REFRESH_COMPONENT, {id: action.refreshId})
                            }
                            resolve()
                          },
                          (error) => {
                            reject(new Error('ERROR when loading popup page data:' + error.message))
                          }
                        )
                      })
                      promises.push(getDataPromise)
                    } else {
                      let getDataPromise = new Promise((resolve, reject) => {
                        api.get(url,
                          (response) => {
                            this.$store.commit(UPDATE_DATA_COLLECTION, {id: this.dataId, collection: response.data, prefix: action.prefix})
                            if (action.refreshId) {
                              this.$store.commit(REFRESH_COMPONENT, {id: action.refreshId})
                            }
                            resolve()
                          },
                          (error) => {
                            reject(new Error('ERROR when loading popup page data:' + error.message))
                          }
                        )
                      })
                      promises.push(getDataPromise)
                    }
                    break
                  case 'initData':
                    this.$store.commit(UPDATE_DATA_COLLECTION, {id: this.dataId, collection: action.keyVal})
                    break
                }
              }
            }
            if (this.attr.hideComponent && this.attr.hideComponent.length > 0) {
              this.$util.getComponents(
                page.container,
                (matchComponent) => {
                  if (this.attr.hideComponent.indexOf(matchComponent.id) >= 0) {
                    matchComponent.style = { display: 'none', ...matchComponent.style }
                  }
                }
              )
            }
            Promise.all(promises).then(() => {
              resolve(page.container)
            })
          }, (error) => {
            console.log(error)
            reject(new Error('ERROR when loading popup page: ' + this.attr.url))
          })
      }).then((container) => {
        this.popUpLayoutAttr = container
        this.layoutLoaded = true
      }).catch((error) => {
        console.log(error)
        this.$bus.$emit('hide-full-loading', { key: 'fetchPopUpLayout' })
        this.layoutLoaded = true
      })
    },
    // used for
    data: {
      get () {
        if (this.attr.filterKey && this.attr.filterComponentId) {
          return this.filterStr
        } else {
          return this.$store.state.generic.data[this.dataId][this.attr.model + this.arraySequence]
        }
      },
      set (value) {
        if (this.attr.filterKey && this.attr.filterComponentId) {
          this.$store.commit(UPDATE_COMPONENT, {id: this.attr.filterComponentId, attr: 'filter', key: this.attr.filterKey, value: value})
          this.filterStr = value
        } else {
          this.$store.commit(UPDATE_DATA, {id: this.dataId, key: this.attr.model + this.arraySequence, value: value})
        }
      }
    },
    btnClick (action, component) {
      if (component.hidePopUp) {
        this.handleCancel()
      } else {
        if (action === undefined) return
        this.$util.processAction(this, action, component, null, null, this.urlParam, this.dataId)
      }
    },
    onClose () {

    },
    showPopUp () {
      this.$refs[this.popUpRef].show()
    },
    onShow (evt) {
      // return evt.preventDefault()
      if (this.isExternalLayout) {
        this.fetchData()
      }
    },
    onShown () {
    },
    handleOk (evt) {
      if (evt !== null) {
        evt.preventDefault()
      }
    },
    handleCancel () {
      this.$refs[this.popUpRef].hide('close')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
