<template>
  <b-card style="text-align: center;">
    <a-icon :attr="{icon: attr.icon}" style="font-size: 4vw;"/>
    <br><br>
    <a-label :attr="{text: attr.text}" style="font-weight: bold;"/>
    <br><br>
    <a-switch :attr="{model: attr.model}"/>
  </b-card>
</template>

<script>
export default {
  name: 'a-cardIconSwitch',
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
  },
  methods: {
  }
}
</script>

<style lang="scss">
</style>

