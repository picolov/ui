<template>
  <div>
    <b-img 
      :id="attr.id" 
      :style="attr.style" 
      :src="imgSrc" 
      :rounded="attr.shape==='circle'?'circle':'0'" 
      fluid
      :width="attr.imgWidth" 
      :height="attr.imgHeight" />
    <label v-if="attr.modelLabel" :style="[{margin: 0}]">{{labelText}}</label>
  </div>
</template>

<script>
import * as config from '../config'

export default {
  name: 'a-image',
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
  computed: {
    imgSrc () {
      if (this.attr.source) {
        return this.attr.source
      } else {
        let imgSrc = this.$util.getObjectOrDefault(this.$store.state.generic.data[this.dataId], this.attr.model + this.arraySequence + (this.attr.key ? '.' + this.attr.key : ''), 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8Vw8AAmEBb87E6jIAAAAASUVORK5CYII=')
        if (imgSrc !== null && typeof imgSrc === 'object') {
          if (imgSrc.id && imgSrc.extension) {
            imgSrc = config.BASE_URL + config.FILE_VIEW_PATH + imgSrc.id + '.' + imgSrc.extension
          } else {
            imgSrc = imgSrc.data
          }
        } else if (!imgSrc.startsWith('data:') && !imgSrc.startsWith('http')) {
          imgSrc = config.BASE_URL + imgSrc
        }
        return imgSrc
      }
    },
    labelText () {
      let value = ''
      if (this.attr.textLabel && !this.attr.modelLabel) {
        value = this.$t(this.$util.stringInject(this.attr.textLabel, {data: this.$store.state.generic.data[this.dataId]}, this.dataId))
      } else if (!this.attr.textLabel && this.attr.modelLabel) {
        value = this.$util.getObjectOrDefault(this.$store.state.generic.data[this.dataId], this.attr.modelLabel + this.arraySequence + (this.attr.keyLabel ? '.' + this.attr.keyLabel : ''), '')
        if (this.attr.formatLabel === 'date') {
          value = this.$util.datetimeToString(value, this.attr.dateFormat)
        } else if (this.attr.formatLabel === 'currency') {
          value = this.$util.moneyFormat(value, 'Rp', 0, '.', ',')
        }
      }
      return value
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

