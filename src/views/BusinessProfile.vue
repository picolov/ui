<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-sm-12">
        <b-card>
          <div slot="header">
            <strong>Credit Card</strong> <small>Form</small>
          </div>
          <div class="row">
            <div class="col-sm-12">
              <b-form-fieldset label="Name">
                <b-form-input type="text" id="name" placeholder="Enter your name"></b-form-input>
              </b-form-fieldset>
            </div>
          </div><!--/.row-->
          <div class="row">
            <div class="col-sm-12">
              <b-form-fieldset label="Credit Card Number">
                <b-form-input type="text" id="ccnumber" placeholder="0000 0000 0000 0000"></b-form-input>
              </b-form-fieldset>
            </div>
          </div><!--/.row-->
          <div class="row">
            <div class="col-sm-4">
              <b-form-fieldset label="Month">
                <b-form-select
                  :plain="true"
                  :options="[1,2,3,4,5,6,7,8,9,10,11,12]">
                </b-form-select>
              </b-form-fieldset>
            </div><!--/.col-->
            <div class="col-sm-4">
              <b-form-fieldset label="Year">
                <b-form-select
                  :plain="true"
                  :options="[2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024,2025]">
                </b-form-select>
              </b-form-fieldset>
            </div><!--/.col-->
            <div class="col-sm-4">
              <b-form-fieldset label="CVV/CVC">
                <b-form-input type="text" id="cvv" placeholder="123"></b-form-input>
              </b-form-fieldset>
            </div><!--/.col-->
          </div><!--/.row-->
        </b-card>
      </div><!--/.col-->
    </div><!--/.row-->
  </div>
</template>

<script>
export default {
  name: 'businessProfile'
}
</script>
