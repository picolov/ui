<template>
  <div class="app">
    <AppHeader/>
    <div class="app-body">
      <Sidebar :navItems="filteredMenus"/>
      <main class="main">
        <breadcrumb :list="list" :name="name"/>
        <div class="container-fluid">
          <router-view></router-view>
        </div>
      </main>
    </div>
    <Loading :eventBus="eventBus" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { Header as AppHeader, Sidebar, Breadcrumb, Loading } from '../components/'

export default {
  name: 'full',
  components: {
    Loading,
    AppHeader,
    Sidebar,
    Breadcrumb
  },
  data () {
    return {
      eventBus: this.$bus
    }
  },
  computed: {
    name () {
      return this.$route.name
    },
    list () {
      return this.$route.matched
    },
    ...mapState({ name: state => state.app.currPage }),
    ...mapGetters(['filteredMenus'])
  }
}
</script>
