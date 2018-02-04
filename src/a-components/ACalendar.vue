<template>
  <vue-event-calendar :events="demoEvents"></vue-event-calendar>
</template>

<script>
export default {
  name: 'a-calendar',
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
      demoEvents: [
        {
          date: '2018/01/10',
          title: 'Foo'
        }, {
          date: '2017/12/20',
          title: 'Bar',
          desc: 'description',
          customClass: 'disabled highlight'
        }
      ]
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

