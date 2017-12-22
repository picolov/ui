<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-sm-12">
          <div class="row">
            <div class="col-sm-2 text-center">
              <img src="static/img/avatars/8.jpg" alt="Avatar" class="img-avatar"> 
            </div><!--/.col-->
            <div class="col-sm-5">
              <b-form-fieldset :label="'accountManagement.mainAccName' | translate" :horizontal="true">
                <b-form-input type="text" :value="profile.name"></b-form-input>
              </b-form-fieldset>
              <b-form-fieldset :label="'accountManagement.mainAccPassword' | translate" :horizontal="true">
                <b-form-input type="password" :value="profile.password"></b-form-input>
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
                <b-form-input type="text" v-model="profile.companyName" disabled></b-form-input>
              </b-form-fieldset>
              <b-form-fieldset :label="'accountManagement.mainAccIDType' | translate" :horizontal="true">
                <b-form-select v-model="profile.IDType" :options="optionsIDType"></b-form-select>
              </b-form-fieldset>
              <b-form-fieldset :label="'accountManagement.mainAccIDNumber' | translate" :horizontal="true">
                <b-form-input type="text" v-model="profile.IDNumber"></b-form-input>
              </b-form-fieldset>
            </div><!--/.col-->
            <div class="col-sm-5">
              <b-form-fieldset :label="'accountManagement.mainAccUserID' | translate" :horizontal="true">
                <b-form-input type="text" value="12314212" disabled></b-form-input>
              </b-form-fieldset>
              <b-form-fieldset :label="'accountManagement.mainAccRoleCode' | translate" :horizontal="true">
                <b-form-input type="text" value="Purchaching Admin"></b-form-input>
              </b-form-fieldset>
              <b-form-fieldset :label="'accountManagement.mainAccBizID' | translate" :horizontal="true">
                <b-form-input type="text" :value="profile.bizID"></b-form-input>
              </b-form-fieldset>
              <b-form-fieldset :label="'accountManagement.mainAccPhone' | translate" :horizontal="true">
                <b-input-group>
                  <b-form-select v-model="profile.phoneCode" :options="optionsCountry"></b-form-select>
                  <b-form-input type="text" v-model="profile.phone"></b-form-input>
                </b-input-group>
              </b-form-fieldset>
              <b-form-fieldset :label="'accountManagement.mainAccEmail' | translate" :horizontal="true">
                <b-form-input type="text" v-model="profile.email"></b-form-input>
              </b-form-fieldset>
            </div><!--/.col-->
          </div><!--/.row-->
      </div><!--/.col-->
    </div><!--/.row-->
  </div>
</template>

<script>
export default {
  name: 'accountInputForm',
  props: ['action'],
  data () {
    return {
      profile: {
        name: '',
        companyName: 'PT.Maverick',
        phone: '85659937810',
        phoneCode: '+(62)',
        bizID: '12344',
        IDType: 2,
        IDNumber: '12347891250',
        countryCode: 'ID',
        email: 'fahmi@beswaratech.com'
      },
      optionsIDType: [
        { value: '1', text: 'SIM' },
        { value: '2', text: 'KTP' },
        { value: '3', text: 'NPWP' }
      ],
      optionsCountry: [
        { value: '+(62)', countryCode: 'ID', text: '+(62) Indonesia' },
        { value: '+(60)', countryCode: 'MY', text: '+(60) Malaysia' },
        { value: '+(65)', countryCode: 'SG', text: '+(65) Singapore' }
      ]
    }
  },
  methods: {
    saveProfile () {
      this.$router.push({ query: { action: 'detail' } })
    }
  }
}
</script>
