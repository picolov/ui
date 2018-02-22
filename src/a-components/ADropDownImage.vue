<template>
  <div>
    <b-img :src="data?data.imgUrl:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8Vw8AAmEBb87E6jIAAAAASUVORK5CYII='" fluid style="float: left;width: 130px; height: 80px"/>
    <v-select :id="attr.id" v-model="data" :options="attr.data" label="text" :style="attr.style">
      <template slot="option" slot-scope="option">
          <b-img fluid :src="option.imgUrl" style="width: 130px; height: 80px"/>
          {{ option.text }}
      </template>
    </v-select>
  </div>
</template>

<script>
import { UPDATE_DATA } from '../store/mutation-types'

export default {
  name: 'a-dropDownImage',
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
    data: {
      get () {
        return this.$store.state.generic.data[this.attr.model + this.arraySequence]
      },
      set (value) {
        this.$store.commit(UPDATE_DATA, {key: this.attr.model + this.arraySequence, value: value})
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss">
</style>

