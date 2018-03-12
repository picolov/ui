<template>
  <div>
    <div class="array-container" :class="{'with-delete':attr.withDelete === true}" v-for="indexPart in data" :key="indexPart">
        <a-container :id="attr.id + '_' + indexPart" class="array-content" :attr="attr" :array-sequence="arraySeq(indexPart)" :data-id="dataId"/>
        <div v-if="attr.withDelete === true" class="delete-array-container" @click="deleteArray(arraySeq(indexPart))">
          <i class="fa fa-trash"></i>
        </div>
    </div>
  </div>
</template>

<script>
import { UPDATE_DATA } from '../store/mutation-types'

export default {
  name: 'a-arrayContainer',
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
      componentModelName: []
    }
  },
  computed: {
    data () {
      return this.$util.getObjectOrDefault(this.$store.state.generic.data[this.dataId], this.attr.model + this.arraySequence + (this.attr.key ? '.' + this.attr.key : ''), [])
    }
  },
  mounted () {
    this.$util.getComponentsWithModel(this.attr,
      (value) => {
        if (value.hasOwnProperty('model')) {
          this.componentModelName.push(value.model)
        } else if (value.hasOwnProperty('modelLabel')) {
          this.componentModelName.push(value.modelLabel)
        } else if (value.hasOwnProperty('modelFrom')) {
          this.componentModelName.push(value.modelFrom)
        } else if (value.hasOwnProperty('modelTo')) {
          this.componentModelName.push(value.modelTo)
        } else if (value.hasOwnProperty('modelCount')) {
          this.componentModelName.push(value.modelCount)
        }
      })
    this.$store.commit(UPDATE_DATA, {id: this.dataId, key: 'componentModelName', value: this.componentModelName})
  },
  methods: {
    arraySeq (indexPart) {
      if (!this.attr.arrayMode || this.attr.arrayMode === 'sequence') {
        return '_' + indexPart
      } else if (this.attr.arrayMode === 'array') {
        return '.' + (indexPart - 1)
      }
    },
    deleteArray (arraySequence) {
      this.$util.processAction(this, { 'type': 'removeRow', 'model': this.attr.model + this.arraySequence + (this.attr.key ? '.' + this.attr.key : '') }, this.attr, null, arraySequence, this.$route.query, this.dataId)
    }
  }
}
</script>

<style scoped>
.array-container {
  position: relative;
}
.array-content.with-delete {
  padding-right: 20px !important;
}
.delete-array-container {
  position: absolute;
  right: 0;
  top: 45%;
  cursor: pointer;
}
.delete-array-container:hover {
  color: red;
}
</style>
