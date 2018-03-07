<template>
  <div :style="attr.style">
    <component v-for="(component, idx) in attr.content" 
      :key="idx" 
      :is="component.type" 
      :attr="component"
      :array-sequence="arraySequence"
      :data-id="dataId"
      style="margin-right: 0.5em"/>
  </div>
</template>

<script>

export default {
  name: 'a-stackContainer',
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
    }
  },
  computed: {
  },
  mounted () {
    this.attr.content.sort(function (comp1, comp2) {
      if (!comp1.idx && !comp2.idx) return 1
      else if (comp1.idx && !comp2.idx) return 1
      else if (!comp1.idx && comp2.idx) return -1
      else return comp1.idx - comp2.idx
    })
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
