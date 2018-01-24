<template>
  <div class="sidebar-header">
    <b-img-lazy id="img-avatar" :src="user ? (user.userProfile && user.userProfile.photo ? user.userProfile.photo : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8Vw8AAmEBb87E6jIAAAAASUVORK5CYII=') : ''" rounded="circle" width="100px" height="100px" />
    <div style="padding-bottom: 0.5em;">
      <strong>{{user ? (user.userProfile ? user.userProfile.displayName : user.login) : ''}}</strong>
    </div>
    <b-button @click="switchMode()">{{mode === 'ROLE_CLIENT'?'Client':mode === 'ROLE_VENDOR'?'Vendor':mode === 'ROLE_ADMIN'?'Admin':'Unverified'}} &nbsp;<i class="fa fa-refresh"></i></b-button>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { SWITCH_MODE } from '../store/mutation-types'

export default {
  name: 'sidebar-header',
  computed: {
    ...mapState({ mode: state => state.user.mode }),
    ...mapState({ user: state => state.user.user })
  },
  methods: {
    ...mapMutations({
      switchMode: SWITCH_MODE
    })
  }
}
</script>
<style>
.img-avatar {
  width: 80px;
  height: 80px;
  margin-bottom: 10px;
}
</style>

