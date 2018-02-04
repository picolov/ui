<template>
  <b-card
    :header="attr.headerTitle"
    header-tag="header"
    :footer="attr.footerTitle"
    footer-tag="footer"
    :title="attr.bodyTitle"
    :bg-variant="attr.bgVariant"
    :text-variant="attr.textVariant"
    :header-bg-variant="attr.headerBgVariant"
    :header-text-variant="attr.headerTextVariant"
    :footer-bg-variant="attr.footerBgVariant"
    :footer-text-variant="attr.footerTextVariant">
    <div v-if="Array.isArray(attr.headerMenu) && attr.headerMenu.length > 0" slot="header">
      {{ attr.headerTitle | translate}} 
      <b-dropdown class="pull-right" variant="link" size="sm" no-caret>
        <template slot="button-content">
          <i class="fa fa-ellipsis-v"></i> <span class="sr-only">Menu</span>
        </template>
        <b-dropdown-item href="#" v-for="(menu, idx) in attr.headerMenu" :key="idx">
          <span v-html="menu.iconClass"></span>{{ menu.title | translate}}
        </b-dropdown-item>
      </b-dropdown>
    </div>
    <div>
      <a-container :attr="attr" :array-sequence="arraySequence"/>
    </div>
    <div v-if="attr.footer != undefined" slot="footer">

    </div>
  </b-card>
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
    }
  },
  computed: {
  },
  mounted () {
  },
  methods: {
  }
}
</script>

<style scoped>
</style>
