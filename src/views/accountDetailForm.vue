<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-sm-12">
          <div class="row">
            <div class="col-sm-2 text-center">
              <img src="static/img/avatars/8.jpg" alt="Avatar" class="img-avatar"> 
            </div><!--/.col-->
            <div class="col-sm-5">
              <b-form-fieldset :label="'accountManagement.mainAccStatus' | translate" :horizontal="true">
                <b-form-input type="text" plaintext class="text-success" value="Verified"></b-form-input>
              </b-form-fieldset>
              <b-form-fieldset :label="'accountManagement.mainAccName' | translate" :horizontal="true">
                <b-form-input type="text" plaintext :value="profile.name"></b-form-input>
              </b-form-fieldset>
              <b-form-fieldset :label="'accountManagement.mainAccPassword' | translate" :horizontal="true">
                <b-form-text type="text" tag="strong" inline>************</b-form-text> 
              </b-form-fieldset>
              <b-form-fieldset :label="'accountManagement.mainAccCompany' | translate" :horizontal="true">
                <b-form-input type="text" plaintext v-model="profile.companyName"></b-form-input>
              </b-form-fieldset>
              <b-form-fieldset :label="'accountManagement.mainAccIDType' | translate" :horizontal="true">
                <b-form-select v-model="profile.IDType" v-if="inputState" :options="optionsIDType"></b-form-select>
                <b-form-input type="text" v-if="detailState" plaintext :value="IDTypeText"></b-form-input>
              </b-form-fieldset>
              <b-form-fieldset :label="'accountManagement.mainAccIDNumber' | translate" :horizontal="true">
                <b-form-input type="text" plaintext v-model="profile.IDNumber"></b-form-input>
              </b-form-fieldset>
            </div><!--/.col-->
            <div class="col-sm-5">
              <b-form-fieldset :label="'accountManagement.mainAccUserID' | translate" :horizontal="true">
                <b-form-input type="text" plaintext value="12314212"></b-form-input>
              </b-form-fieldset>
              <b-form-fieldset :label="'accountManagement.mainAccRoleCode' | translate" :horizontal="true">
                <b-form-input type="text" plaintext value="Purchaching Admin"></b-form-input>
              </b-form-fieldset>
              <b-form-fieldset :label="'accountManagement.mainAccBizID' | translate" :horizontal="true">
                <b-form-input type="text" plaintext :value="profile.bizID"></b-form-input>
              </b-form-fieldset>
              <b-form-fieldset :label="'accountManagement.mainAccPhone' | translate" :horizontal="true">
                <b-form-input type="text" plaintext :value="profile.phoneCode + profile.phone"></b-form-input>
              </b-form-fieldset>
              <b-form-fieldset  :label="'accountManagement.mainAccEmail' | translate" :horizontal="true">
                <b-form-input type="text" plaintext v-model="profile.email"></b-form-input>
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
        name: 'Fahmi Zulhasymi',
        verified: true,
        active: true,
        companyName: 'PT.Maverick',
        phone: '85659937810',
        phoneCode: '+(62)',
        bizID: '12344',
        IDType: 2,
        IDNumber: '12347891250',
        countryCode: 'ID',
        email: 'fahmi@beswaratech.com'
      },
      IDTypeArray: [],
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
  created () {
    this.IDTypeArray = this.optionsIDType.map(function (o) { return o.value })
  },
  beforeMount () {
    this.getIDTypeText(this.profile.IDType)
  },
  computed: {
    IDTypeText () {
      return this.getIDTypeText(this.profile.IDType)
    }
  },
  methods: {
    saveProfile () {
      this.$router.push({ query: { action: 'detail' } })
    },
    getIDTypeText (IDType) {
      var index = this.IDTypeArray.indexOf(IDType.toString())
      return (index > -1) ? this.optionsIDType[index].text : ''
    }
  }
}
</script>
