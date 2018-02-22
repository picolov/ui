<template>
  <form-wizard 
              shape="tab" color="#ffc928" 
              :back-button-text="attr.backButtonText"
              :next-button-text="attr.nextButtonText"
              :finish-button-text="attr.finishButtonText" 
              @on-complete="onComplete"
              @on-change="onChange">
    <span slot="title"></span> 
    <tab-content v-for="(component, index) in attr.content" :key="index" :title="component.title?component.title:'tab-' + index" :before-change="beforeTabSwitch.bind(this, component)">
      <component :is="component.type" :attr="component" :array-sequence="arraySequence"/>
    </tab-content>
  </form-wizard>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import Vue from 'vue'
import { UPDATE_DATA } from '../store/mutation-types'

export default {
  name: 'a-wizardContainer',
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
    }
  },
  computed: {
    data () {
      return this.$store.state.generic.data
    }
  },
  data () {
    return {
    }
  },
  methods: {
    onComplete () {
      this.$util.processAction(this, this.attr.finishAction, this.attr, null, null, this.$route.query)
    },
    onChange (prevIdx, nextIdx) {
      let component = this.attr.content[nextIdx]
      if (component) {
        // eslint-disable-next-line no-unused-vars
        let data = this.data
        // eslint-disable-next-line no-unused-vars
        let setVar = this.setVar
        // eslint-disable-next-line no-unused-vars
        let refreshMap = this.refreshMap
        if (component.changeAction) {
          // eslint-disable-next-line no-eval
          eval('(function() {' + component.changeAction + '}())')
        }
      }
    },
    beforeTabSwitch: function (component) {
      // eslint-disable-next-line no-unused-vars
      let data = this.data
      // eslint-disable-next-line no-unused-vars
      let setVar = this.setVar
      // eslint-disable-next-line no-unused-vars
      let refreshMapId = this.refreshMapId
      if (component && component.nextAction) {
        // eslint-disable-next-line no-eval
        var result = eval('(function() {' + component.nextAction + '}())')
        return result
      } else {
        return true
      }
    },
    setVar (name, value) {
      this.$store.commit(UPDATE_DATA, {key: name, value: value})
    },
    refreshMap () {
      Vue.$gmapDefaultResizeBus.$emit('resize')
    }
  }
}
</script>

<style lang="css">
  .vue-form-wizard .wizard-header {
    height: 0;
    padding: 0;
  }
  .tab_shape {
    height: 10px!important;
  }
  .checked .tab_shape:after {
    content:'';
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -3px;
    width: 0;
    height: 0;
    border-top: solid 12px #ffc928;
    border-left: solid 6px transparent;
    border-right: solid 6px transparent;
  }
  .vue-form-wizard.md .wizard-icon-circle.tab_shape {
    background-color: #bbbbbb;
  }
  .wizard-progress-with-circle {
    height: 0!important;
  }
  .wizard-icon {
    visibility: hidden;
    overflow: hidden;
  }
  .stepTitle {
    padding-top: 10px;
    color: #bbbbbb;
  }
  .stepTitle.active{
    color: #616161!important;
    font-weight: bold;
  }
  .wizard-btn {
    color: #111!important;
    font-weight: normal!important;
  }
  .full-width {
    width: 100%;
  }
</style>
