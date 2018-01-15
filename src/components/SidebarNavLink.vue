<template>
  <div v-if="isExternalLink">
    <a :href="url" :class="classList">
      <i :class="icon"></i> <span>{{name}}</span>
      <b-badge v-if="badge && badge.text" :variant="badge.variant">{{badge.text}}</b-badge>
    </a>
  </div>
  <div v-else>
    <router-link :to="url" :class="classList">
      <i :class="icon"></i> <span>{{name}}</span>
      <b-badge v-if="badge && badge.text" :variant="badge.variant">{{badge.text}}</b-badge>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'sidebar-nav-link',
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
      badge: {
        type: Object,
        default: () => {}
      },
      variant: {
        type: String,
        default: ''
      },
      activeWhenUrl: {
        type: String,
        default: '~'
      }
    },
    computed: {
      classList () {
        return [
          'nav-link',
          this.linkVariant,
          this.checkActiveUrl
        ]
      },
      linkVariant () {
        return this.variant ? `nav-link-${this.variant}` : ''
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
      },
      isExternalLink () {
        if (this.url.substring(0, 4) === 'http') {
          return true
        } else {
          return false
        }
      }
    }
  }
</script>
