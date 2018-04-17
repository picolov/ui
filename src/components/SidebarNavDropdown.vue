<template>
  <router-link tag="li" :class="['nav-item', 'nav-dropdown', checkActiveUrl()]" :to="url" disabled>
    <div :class="['nav-link', 'nav-dropdown-toggle', checkActiveUrl()]" @click="handleClick"><i :class="icon"></i> {{name}}</div>
    <ul class="nav-dropdown-items">
      <slot></slot>
    </ul>
  </router-link>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    activeWhenUrl: {
      type: String,
      default: '~'
    },
    menuId: {
      type: String,
      default: '~'
    }
  },
  methods: {
    handleClick (e) {
      e.preventDefault()
      e.target.parentElement.classList.toggle('open')
    },
    checkActiveUrl () {
      let classResult = ''
      let activeWhenUrlToken = this.activeWhenUrl.split(',')
      for (let i = 0; i < activeWhenUrlToken.length; i++) {
        if (this.$route.path.indexOf(activeWhenUrlToken[i].trim()) > -1) {
          classResult = 'open active'
          break
        }
      }
      return classResult
    }
  }
}
</script>
