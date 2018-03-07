<template>
  <div :id="attr.id + '_wrapper'" class="a-dropDownSwitch">
    <b-btn :id="attr.id"
            variant="primary"
            ref="button"
            :style="attr.style">
      {{attr.text | translate}}
    </b-btn>
    <b-popover :target="attr.id"
        triggers="click blur"
        placement="bottom"
        :container="attr.id + '_wrapper'">
      <div class="dropdown-popover-body" ref="popup">
        <div class="row m-0" v-for="(option, optionIndex) in attr.data" :key="optionIndex" style="padding-bottom: 0.5em;">
          <toggle-button 
            @change="switchChanged(option.action, attr, option, optionIndex)" 
            :value="switchValue(option.model)" 
            @input="switchInput(option.model, attr, $event)" 
            :height="30" 
            :color="{checked: '#ffc928', unchecked: '#ffffff'}"/>
          <label style="position: absolute; left: 70px; white-space: nowrap; line-height: 1.7em; font-size: 1rem;">{{option.text | translate}}</label>
        </div>
      </div>
    </b-popover>
  </div>
</template>

<script>
import { UPDATE_DATA } from '../store/mutation-types'
export default {
  name: 'a-switch',
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
      buttonWidth: 100
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    switchValue (optionModel) {
      let value = this.$store.state.generic.data[this.dataId][optionModel + this.arraySequence]
      if (value !== null && typeof value === 'object') {
        if (value._id) return value._id
        else if (value.id) return value.id
        else if (value.value) return value.value
        else return value
      } else {
        return value
      }
    },
    switchInput (optionModel, component, value) {
      this.$store.commit(UPDATE_DATA, {id: this.dataId, key: optionModel + this.arraySequence, value: value})
    },
    switchChanged (action, component, item, itemIndex) {
      if (action === undefined) return
      this.$util.processAction(this, action, component, item, itemIndex, this.$route.query, this.dataId)
    }
  }
}
</script>

<style lang="scss">
.a-dropDownSwitch {
    position: relative;
}

.a-dropDownSwitch .bs-popover-bottom {
    position: absolute;
    margin-top: 0.5em!important;
    right: 0!important;
    left: 0!important;
    margin-top: 0;
    border: solid thin #757575;
    border-radius: 20px;
}

.a-dropDownSwitch .bs-popover-bottom .arrow {
    visibility: hidden;
}
</style>

