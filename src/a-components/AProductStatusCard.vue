<template>
  <div class="card product-status" :class="{ 'card-link': (attr.cardAction) }" :style="attr.style"
  @click="btnClick.bind(this, attr.cardAction)()">
    <img v-if="(!attr.imagePosition || attr.imagePosition=='top') && attr.imageSrc" class="card-img-top img-fluid" :src="attr.imageSrc" :alt="attr.imageAlt">
    <div class="card-body">
      <div class="card-action" v-if="Array.isArray(attr.headerMenu) && attr.headerMenu.length > 0">
        <b-dropdown variant="link" size="sm" no-caret>
          <template slot="button-content">
            <i class="fa fa-ellipsis-v"></i> <span class="sr-only">Menu</span>
          </template>
          <b-dropdown-item href="#" v-for="(menu, idx) in attr.headerMenu" :key="idx" @click="btnClick.bind(this, menu.action, menu)()">
            <span v-html="menu.iconClass"></span>{{ menu.title | translate}}
          </b-dropdown-item>
        </b-dropdown>
      </div>
      <span v-if="!attr.imagePosition || attr.imagePosition=='top'" class="card-button-top">{{attr.statusText}}</span>
      <h4 class="card-title text-center">{{ attr.title | translate }}</h4>
      <p class="card-text text-center">{{ attr.subtitle | translate }}</p>
      <span v-if="attr.imagePosition=='bottom'" class="card-button-bottom">{{attr.statusText}}</span>
    </div>
    <img v-if="attr.imagePosition=='bottom' && attr.imageSrc" class="card-img-bottom img-fluid" :src="attr.imageSrc" :alt="attr.imageAlt">
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
    btnClick (action, component) {
      if (action === undefined) return
      this.$util.processAction(this, action, component, null, null, this.$route.query)
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
  .card.product-status .card-action{
    position: absolute !important;
    right: 5px;
    top: 5px;
  }
</style>
