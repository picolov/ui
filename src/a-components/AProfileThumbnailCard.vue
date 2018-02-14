<template>
  <div class="card profile-thumbnail" :class="{ 'card-link': (attr.cardAction) }" :style="attr.style"
  @click="btnClick.bind(this, attr.cardAction)()">
    <b-container>
      <b-row>
        <b-col v-if="(!attr.imagePosition || attr.imagePosition=='left') && attr.imageSrc" style="padding:0px">
          <div class="image-thumbnail card-img-left" :style="'background: url(' + attr.imageSrc + ') center no-repeat;background-size: cover'"></div>
        </b-col>
        <b-col>
          <div class="card-body">
            <div class="card-action" v-if="Array.isArray(attr.headerMenu) && attr.headerMenu.length > 0">
              <b-dropdown variant="link" size="sm" no-caret>
                <template slot="button-content">
                  <i class="fa fa-ellipsis-v"></i> <span class="sr-only">Menu</span>
                </template>
                <b-dropdown-item href="#" v-for="(menu, idx) in attr.headerMenu" :key="idx"  @click="btnClick.bind(this, menu.action)()">
                  <span v-html="menu.iconClass"></span>{{ menu.title | translate}}
                </b-dropdown-item>
              </b-dropdown>
            </div>
            <span class="card-text" style="display: inline-block; padding-left: 1em;">
              <span style="font-weight: bold;">{{attr.title}}</span><br/>
              {{attr.text}} <br/>
              <div v-if="attr.rating">
                <a-inputRating :attr="attr.rating" :array-sequence="arraySequence"></a-inputRating>
              </div>
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
  .card.card-link{
    cursor: pointer;
  }
  .card.card-link:hover{
    opacity: 0.9;
  }
  .card.profile-thumbnail .image-thumbnail {
    width: 100%;
    height: 100%;
  }
  .card.profile-thumbnail .card-action{
    position: absolute !important;
    right: -5px;
    top: 5px;
  }
</style>
