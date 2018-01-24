<template>
  <form-wizard 
              shape="tab" color="#ffc928" 
              :back-button-text="backButtonText"
              :next-button-text="nextButtonText"
              :finish-button-text="finishButtonText" 
              @on-complete="onComplete"
              @on-change="onChange"
              :class="{'w-100':fullwidth}">
    <span slot="title"></span> 
    <tab-content v-for="(component, index) in components" :key="index" :title="component.title?component.title:'tab-' + index" :before-change="beforeTabSwitch.bind(this, component)">
      <generic-container :name="component.id" :components="component.content" :view-as="component.viewAs" :data="data" :shared="shared"/>
    </tab-content>
  </form-wizard>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import Vue from 'vue'

export default {
  name: 'generic-multistep',
  components: {
  },
  props: {
    components: {
      type: Array,
      required: true,
      default: () => []
    },
    data: {
      type: Object,
      required: true,
      default: () => {}
    },
    shared: {
      type: Object,
      required: true,
      default: () => {}
    },
    fullwidth: {
      type: Boolean,
      required: false,
      default: () => true
    },
    backButtonText: {
      type: String,
      required: false,
      default: () => 'Back'
    },
    nextButtonText: {
      type: String,
      required: false,
      default: () => 'Next'
    },
    finishButtonText: {
      type: String,
      required: false,
      default: () => 'Finish'
    }
  },
  data () {
    return {
      id: ''
    }
  },
  methods: {
    onComplete () {
      console.log('This is called on complete')
      this.$emit('finish')
    },
    onChange (prevIdx, nextIdx) {
      let component = this.components[nextIdx]
      console.log('This is called on change - ' + component.id)
      // eslint-disable-next-line no-unused-vars
      let data = this.data
      // eslint-disable-next-line no-unused-vars
      let setVar = this.setVar
      // eslint-disable-next-line no-unused-vars
      let refreshMap = this.refreshMap
      console.log('change action : ' + component.changeAction)
      if (component.changeAction) {
        // eslint-disable-next-line no-eval
        eval('(function() {' + component.changeAction + '}())')
      }
    },
    beforeTabSwitch: function (component) {
      // eslint-disable-next-line no-unused-vars
      let data = this.data
      // eslint-disable-next-line no-unused-vars
      let setVar = this.setVar
      // eslint-disable-next-line no-unused-vars
      let refreshMapId = this.refreshMapId
      console.log('next action : ' + component.nextAction)
      if (component.nextAction) {
        // eslint-disable-next-line no-eval
        var result = eval('(function() {' + component.nextAction + '}())')
        return result
      } else {
        return true
      }
    },
    setVar (data, name, value) {
      Vue.set(data, name, value)
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
