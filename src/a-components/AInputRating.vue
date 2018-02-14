<template>
  <div class="a-inputRating">
    Rating: 
    <star-rating 
      :increment="attr.increment ? attr.increment : 1" 
      v-model="data" 
      :max-rating="attr.max ? attr.max : 5" 
      :inactive-color="attr.inactiveColor ? attr.inactiveColor : '#d8d8d8'" 
      :active-color="attr.activeColor ? attr.activeColor : '	#ffd055'"
      :item-size="attr.size ? attr.size : 10"
      :read-only="attr.readOnly !== undefined ? attr.readOnly : false"
      :show-rating="attr.showRating !== undefined ? attr.showRating : false"
      ></star-rating>
    <span><small>63 ratings</small></span>
    <!--
    <fa-rating :glyph="thumbsUp" active-color="#ffcd94"></fa-rating>
    -->
  </div>
</template>

<script>
import { UPDATE_DATA } from '../store/mutation-types'

export default {
  name: 'a-inputRating',
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
    increment: {
      type: Number,
      default: 1
    },
    rating: {
      type: Number,
      default: 0
    }

  },
  data () {
    return {
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
  mounted () {
  },
  methods: {
  }
}
</script>

<style lang="scss">
.vue-rate-it-rating-text {
  margin:auto 5px !important;
}
</style>

