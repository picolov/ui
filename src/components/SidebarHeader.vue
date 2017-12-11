<template>
  <div class="sidebar-header">
    <img src="static/img/avatars/8.jpg" alt="Avatar" class="img-avatar"> 
    <div>
      <strong>{{user ? (user.firstName && user.lastName ? user.firstName + ' ' + user.lastName : user.login) : ''}}</strong>
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

