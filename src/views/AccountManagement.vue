<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-sm-12">
        <b-card>
          <div slot="header">
            <strong><i class='fa fa-user'></i>&nbsp; {{ 'accountManagement.mainAccTitle' | translate}}</strong>
            <b-button class="float-right btn-sm" variant="secondary" v-if="editMode" @click="saveProfile()">
              <i class="fa fa-save"></i>&nbsp; {{ 'accountManagement.mainAccUpdate' | translate}}
            </b-button>
            <b-button class="float-right btn-sm" variant="link" v-else :to="{ query: {action: 'edit'} }">
              <i class="fa fa-edit"></i>&nbsp; {{ 'accountManagement.mainAccEdit' | translate}}
            </b-button>
            <label class="switch switch-text switch-info float-right mx-2">
              <input type="checkbox" class="switch-input" v-model="profile.active">
              <span class="switch-label" data-on="On" data-off="Off"></span>
              <span class="switch-handle"></span>
            </label>
          </div>
          <div class="row">
            <div class="col-sm-2 text-center">
              <img src="static/img/avatars/8.jpg" alt="Avatar" class="img-avatar"> 
            </div><!--/.col-->
            <div class="col-sm-5">
              <b-form-fieldset :label="'accountManagement.mainAccStatus' | translate" :horizontal="true">
                <b-form-input type="text" plaintext class="text-success" :value="((profile.verified) ? 'accountManagement.mainAccVerified' : 'accountManagement.mainAccUnverified' ) | translate"></b-form-input>
              </b-form-fieldset>
              <b-form-fieldset :label="'accountManagement.mainAccName' | translate" :horizontal="true">
                <b-form-input type="text" :plaintext="!editMode" :value="profile.name"></b-form-input>
              </b-form-fieldset>
              <b-form-fieldset :label="'accountManagement.mainAccPassword' | translate" :horizontal="true">
                <b-form-text type="text" tag="strong" inline>************</b-form-text> 
                <b-button class="btn-sm" variant="link" v-b-modal.changePassword>
                  <i class="fa fa-edit"></i>&nbsp; {{ 'accountManagement.changePasswordLink' | translate }}
                </b-button>
                <b-modal id="changePassword" :title="'accountManagement.changePassword' | translate" ok-title="Submit" centered>
                  <b-form-fieldset :label="'accountManagement.newPassword' | translate">
                    <b-form-input type="text"></b-form-input>
                  </b-form-fieldset>
                  <b-form-fieldset :label="'accountManagement.reNewPassword' | translate">
                    <b-form-input type="text"></b-form-input>
                  </b-form-fieldset>
                </b-modal>
              </b-form-fieldset>
              <b-form-fieldset :label="'accountManagement.mainAccCompany' | translate" :horizontal="true">
                <b-form-input type="text" :plaintext="!editMode" v-model="profile.companyName"></b-form-input>
              </b-form-fieldset>
              <b-form-fieldset :label="'accountManagement.mainAccIDType' | translate" :horizontal="true">
                <b-form-select v-model="profile.IDType" v-if="editMode" :options="optionsIDType"></b-form-select>
                <b-form-input type="text" v-if="!editMode" plaintext :value="IDTypeText"></b-form-input>
              </b-form-fieldset>
              <b-form-fieldset :label="'accountManagement.mainAccIDNumber' | translate" :horizontal="true">
                <b-form-input type="text" :plaintext="!editMode" v-model="profile.IDNumber"></b-form-input>
              </b-form-fieldset>
            </div><!--/.col-->
            <div class="col-sm-5">
              <b-form-fieldset :label="'accountManagement.mainAccUserID' | translate" :horizontal="true">
                <b-form-input type="text" :plaintext="!editMode" :value="profile.userID"></b-form-input>
              </b-form-fieldset>
              <b-form-fieldset :label="'accountManagement.mainAccRoleCode' | translate" :horizontal="true">
                <b-form-input type="text" plaintext :value="profile.jobRole"></b-form-input>
              </b-form-fieldset>
              <b-form-fieldset :label="'accountManagement.mainAccBizID' | translate" :horizontal="true">
                <b-form-input type="text" plaintext :value="profile.bizID"></b-form-input>
              </b-form-fieldset>
              <b-form-fieldset :label="'accountManagement.mainAccPhone' | translate" :horizontal="true">
                <b-input-group v-if="editMode">
                  <b-form-select v-model="profile.phoneCode" :options="optionsCountry"></b-form-select>
                  <b-form-input type="text" :plaintext="!editMode" v-model="profile.phone"></b-form-input>
                </b-input-group>
                <b-form-input type="text" v-if="!editMode" plaintext :value="profile.phoneCode + profile.phone"></b-form-input>
              </b-form-fieldset>
              <b-form-fieldset  :label="'accountManagement.mainAccEmail' | translate" :horizontal="true">
                <b-form-input type="text" :plaintext="!editMode" v-model="profile.email"></b-form-input>
              </b-form-fieldset>
            </div><!--/.col-->
          </div><!--/.row-->
        </b-card>
        <b-card>
          <div slot="header">
            <strong><i class='fa fa-users'></i>&nbsp; {{ 'accountManagement.addiUserTitle' | translate}}</strong>
            <b-button class="float-right btn-sm" variant="link" v-b-modal.addUser>
              <i class="fa fa-user-plus"></i>&nbsp; {{ 'accountManagement.addiUserAdd' | translate}}
            </b-button>
            <b-modal id="addUser" :title="'accountManagement.addiUserAdd' | translate" :ok-title="'accountManagement.addiUserSubmit' | translate" centered size="lg">
              <accountInputForm />
            </b-modal>
          </div>
          <div class="row">
            <div class="col-sm-12">
              <table class="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>{{ 'accountManagement.addiUserUsername' | translate }}</th>
                    <th>{{ 'accountManagement.addiUserUserID' | translate }}</th>
                    <th>{{ 'accountManagement.addiUserJobRole' | translate }}</th>
                    <th>{{ 'accountManagement.addiUserPhone' | translate }}</th>
                    <th>{{ 'accountManagement.addiUserEmail' | translate }}</th>
                    <th>{{ 'accountManagement.addiUserActive' | translate }}</th>
                  </tr>
                </thead>
                <tbody v-if="members && members.length">
                  <tr v-for="member in members" :key="member.id" :class="{selected: member === selectedMember}" @click="onSelect(member)">
                    <td>{{ member.name }}</td>
                    <td>{{ member.userID }}</td>
                    <td>{{ member.jobRole }}</td>
                    <td>{{ member.phone }}</td>
                    <td>{{ member.email }}</td>
                    <td>
                      <label class="switch switch-text switch-info text-center mx-2">
                        <input type="checkbox" class="switch-input" v-model="member.active">
                        <span class="switch-label" data-on="On" data-off="Off"></span>
                        <span class="switch-handle"></span>
                      </label>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="6">Yiorgos Avraamu</td>
                  </tr>
                </tbody>
              </table>
              <ul class="pagination">
                <li class="page-item"><a class="page-link" href="#">Prev</a></li>
                <li class="page-item active">
                  <a class="page-link" href="#">1</a>
                </li>
                <li class="page-item"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">3</a></li>
                <li class="page-item"><a class="page-link" href="#">4</a></li>
                <li class="page-item"><a class="page-link" href="#">Next</a></li>
              </ul>
                <b-modal id="detailUser" :title="'accountManagement.addiUserAdd' | translate" :ok-title="'accountManagement.addiUserSubmit' | translate" centered size="lg">
                  <accountInputForm />
                </b-modal>
            </div>
          </div>
        </b-card>
      </div><!--/.col-->
    </div><!--/.row-->
  </div>
</template>

<script>
import accountInputForm from './accountInputForm'
import accountDetailForm from './accountDetailForm'

export default {
  name: 'accountManagement',
  props: ['action'],
  components: {
    accountInputForm,
    accountDetailForm
  },
  data () {
    return {
      editMode: (this.action === 'edit'),
      editingAccount: null,
      profile: null,
      IDTypeArray: [],
      optionsIDType: [],
      optionsCountry: [],
      members: [],
      selectedMember: null
    }
  },
  watch: {
    action: function () {
      this.editMode = (this.action === 'edit')
    }
  },
  computed: {
    IDTypeText () {
      return this.setIDTypeText(this.profile.IDType)
    }
  },
  created () {
    this.initUI()
    this.getProfile()
    this.getMembers()
  },
  methods: {
    initUI () {
      this.getOptionIDType()
      this.getOptionCountry()
      this.IDTypeArray = this.optionsIDType.map(function (o) { return o.value })
    },
    getProfile () {
      this.profile = {
        name: 'Fahmi Zulhasymi',
        verified: true,
        active: true,
        companyName: 'PT.Maverick',
        phone: '85659937810',
        phoneCode: '+(62)',
        bizID: '12344',
        userID: '21344',
        jobRole: 'Owner',
        IDType: 2,
        IDNumber: '12347891250',
        countryCode: 'ID',
        email: 'fahmi@beswaratech.com'
      }
    },
    getOptionIDType () {
      this.optionsIDType = [
        { value: '1', text: 'SIM' },
        { value: '2', text: 'KTP' },
        { value: '3', text: 'NPWP' }
      ]
    },
    getOptionCountry () {
      this.optionsCountry = [
        { value: '+(62)', countryCode: 'ID', text: '+(62) Indonesia' },
        { value: '+(60)', countryCode: 'MY', text: '+(60) Malaysia' },
        { value: '+(65)', countryCode: 'SG', text: '+(65) Singapore' }
      ]
    },
    getMembers () {
      this.members = [
        {
          id: 1,
          name: 'Fahmi Zulhasymi',
          verified: true,
          active: true,
          companyName: 'PT.Maverick',
          phone: '85659937810',
          phoneCode: '+(62)',
          bizID: '12344',
          userID: '21344',
          jobRole: 'Purchasing',
          IDType: 2,
          IDNumber: '12347891250',
          countryCode: 'ID',
          email: 'fahmi@beswaratech.com'
        },
        {
          id: 2,
          name: 'Picolov',
          verified: true,
          active: false,
          companyName: 'PT.Maverick',
          phone: '85659937810',
          phoneCode: '+(62)',
          bizID: '12344',
          userID: '124121',
          jobRole: 'Monitoring',
          IDType: 2,
          IDNumber: '12347891250',
          countryCode: 'ID',
          email: 'picolov@beswaratech.com'
        },
        {
          id: 3,
          name: 'Harry',
          verified: true,
          active: true,
          companyName: 'PT.Maverick',
          phone: '85659937810',
          phoneCode: '+(62)',
          bizID: '12344',
          userID: '12345',
          jobRole: 'Operational',
          IDType: 2,
          IDNumber: '12347891250',
          countryCode: 'ID',
          email: 'harry@beswaratech.com'
        }
      ]
    },
    onSelect (member) {
      this.selectedMember = member
    },
    saveProfile () {
      this.$router.push({ query: { action: 'detail' } })
    },
    setIDTypeText (IDType) {
      var index = this.IDTypeArray.indexOf(IDType.toString())
      return (index > -1) ? this.optionsIDType[index].text : ''
    }
  }
}
</script>

<style scoped>
  tr.selected{
    background-color: #d9edf7 !important;
  }
</style>