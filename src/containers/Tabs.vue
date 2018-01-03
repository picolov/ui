<template>
  <b-card no-body :class="{'w-100':fullwidth}">
    <b-tabs card>
      <b-tab v-for="(component, index) in components" :key="index" :title="component.title?component.title:'tab-' + index">
        <generic-container :name="component.id" :components="component.content" :view-as="component.viewAs" :data="data"/>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>

export default {
  name: 'generic-tabs',
  components: {
  },
  props: {
    components: {
      type: Array,
      required: true,
      default: () => []
    },
    data: {
      type: Object,
      required: true,
      default: () => {}
    },
    fullwidth: {
      type: Boolean,
      required: false,
      default: () => true
    }
  },
  data () {
    return {
      id: ''
    }
  }
}
</script>

<style lang="css">
  .table {display: table;}

  .table-cell {
      display: table-cell;
  }

  .vertical-align {
    vertical-align: middle;
  }

  .row-action-button {
    margin-right: 5px;
  }

  .mx-datepicker-popup {
    left: 0!important;
  }

  .full-width {
    width: 100%;
  }
</style>
