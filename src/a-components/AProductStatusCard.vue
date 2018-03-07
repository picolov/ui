<template>
  <div class="product-status" :style="attr.style">
    <div class="card-action" :class="[imageClassPosition]" v-if="Array.isArray(attr.headerMenu) && attr.headerMenu.length > 0">
      <b-dropdown variant="link" size="sm" no-caret>
        <template slot="button-content">
          <i class="fa fa-ellipsis-v"></i> <span class="sr-only">Menu</span>
        </template>
        <b-dropdown-item href="#" v-for="(menu, idx) in attr.headerMenu" :key="idx" @click="btnClick.bind(this, menu.action, menu)()">
          <span v-html="menu.iconClass"></span>{{ menu.title | translate}}
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <div class="card" :class="{ 'card-link': (attr.cardAction) }"
    @click="btnClick.bind(this, attr.cardAction, attr)()">
      <img v-if="(!attr.imagePosition || attr.imagePosition=='top') && attr.imageSrc" class="card-img-top img-fluid" :src="attr.imageSrc" :alt="attr.imageAlt">
      <div class="card-body">
        <span v-if="!attr.imagePosition || attr.imagePosition=='top'" class="card-button-top">{{attr.statusText}}</span>
        <h4 class="card-title text-center">{{ attr.title | translate }}</h4>
        <p class="card-text text-center">{{ attr.subtitle | translate }}</p>
        <span v-if="attr.imagePosition=='bottom'" class="card-button-bottom">{{attr.statusText}}</span>
      </div>
      <img v-if="attr.imagePosition=='bottom' && attr.imageSrc" class="card-img-bottom img-fluid" :src="attr.imageSrc" :alt="attr.imageAlt">
    </div>
  </div>
</template>

<script>

export default {
  name: 'a-productStatusCard',
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
      imageClassPosition: this.attr.imageSrc === undefined ? '' : 'image-' + (this.attr.imagePosition === undefined ? 'top' : this.attr.imagePosition)
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
  .product-status .card-action{
    position: absolute !important;
    right: 10px;
    padding: 5px;
    z-index: 1;
  }
  .product-status .card-action.image-top{
    top: 5px;
  }
  .product-status .card-action.image-bottom{
    top: 5px;
  }
</style>
