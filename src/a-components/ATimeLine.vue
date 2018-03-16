<template>
  <div class="a-timeline">
    <b-media class="a-timeline-item" vertical-align="center" v-for="(pathUnit, index) in attr.path" :key="index">
      <div class="a-timeline-image">
        <i :class="[pathUnit.icon]"/>
      </div>
      <b-media-body class="a-timeline-text">
        <b> {{pathUnit.title | translate}} </b>
        <br />
        {{ labelText(pathUnit) }} 
      </b-media-body>
    </b-media>
  </div>
</template>

<script>
export default {
  name: 'a-timeLine',
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
  },
  methods: {
    labelText (pathUnit) {
      let value = ''
      if (pathUnit.text && !pathUnit.model) {
        let result = this.$util.stringInject(pathUnit.text, {data: this.$store.state.generic.data[this.dataId], props: this.$props}, this.dataId)
        value = this.$t(result)
      } else if (!pathUnit.text && pathUnit.model) {
        value = this.$util.getObjectOrDefault(this.$store.state.generic.data[this.dataId], pathUnit.model + this.arraySequence + (pathUnit.key ? '.' + pathUnit.key : ''), '')
        // console.log(pathUnit.model + this.arraySequence + (pathUnit.key ? '.' + pathUnit.key : ''), value)
        if (pathUnit.format === 'date') {
          value = this.$util.datetimeToString(value, pathUnit.dateFormat)
        } else if (pathUnit.format === 'currency') {
          value = this.$util.moneyFormat(value, 'Rp', 0, '.', ',')
        }
      }
      return value
    }
  }
}
</script>

<style lang="scss">
.a-timeline-item {
  padding: 10px 0;
  display: block;
  position: relative;
}
.a-timeline-item:not(:last-child):before{
  content:"";
  border-left: 2px dashed #E7E9F5;
  position: absolute;
  left: 1.45rem;
  height: 100%;
  display: block;
}
.a-timeline-image {
  width: 3rem;
  position: absolute;
  text-align: center;
  z-index: 1;
}
.a-timeline-image i.fa{
  font-size: 1.5rem;
  background-color: white;
}
.a-timeline-text{
  margin-left: 3rem !important;
}
</style>

