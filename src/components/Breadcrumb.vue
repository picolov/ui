<template>
  <ol class="breadcrumb">
    <li class="breadcrumb-item" v-for="(item, index) in list">
      <span class="active" v-if="isLast(index)">{{ $t(showPageName(item)) }}</span>
      <router-link :to="item" v-else>{{ $t(showName(item)) }}</router-link>
    </li>
  </ol>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
      required: true,
      default: () => []
    },
    name: {
      type: String,
      required: true,
      default: () => ''
    }
  },
  methods: {
    isLast (index) {
      return index === this.list.length - 1
    },
    showName (item) {
      if (item.meta && item.meta.label) {
        item = item.meta.label
      }
      if (item.name) {
        item = item.name
      }
      return item
    },
    showPageName (item) {
      if (item.meta && item.meta.label) {
        item = item.meta.label
      } else if (item.name) {
        item = item.name
      } else if (this.name) {
        item = this.name
      }
      return item
    }
  }
}
</script>
