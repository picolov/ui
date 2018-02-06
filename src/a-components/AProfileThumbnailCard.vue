<template>
  <div class="card profile-thumbnail" :style="attr.style"
  @click="btnClick.bind(this, attr.cardAction)()">
    <b-container>
      <b-row>
        <b-col v-if="(!attr.imagePosition || attr.imagePosition=='left') && attr.imageSrc" style="padding:0px">
          <div class="image-thumbnail card-img-left" :style="'background: url(' + attr.imageSrc + ') center no-repeat;background-size: cover'"></div>
        </b-col>
        <b-col>
          <div class="card-body">
            <span class="card-text" style="display: inline-block; padding-left: 1em;">
              <span style="font-weight: bold;">{{attr.title}}</span><br/>
              {{attr.text}} <br/>
              <span style="color: #ffc928;"><i class="fa fa-star"/><i class="fa fa-star"/><i class="fa fa-star-o"/><i class="fa fa-star-o"/><i class="fa fa-star-o"/></span><br/>
              <span><small>63 ratings</small></span>
            </span>
          </div>
        </b-col>
        <b-col v-if="attr.imagePosition=='right' && attr.imageSrc" style="padding:0px">
          <div class="image-thumbnail card-img-right" :style="'background: url(' + attr.imageSrc + ') center no-repeat;background-size: cover'"></div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>

export default {
  name: 'a-profileThumbnailCard',
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
    btnClick (component) {
      if (component === undefined) return
      this.$util.processAction(this, component.action, component, null, null, this.$route.query)
    }
  }
}
</script>

<style lang="scss">
  .card.profile-thumbnail{
    cursor: pointer;
  }
  .card.profile-thumbnail:hover{
    opacity: 0.9;
  }
  .card.profile-thumbnail .image-thumbnail {
    width: 100%;
    height: 100%;
  }
</style>
