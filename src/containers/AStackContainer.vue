<template>
  <component :is="attr.viewAs?attr.viewAs:'div'">
    <component v-for="(component, idx) in attr.content" 
      :key="idx" 
      :is="component.type" 
      :attr="component" 
      :data-model="component.model" style="margin-right: 0.5em"/>
  </component>
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
