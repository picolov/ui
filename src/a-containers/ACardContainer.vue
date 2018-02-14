<template>
  <div class="card" :class="[{'card-link': (attr.cardAction)}, bgVariant, textVariant]" :style="attr.style"
@click="btnClick.bind(this, attr.cardAction)()">
    <div v-if="attr.headerTitle  != undefined || (Array.isArray(attr.headerMenu) && attr.headerMenu.length > 0)" class="card-header" :class="[headerBgVariant, headerTextVariant]">
      {{ attr.headerTitle | translate}} 
      <b-dropdown class="card-action pull-right" variant="link" size="sm" no-caret>
        <template slot="button-content">
          <i class="fa fa-ellipsis-v"></i> <span class="sr-only">Menu</span>
        </template>
        <b-dropdown-item href="#" v-for="(menu, idx) in attr.headerMenu" :key="idx" @click="btnClick.bind(this, menu.action)()">
          <span v-html="menu.iconClass"></span>{{ menu.title | translate}}
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <div class="card-body">
      <h4 v-if="attr.bodyTitle != undefined" class="card-title">
        {{ attr.bodyTitle | translate}} 
      </h4>
      <a-container :attr="attr" :array-sequence="arraySequence"/>
    </div>
    <div v-if="attr.footerTitle != undefined" class="card-footer" :class="[footerBgVariant, footerTextVariant]">
      {{ attr.footerTitle | translate}} 
    </div>
  </div>
</template>

<script>

export default {
  name: 'a-cardContainer',
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
      activeClass: 'active',
      bgVariant: this.attr.bgVariant === undefined ? '' : 'bg-' + this.attr.bgVariant,
      textVariant: this.attr.textVariant === undefined ? '' : 'text-' + this.attr.textVariant,
      headerBgVariant: this.attr.headerBgVariant === undefined ? '' : 'bg-' + this.attr.headerBgVariant,
      headerTextVariant: this.attr.headerTextVariant === undefined ? '' : 'text-' + this.attr.headerTextVariant,
      footerBgVariant: this.attr.footerBgVariant === undefined ? '' : 'bg-' + this.attr.footerBgVariant,
      footerTextVariant: this.attr.footerTextVariant === undefined ? '' : 'text-' + this.attr.footerTextVariant
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
</style>
