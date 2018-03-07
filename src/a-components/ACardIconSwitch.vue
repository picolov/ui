<template>
  <b-card style="text-align: center;">
    <a-icon :attr="{icon: attr.icon}" style="font-size: 4vw;" :data-id="dataId"/>
    <br><br>
    <a-label :attr="{text: attr.text}" style="font-weight: bold;" :data-id="dataId"/>
    <br><br>
    <a-switch :attr="{model: attr.model}" :data-id="dataId"/>
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
    },
    dataId: {
      type: String,
      required: true
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

