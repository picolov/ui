<template>
  <div id="notif-chat">
    <b-nav-item-dropdown right no-caret>
      <template slot="button-content">
        <a href="javascript:void(0);" target="_self" aria-disabled="false" class="nav-link">
          <i class="fa fa-bell"></i>
        </a>
        <span v-if="unreadCount > 0" class="badge badge-info badge-pill">
          {{ unreadCount }}
        </span>
      </template>
      <b-dropdown-header tag="div" class="text-center"><strong>New Notification</strong></b-dropdown-header>

      <b-dropdown-item @click="gotoNotif(notif)" :class="{'bg-info': !notif.isRead}" v-for="(notif, rowIdx) in notifLIst" :key="rowIdx">
        <div class="subject ">
          <i :class="['fa fa-' + notif.icon]"></i> {{ notif.subject }}
        </div>
        <span class="message">
          {{ notif.message }}
        </span>
      </b-dropdown-item>
      <b-dropdown-item @click="gotoNotifList" tag="div" class="text-center">
        <strong>Show All</strong>
      </b-dropdown-item>
    </b-nav-item-dropdown>
  </div>
</template>
<script>
import api from '../api/common'

export default {
  name: 'header-notification',
  data: () => {
    return {
      allNotifList: [],
      notifTimer: null,
      fetchLoading: false
    }
  },
  mounted () {
    this.getUnreadNotification()
    this.startTimer()
  },
  beforeDestroy () {
    clearInterval(this.notifTimer)
  },
  computed: {
    notifLIst () {
      if (this.allNotifList.length === 0) return []
      return this.allNotifList.slice(0, 5)
    },
    unreadCount () {
      return this.allNotifList.reduce((accumulator, notif) => {
        if (!notif.isRead) {
          accumulator++
        }
        return accumulator
      }, 0)
    }
  },
  methods: {
    gotoNotif (item) {
      this.updateRead(item)
      this.$util.processAction(this, { type: 'goto', route: item.route }, null, item.parameter, null, this.$route.query, '')
    },
    updateRead (item) {
      // todo
      item.isRead = true
      return api.put(
        '/generic/class/notification', item,
        (response) => {
          // success
        }, (error) => {
          console.log(error)
        })
    },
    gotoNotifList () {
      this.$util.processAction(this, { type: 'goto', route: 'notifChat-list' }, null, null, null, this.$route.query, '')
    },
    startTimer () {
      this.getUnreadNotification()
      this.notifTimer = setInterval(() => {
        this.getUnreadNotification()
      }, 5000)
    },
    stopTimer () {
      window.clearInterval(this.notifTimer)
    },
    getUnreadNotification () {
      if (this.fetchLoading) return
      let userBusiness = 'none'
      if (this.$store.state.user && this.$store.state.user.user) userBusiness = this.$store.state.user.user.userProfile.businessId
      this.fetchLoading = true
      new Promise((resolve, reject) => {
        return api.get(
          '/generic/class/notification?criteria=isRead;is;false,target;is;' + userBusiness,
          (response) => {
            this.allNotifList = response.data
            resolve()
          }, (error) => {
            console.log(error)
            reject(error)
          })
      }).then(() => {
        this.fetchLoading = false
      }).catch((error) => {
        console.log(error)
        this.fetchLoading = false
      })
    }
  }
}
</script>
<style lang='scss'>
#notif-chat {
  .dropdown-menu {
    min-width: 20rem;
    .dropdown-item {
      white-space: inherit;
      .subject {
        display: block;
        font-weight: bold;
        text-transform: uppercase;
        .fa {
          font-weight: bold !important;
          margin: 0px;
        }
      }
      .message {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2; // N
        line-height: 24px; // H
        max-height: 48px; // H * N
      }
    }
  }
}
</style>

