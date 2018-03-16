<template>
  <div class="card" :class="[{'card-link': (attr.cardAction)}, bgVariant, textVariant]" :style="attr.style"
@click="btnClick.bind(this, attr.cardAction, attr)()">
    <div v-if="titleText  != undefined || haveMenu" class="card-header" :class="[headerBgVariant, headerTextVariant]">
      {{ titleText }} 
      <b-dropdown v-if="haveMenu && headerMenuStyle == 'dropdown'" class="card-action pull-right" variant="link" size="sm" no-caret>
        <template slot="button-content">
          <i class="fa fa-ellipsis-v"></i> <span class="sr-only">Menu</span>
        </template>
        <b-dropdown-item href="#" v-for="(menu, idx) in attr.headerMenu" :key="idx" @click="btnClick.bind(this, menu.action, menu)()">
          <span v-html="menu.iconClass"></span>&nbsp;{{ menu.title | translate}}
        </b-dropdown-item>
      </b-dropdown>
      <ul v-if="haveMenu && headerMenuStyle == 'inline'" class="header-menu-list pull-right">
        <li v-for="(menu, idx) in attr.headerMenu" :key="idx" @click="btnClick.bind(this, menu.action, menu)()">
          <button type="button"><span v-html="menu.iconClass"></span>&nbsp;{{ menu.title | translate}}</button>
        </li>
      </ul>
    </div>
    <div class="card-body">
      <h4 v-if="attr.bodyTitle != undefined" class="card-title">
        {{ attr.bodyTitle | translate}} 
      </h4>
      <a-container :attr="attr" :array-sequence="arraySequence" :data-id="dataId"/>
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
    },
    dataId: {
      type: String,
      required: true
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
      footerTextVariant: this.attr.footerTextVariant === undefined ? '' : 'text-' + this.attr.footerTextVariant,
      headerMenuStyle: this.attr.headerMenuStyle === undefined ? 'dropdown' : this.attr.headerMenuStyle
    }
  },
  computed: {
    haveMenu () {
      return (Array.isArray(this.attr.headerMenu) && this.attr.headerMenu.length > 0)
    },
    titleText () {
      let value = null
      if (this.attr.headerTitle && !this.attr.headerModel) {
        let result = this.$util.stringInject(this.attr.headerTitle, {data: this.$store.state.generic.data[this.dataId], props: this.$props}, this.dataId)
        value = this.$t(result)
      } else if (!this.attr.headerTitle && this.attr.headerModel) {
        value = this.$util.getObjectOrDefault(this.$store.state.generic.data[this.dataId], this.attr.headerModel + this.arraySequence + (this.attr.key ? '.' + this.attr.key : ''), '')
        if (this.attr.format === 'date') {
          value = this.$util.datetimeToString(value, this.attr.dateFormat)
        } else if (this.attr.format === 'currency') {
          value = this.$util.moneyFormat(value, 'Rp', 0, '.', ',')
        }
      }
      return value
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
  .card ul.header-menu-list{
    margin-bottom: 0;
  }
  .card ul.header-menu-list li{
    display: inline;
    list-style: none;
  }
  .card .header-menu-list button{
    box-shadow: none;
    background-color: transparent;
    border: 1px solid transparent;
  }
  .card .header-menu-list button:hover{
    opacity: 0.8;
  }
  .card.card-link{
    cursor: pointer;
  }
  .card.card-link:hover{
    opacity: 0.8;
  }
</style>
