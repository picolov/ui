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
          <b-col :cols="attr.imageWidth" v-if="(!attr.imagePosition || attr.imagePosition=='left') && imgSrc" style="padding:0px">
            <div class="image-thumbnail card-img-left" :style="'background: url(' + imgSrc + ') center no-repeat;background-size: cover'"></div>
          </b-col>
          <b-col>
            <div class="card-body">
              <a-container :attr="attr" :array-sequence="arraySequence" :data-id="dataId"/>
            </div>
          </b-col>
          <b-col :cols="attr.imageWidth" v-if="attr.imagePosition=='right' && imgSrc" style="padding:0px">
            <div class="image-thumbnail card-img-right" :style="'background: url(' + imgSrc + ') center no-repeat;background-size: cover'"></div>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import * as config from '../config'

export default {
  name: 'a-thumbnailCardContainer',
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
      imageClassPosition: this.imgSrc === undefined ? 'image-left' : 'image-' + (this.attr.imagePosition === undefined ? 'left' : this.attr.imagePosition)
    }
  },
  computed: {
    imgSrc () {
      if (this.attr.imageSrc) {
        return this.attr.imageSrc
      } else if (this.attr.imageKey) {
        let imgSrc = this.$util.getObjectOrDefault(this.$store.state.generic.data[this.dataId], this.attr.model + this.arraySequence + '.' + this.attr.imageKey, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8Vw8AAmEBb87E6jIAAAAASUVORK5CYII=')
        if (!imgSrc.startsWith('data:') && !imgSrc.startsWith('http')) {
          imgSrc = config.BASE_URL + imgSrc
        }
        return imgSrc
      } else {
        return null
      }
    }
  },
  mounted () {
  },
  methods: {
    btnClick (action, component) {
      if (action === undefined) return

      let value = null
      if (this.attr.model) {
        value = this.$util.getObjectOrDefault(this.$store.state.generic.data[this.dataId], this.attr.model + this.arraySequence + (this.attr.key ? '.' + this.attr.key : ''), '')
      }
      this.$util.processAction(this, action, component, value, this.arraySequence, this.$route.query, this.dataId)
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
