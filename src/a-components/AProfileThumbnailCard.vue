<template>
  <div class="profile-thumbnail" :style="attr.style">
    <div class="card-action" :class="[imageClassPosition]" v-if="Array.isArray(attr.headerMenu) && attr.headerMenu.length > 0">
      <b-dropdown variant="link" size="sm" no-caret>
        <template slot="button-content">
          <i class="fa fa-ellipsis-v"></i> <span class="sr-only">Menu</span>
        </template>
        <b-dropdown-item href="#" v-for="(menu, idx) in attr.headerMenu" :key="idx"  @click="btnClick.bind(this, menu.action, menu)()">
          <span v-html="menu.iconClass"></span>{{ menu.title | translate}}
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <div class="card" :class="{ 'card-link': (attr.cardAction) }"
    @click="btnClick.bind(this, attr.cardAction, attr)()">
      <b-container>
        <b-row>
          <b-col v-if="(!attr.imagePosition || attr.imagePosition=='left') && attr.imageSrc" style="padding:0px">
            <div class="image-thumbnail card-img-left" :style="'background: url(' + attr.imageSrc + ') center no-repeat;background-size: cover'"></div>
          </b-col>
          <b-col>
            <div class="card-body">
              <span class="card-text" style="display: inline-block; padding-left: 1em;">
                <span style="font-weight: bold;">{{ attr.title | translate }}</span><br/>
                <span>{{ attr.text | translate }}</span> <br/>
                <div v-if="attr.rating">
                  <a-inputRating :attr="attr.rating" :array-sequence="arraySequence" :data-id="dataId"></a-inputRating>
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
    },
    dataId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      imageClassPosition: this.attr.imageSrc === undefined ? '' : 'image-' + (this.attr.imagePosition === undefined ? 'left' : this.attr.imagePosition)
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
    btnClick (action, component) {
      if (action === undefined) return
      this.$util.processAction(this, action, component, null, null, this.$route.query, this.dataId)
    }
  }
}
</script>

<style lang="scss">
  .profile-thumbnail .card .image-thumbnail {
    width: 100%;
    height: 100%;
  }
  .profile-thumbnail .card-action{
    position: absolute !important;
    padding: 5px;
    top: 5px;
    z-index: 1;
  }
  .profile-thumbnail .card-action.image-left{
    right: 3%;
  }
  .profile-thumbnail .card-action.image-right{
    right: 47%;
  }
</style>
