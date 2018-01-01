<template>
  <header class="app-header navbar">
    <button class="navbar-toggler mobile-sidebar-toggler d-lg-none" type="button" @click="mobileSidebarToggle">
      <span class="fa fa-bars"></span>
    </button>
    <b-link class="navbar-brand" to="#"></b-link>
    <ul class="nav navbar-nav mr-auto">
      <li class="d-md-down-none nav-item">
        <a href="#" target="_self" aria-disabled="false" class="nav-link" @click="sidebarToggle">
          <i class="fa fa-bars"></i>
        </a>
      </li> 
      <li class="d-md-down-none nav-item">
        <a href="#" target="_self" aria-disabled="false" class="nav-link">
          <i class="fa fa-search"></i>
        </a>
      </li>   
    </ul>
    <ul class="nav navbar-nav right-end-nav">
      <b-nav-item-dropdown class="dropdown-flag" no-caret>
        <!-- Using button-content slot -->
        <template slot="button-content">
          <img :src="'static/img/flags/' + currentFlag" alt="id" class="img-flag">
        </template>
        <b-dropdown-item @click="changeLang('id')"><img src="static/img/flags/Indonezia.png" alt="id" class="img-flag"></b-dropdown-item>
        <b-dropdown-item @click="changeLang('en')"><img src="static/img/flags/United-Kingdom.png" alt="id" class="img-flag"></b-dropdown-item>
      </b-nav-item-dropdown>
      <li class="d-md-down-none nav-item">
        <a href="#" target="_self" aria-disabled="false" class="nav-link">
          <i class="fa fa-bell"></i> <span class="badge badge-warning badge-pill">5</span>
        </a>
      </li> 
      <li class="d-md-down-none nav-item">
        <a href="#" @click="logout()" aria-disabled="false" class="nav-link">
          <i class="fa fa-sign-out"></i>
        </a>
      </li>   
    </ul>
  </header>
</template>
<script>
export default {
  name: 'header',
  computed: {
    currentFlag () {
      let flag = ''
      switch (this.$i18n.locale()) {
        case 'id':
          flag = 'Indonezia.png'
          break
        case 'en':
          flag = 'United-Kingdom.png'
          break
      }
      return flag
    }
  },
  methods: {
    logout () {
      this.$store.dispatch('logout')
    },
    changeLang (lang) {
      this.$i18n.set(lang)
      this.$store.dispatch('loadLang', {pageLang: 'main_' + this.$i18n.locale(), instance: this})
      if (this.$route.params.page) this.$store.dispatch('loadLang', {pageLang: this.$route.params.page + '_' + this.$i18n.locale()})
    },
    sidebarToggle (e) {
      e.preventDefault()
      // document.body.classList.toggle('sidebar-hidden')
      document.body.classList.toggle('sidebar-minimized')
      document.body.classList.toggle('brand-minimized')
    },
    sidebarMinimize (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-minimized')
    },
    mobileSidebarToggle (e) {
      e.preventDefault()
      document.body.classList.toggle('sidebar-mobile-show')
    },
    asideToggle (e) {
      e.preventDefault()
      // document.body.classList.toggle('aside-menu-hidden')
    }
  }
}
</script>
<style>
.right-end-nav {
  padding-right: 1rem;
}
.img-flag {
  height: 25px;
}
.dropdown-toggle::after {
  display: inline-block;
  width: 0;
  height: 0;
  margin-left: 0.255em;
  vertical-align: 0.075em;
  content: "";
  border-top: 0.3em solid;
  border-right: 0.3em solid transparent;
  border-bottom: 0;
  border-left: 0.3em solid transparent;
}
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  display: none;
  float: left;
  min-width: 2rem;
  padding: 0 0;
  margin: 0.125rem 0 0;
  font-size: 1rem;
  color: #151b1e;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #c2cfd6;
}
</style>

