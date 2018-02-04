<template>
  <div>
    <component v-for="(component, idx) in attr.content" 
      :key="idx" 
      :is="component.type" 
      :attr="component"
      :array-sequence="arraySequence"
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
    }
  },
  data () {
    return {
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
