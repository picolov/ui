<template>
  <draggable :list="rowLayout" class="container-fluid p-0" :options="{group:{ name:'row_' + attr.id}, handle:'.row-handle'}">
    <div v-for="(colLayout, rowIdx) in rowLayout" :key="rowIdx" style="position: relative;">
      <span v-if="editMode" class="row-handle">&nbsp;</span>
      <draggable class="container-row row p-0" :list="colLayout" :options="{group:{ name:'col_' + attr.id}, handle:'.col-handle'}">
        <div 
          v-for="(component, colIdx) in colLayout" 
          :key="colIdx" 
          v-if="component.ifCondition ? evaluateStatement(component.ifCondition, attr, component, colIdx) : true"
          :class="[editMode?'grid-item-edit':'', component.offset?'offset-' + component.offset:'','col-' + component.width]" 
          :style="{
            paddingLeft: attr.marginH==null?'5px':attr.marginH + 'px',
            paddingRight: attr.marginH==null?'5px':attr.marginH + 'px',
            paddingTop: attr.marginV==null?'5px':attr.marginV + 'px',
            paddingBottom: attr.marginV==null?'5px':attr.marginV + 'px'
            }">
          <span v-if="editMode" class="col-handle">&nbsp;</span>
          <component :is="component.type" :attr="component" :array-sequence="arraySequence"/>
        </div>
      </draggable>
    </div>
  </draggable>
</template>

<script>
import draggable from 'vuedraggable'
import { mapState } from 'vuex'

export default {
  name: 'a-container',
  components: {
    draggable
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
  data () {
    return {
      rowLayout: []
    }
  },
  computed: {
    ...mapState({ editMode: state => state.app.editMode })
  },
  created () {
  },
  mounted () {
    // grouping row and col
    this.rowLayout = this.$util.orderComponentList(this.attr.content)
  },
  methods: {
    evaluateStatement (statement, component, item, index) {
      return this.$util.evaluateString.bind(this)(statement, component, item, index)
    }
  }
}
</script>

<style scoped>
.grid-item-edit {
  border: dashed thin black;
}
.row-handle {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 10px;
  height: 10px; 
  background-color: red;
  z-index: 99999;
}
.col-handle {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px; 
  background-color: blue;
  z-index: 99999;
}
.container-row {
  margin-left: 0;
  margin-right: 0;
}
</style>
