<template>
    <b-card>
        <b-media no-body>
            <b-media-aside vertical-align="center">
                <i slot="aside" :class="[attr.icon]" style="font-size:60px"/>
            </b-media-aside>
            <b-media-body class="ml-3">
                {{attr.text | translate}}
                <br>
                 <i :class="[attr.downloadIcon]"/>
                     <b-link a href= ".com">{{attr.downloadText}}</b-link>
            </b-media-body>
        </b-media>
    </b-card>
</template>

<script>
export default {
  name: 'a-downloadPDF',
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
    labelText () {
      let value = ''
      if (this.attr.text && !this.attr.model) {
        value = this.$t(this.$util.stringInject(this.attr.text, {data: this.$store.state.generic.data[this.dataId]}, this.dataId))
      } else if (!this.attr.text && this.attr.model) {
        value = this.getObjectFromString(this.attr.model + this.arraySequence + (this.attr.key ? '.' + this.attr.key : ''), '')
        if (this.attr.format === 'date') {
          value = this.$util.datetimeToString(value)
        }
      }
      return value
    }
  },
  methods: {
    getObjectFromString (key, defaultValue) {
      let result = this.$util.getObjectFromString(this.$store.state.generic.data[this.dataId], key)
      if (result === null) {
        return defaultValue
      } else if (result instanceof Array) {
        return result.join(', ')
      } else {
        return result
      }
    }
  }
}
</script>

<style lang="scss">
</style>

