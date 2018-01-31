<template>
  <b-card>
    <a-container :attr="attr" :array-sequence="arraySequence"/>
  </b-card>
</template>

<script>

export default {
  name: 'a-cardContainer',
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
