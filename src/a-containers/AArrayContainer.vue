<template>
  <div>
    <template v-for="indexPart in data">
      <a-container :id="attr.id + '_' + indexPart" :attr="attr" :array-sequence="'_' + indexPart" :key="indexPart"/>
    </template>
  </div>
</template>

<script>

export default {
  name: 'a-arrayContainer',
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
    data () {
      return this.$util.getObjectOrDefault(this.$store.state.generic.data, this.attr.model + this.arraySequence + (this.attr.key ? '.' + this.attr.key : ''), [])
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
