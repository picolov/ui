<template>
  <div>
    <b-img-lazy 
      :id="attr.id" 
      :style="attr.style" 
      :src="imgSrc" 
      :rounded="attr.shape==='circle'?'circle':'0'" 
      :width="attr.imgWidth" 
      :height="attr.imgHeight" />
    <label v-if="attr.modelLabel" :style="[{margin: 0}]">{{labelText}}</label>
  </div>
</template>

<script>
export default {
  name: 'a-imageLazy',
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
    imgSrc () {
      if (this.attr.source) {
        return this.attr.source
      } else {
        let imgSrc = this.$util.getObjectOrDefault(this.$store.state.generic.data, this.attr.model + this.arraySequence + (this.attr.key ? '.' + this.attr.key : ''), '')
        if (imgSrc == null) {
          imgSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8Vw8AAmEBb87E6jIAAAAASUVORK5CYII='
        }
        return imgSrc
      }
    },
    labelText () {
      let value = ''
      if (this.attr.textLabel && !this.attr.modelLabel) {
        value = this.$t(this.$util.stringInject(this.attr.textLabel, {data: this.$store.state.generic.data}))
      } else if (!this.attr.textLabel && this.attr.modelLabel) {
        value = this.$util.getObjectOrDefault(this.$store.state.generic.data, this.attr.modelLabel + this.arraySequence + (this.attr.keyLabel ? '.' + this.attr.keyLabel : ''), '')
        if (this.attr.formatLabel === 'date') {
          value = this.$util.datetimeToString(value)
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
