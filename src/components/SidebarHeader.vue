<template>
  <div class="sidebar-header">
    <img src="static/img/avatars/8.jpg" alt="Avatar" class="img-avatar"> 
    <div>
      <strong>{{user ? (user.firstName && user.lastName ? user.firstName + ' ' + user.lastName : user.login) : ''}}</strong>
    </div> 
    <div v-if="mode === 'ROLE_UNVERIFIED'">
      <b-btn v-b-modal.unverifiedModal>Unverified <i class="fa fa-info-circle"></i></b-btn>
      <!-- Modal Component -->
      <b-modal id="unverifiedModal" title="Account not verified!" ok-title="Fill Profile" centered @ok="goToProfile">
        <p>Hello from modal!</p>
      </b-modal>
    </div>
    <div v-if="mode !== 'ROLE_UNVERIFIED'">
      <b-btn @click="switchMode()">{{mode === 'ROLE_CLIENT'?'Client':mode === 'ROLE_VENDOR'?'Vendor':mode === 'ROLE_ADMIN'?'Admin':'Unverified'}} &nbsp;<i class="fa fa-refresh"></i></b-btn>
    </div>
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
    }),
    goToProfile: function () {
      this.$router.push({ path: 'businessProfile' })
    }
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

