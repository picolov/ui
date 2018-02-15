<template>
  <component :is="attr.viewAs?attr.viewAs:'div'" :class="{'w-100':fullwidth}" :id="containerId">
    <div v-if="attr.showHeader" class="container-header">
      <span class="container-header-title">{{attr.title}}</span>
      <span class="container-header-right"><i class="fa fa-ellipsis-v" style="font-size: 1.8em; line-height: 1.8em;"></i></span>
    </div>
    <div v-for="(colComponentList, indexRow) in rowComponentList" :key="indexRow" :class="[(colComponentList[0].ifCondition ? evaluateString(colComponentList[0].ifCondition, colComponentList[0], data, null, null) : true)?'row row-filled':'row row-empty']">
      <div v-for="(cellComponent, indexCol) in colComponentList" :key="indexCol" v-if="cellComponent.ifCondition ? evaluateString(cellComponent.ifCondition, cellComponent, data, null, null) : true" :style="[cellComponent.style]" :class="[cellComponent.isGroup?'group-cell':null, cellComponent.noMargin? 'm-0': null, cellComponent.noPadding? 'p-0': null, cellComponent.align?'align-' + cellComponent.align: null, cellComponent.width?'col-' + cellComponent.width:'col', cellComponent.offset?'offset-' + cellComponent.offset:null]">
        <template v-for="(component, indexCell) in cellComponent.content" v-if="component.ifCondition ? evaluateString(component.ifCondition, component, data, null, null) : true">
          <!-- Container -->
          <span v-if="component.type === 'container'" :class="{'float-right':component.h_align==='right', 'w-100':component.fullwidth !== false}" :key="indexCell">
            <generic-container :id="component.id" :components="component.content" :attr="component" :data="data" :shared="shared" :index-number="indexNumber" :fullwidth="component.fullwidth" :style="component.style"/>
          </span>
          <span v-else-if="component.type === 'tabs'" :class="{'float-right':component.h_align==='right', 'w-100':component.fullwidth !== false}" :key="indexCell">
            <generic-tabs :id="component.id" :components="component.content" :data="data" :shared="shared" :fullwidth="component.fullwidth" :style="component.style"/>
          </span>
          <span v-else-if="component.type === 'multistep'" :class="{'float-right':component.h_align==='right', 'w-100':component.fullwidth !== false}" :key="indexCell">
            <generic-multistep :id="component.id" :components="component.content" :data="data" :shared="shared" :back-button-text="component.backButtonText" :next-button-text="component.nextButtonText" :finish-button-text="component.finishButtonText" @finish="btnClick(component.finishAction, component)" :fullwidth="component.fullwidth" :style="component.style"/>
          </span>
          <span v-else-if="component.type === 'containerArray'" :key="indexCell">
            <template v-for="indexPart in data[component.model]">
              <generic-container :id="component.id + '_' + indexPart" :components="component.content" :attr="component" :index-number="indexPart" :data="data" :shared="shared" :fullwidth="component.fullwidth" :style="component.style" :key="indexPart"/>
            </template>
          </span>
          <!-- Basic Component -->
          <span v-else-if="component.type === 'iconStack'" :class="{'fa-stack':true,'float-right':component.h_align==='right'}" :key="indexCell">
              <i :class="[component.icon, 'fa-stack-2x']"></i>
              <strong class="fa-stack-1x">
                  {{stringInjectFunc(component.text, {data: $data, props: $props}) | translate}}   
              </strong>
          </span>
          <span v-else-if="component.type === 'icon'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
              <i :class="[component.icon]" :style="component.style"></i>
          </span>
          <span v-else-if="component.type === 'hline'" :class="[cellComponent.noMargin? 'm-0': null, cellComponent.noPadding? 'p-0': null, cellComponent.width?'col-' + cellComponent.width:'col', cellComponent.offset?'offset-' + cellComponent.offset:null]"
          :key="indexCell">
            <hr :style="component.style"/>
          </span>
          <span v-else-if="component.type === 'label' && component.text && !component.model" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <component :is="component.viewAs?component.viewAs:'label'" :id="component.id" :style="[component.style, {margin: 0}]">{{stringInjectFunc(component.text, {data: $data, props: $props}) | translate}} <small v-if="component.mandatory" class="text-danger">*</small></component>
          </span>
          <span v-else-if="component.type === 'label' && !component.text && component.model" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <label :id="component.id" :style="[component.style, {margin: 0}]">{{getObjectFromString(component.model+dataIndex, '')}}</label>
          </span>
          <span v-else-if="component.type === 'imageb64' && !component.source && component.model" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-img-lazy :id="component.id" :style="component.style" :src="getObjectFromString(component.model+dataIndex, 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8Vw8AAmEBb87E6jIAAAAASUVORK5CYII=')" :rounded="component.shape==='circle'?'circle':'0'" :width="component.imgWidth" :height="component.imgHeight" />
          </span>
          <span v-else-if="component.type === 'imageb64' && component.source && !component.model" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-img-lazy :id="component.id" :style="component.style" :src="component.source" :rounded="component.shape==='circle'?'circle':'0'" :width="component.imgWidth" :height="component.imgHeight" />
          </span>
          <span v-else-if="component.type === 'uploadFile'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <generic-filebase64 
              :id="component.id" :style="component.style"
              accept="image/png,image/jpeg"
              @file="(file) => {}"
              @load="(dataUri) => { uploadb64(data, component, dataUri) }"
              :disable-preview = "true"
              :placeholder="component.text | translate" />
          </span>
          <span v-else-if="component.type === 'textfield'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-form-input :id="component.id" type="text" :name="component.model+dataIndex" v-model="data[component.model+dataIndex]" v-validate="!component.validation ? '' : component.validation.join('|')" :data-vv-as="component.label | translate" :state="errors.has(component.model+dataIndex) ? false : null" :style="component.style" :placeholder="component.placeholder"/>
          </span>
          <span v-else-if="component.type === 'numberfield'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-form-input :id="component.id" type="number" :name="component.model+dataIndex" v-model="data[component.model+dataIndex]" v-validate="!component.validation ? '' : component.validation.join('|')" :data-vv-as="component.label | translate" :state="errors.has(component.model+dataIndex) ? false : null" :style="component.style" :placeholder="component.placeholder"/>
          </span>
          <span v-else-if="component.type === 'passwordfield'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-form-input :id="component.id" type="password" :name="component.model+dataIndex" v-model="data[component.model+dataIndex]" v-validate="!component.validation ? '' : component.validation.join('|')" :data-vv-as="component.label | translate" :state="errors.has(component.model+dataIndex) ? false : null" :style="component.style" :placeholder="component.placeholder"/>
          </span>
          <span v-else-if="component.type === 'emailfield'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-form-input :id="component.id" type="email" :name="component.model+dataIndex" v-model="data[component.model+dataIndex]" v-validate="!component.validation ? '' : component.validation.join('|')" :data-vv-as="component.label | translate" :state="errors.has(component.model+dataIndex) ? false : null" :style="component.style" :placeholder="component.placeholder"/>
          </span>
          <span v-else-if="component.type === 'datepicker'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <date-picker :id="component.id" format="yyyy-MM-dd" :name="component.model+dataIndex" v-model="data[component.model+dataIndex]" v-validate="!component.validation ? '' : component.validation.join('|')" :data-vv-as="component.label | translate" :state="errors.has(component.model+dataIndex) ? false : null" lang="en" width="100%" class="full-width" :style="component.style" :placeholder="component.placeholder"/>
          </span>
          <span v-else-if="component.type === 'datetimepicker'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <date-picker type="datetime" :id="component.id" format="yyyy-MM-dd HH:mm:ss" :name="component.model+dataIndex" v-model="data[component.model+dataIndex]" v-validate="!component.validation ? '' : component.validation.join('|')" :data-vv-as="component.label | translate" :state="errors.has(component.model+dataIndex) ? false : null" lang="en" width="100%" class="full-width" :style="component.style" :placeholder="component.placeholder"/>
          </span>
          <span v-else-if="component.type === 'daterangepicker'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <date-picker :id="component.id" range="true" format="yyyy-MM-dd" :name="component.model+dataIndex" v-model="data[component.model+dataIndex]" lang="en" width="100%" class="full-width" v-validate="!component.validation ? '' : component.validation.join('|')" :data-vv-as="component.label | translate" :state="errors.has(component.model+dataIndex) ? false : null" :style="component.style" :placeholder="component.placeholder"/>
          </span>
          <span v-else-if="component.type === 'dropdown' && component.data" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-form-select :id="component.id" :name="component.model+dataIndex" v-model="data[component.model+dataIndex]" :options="component.data" :style="component.style" :placeholder="component.placeholder"></b-form-select>
          </span>
          <span v-else-if="component.type === 'dropdown' && component.source" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-form-select :id="component.id" :name="component.model+dataIndex" :value="dropdownValue(data[component.model+dataIndex])" @input="dropdownInput(component.model+dataIndex, component, $event)" :options="options[component.source.model]" :style="component.style" :placeholder="component.placeholder"></b-form-select>
          </span>
          <span v-else-if="component.type === 'imagedropdown' && component.data" class="image-dropdown" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <!-- position:absolute;top: 0; bottom: 0; left: 0; right: 0; margin: auto; -->
            <b-img :src="'https://www.penskeusedtrucks.com/imgs/18-26-diesel-cargo-van-w.jpg'" fluid style="float: left;width: 130px; height: 80px"/>
            <v-select :id="component.id" v-model="data[component.model+dataIndex]" :options="component.data" label="text" :style="component.style">
              <template slot="option" slot-scope="option">
                  <b-img fluid :src="option.imgUrl" style="width: 130px; height: 80px"/>
                  {{ option.text }}
              </template>
            </v-select>
          </span>
          <span v-else-if="component.type === 'radiobutton' && component.data" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-form-radio-group :id="component.id" :name="component.model+dataIndex" v-model="data[component.model+dataIndex]" :options="component.data" :style="component.style"/>
          </span>
          <span v-else-if="component.type === 'radiobutton' && component.source" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-form-radio-group :id="component.id" :name="component.model+dataIndex" :value="dropdownValue(data[component.model+dataIndex])" @input="dropdownInput(component.model+dataIndex, component, $event)" :options="options[component.source.model]" :style="component.style"/>      
          </span>
          <span v-else-if="component.type === 'checkbox' && component.data" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-form-checkbox-group :id="component.id" :name="component.model+dataIndex" v-model="data[component.model+dataIndex]" :options="component.data" :style="component.style"/>
          </span>
          <span v-else-if="component.type === 'checkbox' && component.source" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-form-checkbox-group :id="component.id" :name="component.model+dataIndex" :checked="checkboxValue(data[component.model+dataIndex])" @input="checkboxInput(component.model+dataIndex, component, $event)" :options="options[component.source.model]" :style="component.style" :placeholder="component.placeholder"/>      
          </span>
          <span v-else-if="component.type === 'switch' && component.model" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <toggle-button :id="component.id" v-model="data[component.model+dataIndex]" :height="30" :color="{checked: '#ffc928', unchecked: '#ffffff'}" :style="component.style"/>
          </span>
          <span v-else-if="component.type === 'button'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-button :id="component.id" @click="btnClick(component.action, component)" :style="[component.style, component.style == null || component.style.width == null ? {minWidth: '120px'}:null]"><i v-if="component.icon" :class="[component.icon]"/> {{component.text | translate}}</b-button>
          </span>
          <span :id="component.id + '_wrapper'" v-else-if="component.type === 'dropdownswitch' && component.data" :class="{'float-right':component.h_align==='right', 'dropdownswitch-wrap': true}" :key="indexCell">
            <b-btn :id="component.id"
                    variant="primary"
                    ref="button"
                    :style="component.style">
              {{component.text}}
            </b-btn>
            <b-popover :target="component.id"
               triggers="click blur"
               placement="bottomleft"
               :container="component.id + '_wrapper'">
              <div class="dropdown-popover-body">
                <div class="row" v-for="(option, optionIndex) in component.data" :key="optionIndex" style="padding-bottom: 0.5em;">
                  <toggle-button @change="switchChanged(option.action, component, option, optionIndex)" v-model="data[option.model+dataIndex]" :height="30" :color="{checked: '#ffc928', unchecked: '#ffffff'}"/>
                  <label style="position: absolute; left: 70px; white-space: nowrap; line-height: 1.7em; font-size: 1rem;">{{option.text}}</label>
                </div>
              </div>
            </b-popover>
          </span>
          <span v-else-if="component.type === 'cardvertical'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-card :title="component.title"
                    img-src="https://placekitten.com/g/400/450"
                    img-fluid
                    img-alt="image"
                    img-top
                    :style="component.style">
              <span class="card-button-top">{{component.statusText}}</span>
              <p class="card-text">
                {{component.text}}
              </p>
            </b-card>
          </span>
          <span v-else-if="component.type === 'cardhorizontal'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-card :style="component.style">
              <b-img-lazy class="card-image-left" style="width: 7.5em; height: 7.5em" :src="'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN8Vw8AAmEBb87E6jIAAAAASUVORK5CYII='" />
              <span class="card-text" style="display: inline-block; padding-left: 1em;">
                <span style="font-weight: bold;">{{component.title}}</span><br/>
                {{component.text}} <br/>
                <span style="color: #ffc928;"><i class="fa fa-star"/><i class="fa fa-star"/><i class="fa fa-star-o"/><i class="fa fa-star-o"/><i class="fa fa-star-o"/></span><br/>
                <span><small>63 ratings</small></span>
              </span>
            </b-card>
          </span>
          <span v-else-if="component.type === 'cardtoggle'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-card :class="[data[component.model+dataIndex] === component.value?'card-toggle-selected':'']" @click="cardToggleClick(component, dataIndex)" style="text-align: center;">
              <i :class="[component.icon]" style="font-size: 4vw;"></i><br/><br/>
              <p class="card-text">
                <span style="font-weight: bold;">{{component.title | translate}}</span><br/>
                {{component.text | translate}}
              </p>
            </b-card>
          </span>
          <span v-else-if="component.type === 'cardswitch'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-card style="text-align: center;">
              <i :class="[component.icon]" style="font-size: 4vw;;"></i><br/><br/>
              <p class="card-text">
                <span style="font-weight: bold;">{{component.title | translate}}</span><br/><br/>
                <toggle-button v-model="data[component.model+dataIndex]" :height="30" :color="{checked: '#ffc928', unchecked: '#ffffff'}"/>
              </p>
            </b-card>
          </span>
          <span v-else-if="component.type === 'card2'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <b-card
              :header="component.header_title"
              header-tag="header"
              :footer="component.footer_title"
              footer-tag="footer"
              :title="component.body_title"
              :bg-variant="component.bg_variant"
              :text-variant="component.text_variant"
              :header-bg-variant="component.header_bg_variant"
              :header-text-variant="component.header_text_variant"
              :footer-bg-variant="component.footer_bg_variant"
              :footer-text-variant="component.footer_text_variant"
            >
              <div v-if="component.header != undefined" slot="header">
                <generic-container :id="component.header.id" :components="component.header.content" :attr="component.header" :data="data" :shared="shared" :index-number="indexNumber" :fullwidth="component.header.fullwidth" :style="component.header.style"/>
              </div>
              <div v-if="component.body != undefined">
                <generic-container :id="component.body.id" :components="component.body.content" :attr="component.body" :data="data" :shared="shared" :index-number="indexNumber" :fullwidth="component.body.fullwidth" :style="component.body.style"/>
              </div>
              <div v-if="component.footer != undefined" slot="footer">
                <generic-container :id="component.footer.id" :components="component.footer.content" :attr="component.footer" :data="data" :shared="shared" :index-number="indexNumber" :fullwidth="component.footer.fullwidth" :style="component.footer.style"/>
              </div>
            </b-card>
          </span>
          <span v-else-if="component.type === 'calendar'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <vue-event-calendar :events="demoEvents"></vue-event-calendar>
          </span>
          <span v-else-if="component.type === 'linechart'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <chartjs-line></chartjs-line>
          </span>
          <span v-else-if="component.type === 'barchart'" :class="{'float-right':component.h_align==='right'}" :key="indexCell">
            <chartjs-bar></chartjs-bar>
          </span>
          <!-- Complex Component -->
          <span v-else-if="component.type === 'mapPicker'" :key="indexCell">
            <b-input-group>
              <b-form-input :id="component.id" type="text" readonly @click.native="mapPickerClick(component.model+dataIndex, component)" :name="component.model+dataIndex" v-model="data[component.model+dataIndex]" v-validate="!component.validation ? '' : component.validation.join('|')" :data-vv-as="component.label | translate" :state="errors.has(component.model+dataIndex) ? false : null" :style="[component.style, {borderRadius: '5px 0 0 5px', backgroundColor: 'white'}]" :placeholder="'map_selectlocation' | translate"/>
              <b-input-group-addon style="border-radius: 0 5px 5px 0;"><i class="fa fa-globe"></i></b-input-group-addon>
            </b-input-group>
          </span>
          <span v-else-if="component.type === 'map'" :key="indexCell">
            <gmap-map
              :ref="component.id"
              :center="{lat:-6.2152408, lng:106.8301251}"
              :zoom="12"
              map-type-id="hybrid"
              :style="[component.style, component.style == null || component.style.width == null ? {width: '100%'}:null, component.style == null || component.style.height == null ? {height: '300px'}:null]"
              :options="{
                fullscreenControl: false,
                mapTypeControl: false,
                zoomControl: true,
                zoomControlOptions: {
                  position: 9
                },
                rotateControl: false,
                scaleControl: true,
                scaleControlOptions: {
                  position: 12
                },
                streetViewControl: false,
                backgroundColor: 'grey',
                scrollwheel: false
              }"
              :key="indexCell">
              <gmap-marker
                v-if="stringToLatlng(data[component.model])"
                :position="stringToLatlng(data[component.model])"
              ></gmap-marker>
            </gmap-map>
          </span>
          <span v-else-if="component.type === 'mapLineArray'" :key="indexCell">
            <gmap-map
              :ref="component.id"
              :center="{lat:-6.2152408, lng:106.8301251}"
              :zoom="12"
              map-type-id="hybrid"
              :style="[component.style, component.style == null || component.style.width == null ? {width: '100%'}:null, component.style == null || component.style.height == null ? {height: '300px'}:null]"
              :options="{
                fullscreenControl: false,
                mapTypeControl: false,
                zoomControl: true,
                zoomControlOptions: {
                  position: 9
                },
                rotateControl: false,
                scaleControl: true,
                scaleControlOptions: {
                  position: 12
                },
                streetViewControl: false,
                backgroundColor: 'grey',
                scrollwheel: false
              }"
              :key="indexCell">
              <gmap-marker
                v-for="indexPart in data[component.modelCount]" v-if="data[component.modelFrom + '_' + indexPart] && stringToLatlng(data[component.modelFrom + '_' + indexPart].latLng)"
                :position="stringToLatlng(data[component.modelFrom + '_' + indexPart].latLng)"
                 :key="indexPart"
              ></gmap-marker>
              <gmap-marker
                v-for="indexPart in data[component.modelCount]" v-if="data[component.modelTo + '_' + indexPart] && stringToLatlng(data[component.modelTo + '_' + indexPart].latLng)"
                :position="stringToLatlng(data[component.modelTo + '_' + indexPart].latLng)"
                 :key="indexPart"
              ></gmap-marker>
              <gmap-polyline v-for="indexPart in data[component.modelCount]" 
               v-if="data[component.modelFrom + '_' + indexPart] && stringToLatlng(data[component.modelFrom + '_' + indexPart].latLng) && data[component.modelTo + '_' + indexPart] && stringToLatlng(data[component.modelTo + '_' + indexPart].latLng)"
              :path="[stringToLatlng(data[component.modelFrom + '_' + indexPart].latLng),stringToLatlng(data[component.modelTo + '_' + indexPart].latLng)]" :key="indexPart">
              </gmap-polyline>
            </gmap-map>
          </span>
          <span v-else-if="component.type === 'mapArray'" :key="indexCell">
            <gmap-map
              :ref="component.id"
              :center="{lat:-6.2152408, lng:106.8301251}"
              :zoom="12"
              map-type-id="hybrid"
              :style="[component.style, component.style == null || component.style.width == null ? {width: '100%'}:null, component.style == null || component.style.height == null ? {height: '300px'}:null]"
              :options="{
                fullscreenControl: false,
                mapTypeControl: false,
                zoomControl: true,
                zoomControlOptions: {
                  position: 9
                },
                rotateControl: false,
                scaleControl: true,
                scaleControlOptions: {
                  position: 12
                },
                streetViewControl: false,
                backgroundColor: 'grey',
                scrollwheel: false
              }"
              :key="indexCell">
              <gmap-marker
                v-for="indexPart in data[component.modelCount]" v-if="stringToLatlng(data[component.model + '_' + indexPart])"
                :position="stringToLatlng(data[component.model + '_' + indexPart])"
                 :key="indexPart"
              ></gmap-marker>
            </gmap-map>
          </span>
          <span v-else-if="component.type === 'table' && fields[component.id] != null" :key="indexCell">
            <b-table :ref="component.id"
              head-variant="dark"
              :apiUrl="component.id + ';' + component.model"
              :items="myProvider" 
              :fields="fields[component.id]" 
              :current-page="currentPage[component.id]"
              :per-page="perPage[component.id]"
              :style="component.style">
              <template v-for="field in fields[component.id]" :slot="'HEAD_' + field.key" v-if="field.key != 'actions'" slot-scope="data">
                <h6 class="text-center" :key="field.key">{{data.label | translate}}</h6>
                <input v-if="field.filter" type="text" @click.stop=";" v-model="filter[component.id][field.key]" @keyup="filterTyped(component)" :key="field.key" style="width: 100%;"/>
              </template>
              <template v-for="field in fields[component.id]" :slot="field.key" v-if="field.key != 'actions'" slot-scope="data">
                {{data.value}}
              </template>
              <template slot="HEAD_actions" v-if="component.actions != undefined" slot-scope="data">
                <h6 class="text-center">{{data.label | translate}}</h6>
              </template>
              <template slot="actions" v-if="component.actions != undefined" slot-scope="row">
                <template v-for="(action, index) in component.actions" v-if="action.ifCondition ? evaluateString(action.ifCondition, component, data, row.item, row.index) : true">
                  <toggle-button @change="rowActionClick(row.item, row.index, component, action)" :height="30" :color="{checked: '#ffc928', unchecked: '#ffffff'}" v-if="action.component && action.component === 'switch'" :id="component.id" v-model="row.item[action.model]" :style="component.style" :key="index"/>
                  <b-button v-else size="sm" @click.stop="rowActionClick(row.item, row.index, component, action)" class="row-action-button" :key="index">
                    <i v-if="action.icon" :class="[action.icon]"></i>{{action.text | translate}}
                  </b-button>
                </template>
              </template>
            </b-table>
            <b-pagination :total-rows="totalRows[component.id]" :per-page="perPage[component.id]" v-model="currentPage[component.id]" align="center"/>
          </span>
          <span v-else :key="indexCell">
            &nbsp;
          </span>
          <!-- Validation Addon -->
          <b-form-invalid-feedback v-if="component.validation" tag="span" :force-show="errors.has(component.model)" :key="indexCell">
            {{ errors.first(component.model) }}
          </b-form-invalid-feedback>
          <!-- space between component in group -->
          {{cellComponent.isGroup?'&nbsp;':''}}
        </template>
      </div>
    </div>
  </component>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import { mapMutations } from 'vuex'
import { SHOW_ALERT, SELECT_LOCATION } from '../store/mutation-types'
import bCard from 'bootstrap-vue/es/components/card/card'
import CalendarPanel from 'vue2-datepicker/datepicker/calendar-panel.vue'
import api from '../api/common'

export default {
  name: 'generic-container',
  components: {
    card: bCard,
    CalendarPanel
  },
  props: {
    isRoot: {
      type: Boolean,
      required: false,
      default: () => false
    },
    components: {
      type: Array,
      required: true,
      default: () => []
    },
    attr: {
      type: Object,
      required: false,
      default: () => {
        return {
          viewAs: 'div'
        }
      }
    },
    data: {
      type: Object,
      required: true,
      default: () => {}
    },
    shared: {
      type: Object,
      required: true,
      default: () => {}
    },
    fullwidth: {
      type: Boolean,
      required: false,
      default: () => true
    },
    indexNumber: {
      type: Number,
      required: false,
      default: () => null
    }
  },
  data () {
    return {
      options: {},
      fields: {},
      filter: {},
      currentPage: {},
      perPage: {},
      totalRows: {},
      rowComponentList: [],
      place: {},
      demoEvents: [
        {
          date: '2018/01/10',
          title: 'Foo'
        }, {
          date: '2017/12/20',
          title: 'Bar',
          desc: 'description',
          customClass: 'disabled highlight'
        }
      ]
    }
  },
  computed: {
    containerId () {
      return guid()
    },
    dataIndex () {
      return this.indexNumber ? '_' + this.indexNumber : ''
    }
  },
  mounted () {
    this.rowComponentList = orderComponentList(this.components)
    this.id = ''
    this.options = {}
    this.fields = {}
    this.filter = {}
    this.currentPage = {}
    this.perPage = {}
    this.totalRows = {}
    // get all options data
    for (let row = 0; row < this.rowComponentList.length; row++) {
      let colComponentList = this.rowComponentList[row]
      for (let col = 0; col < colComponentList.length; col++) {
        let cellComponentGroup = colComponentList[col]
        let cellComponentList = cellComponentGroup.content
        for (let cellNum = 0; cellNum < cellComponentList.length; cellNum++) {
          let component = cellComponentList[cellNum]
          if ((component.type === 'dropdown' || component.type === 'radiobutton' || component.type === 'checkbox') && component.source) {
            api.get('generic/class/' + component.source.model,
              (response) => {
                let optionList = []
                for (let i = 0; i < response.data.length; i++) {
                  let option = response.data[i]
                  option.value = option[component.source.value]
                  option.text = option[component.source.text]
                  optionList.push(option)
                }
                Vue.set(this.options, component.source.model, optionList)
              },
              () => { }
            )
          } else if (component.type === 'table') {
            Vue.set(this.fields, component.id, [])
            if (component.criteria) {
              let filterCrit = {}
              let processedCrit = stringInject(component.criteria, this.data)
              if (processedCrit) {
                let tokenListCrit = processedCrit.split(',')
                for (let i = 0; i < tokenListCrit.length; i++) {
                  let tokenCrit = tokenListCrit[i].split(';')
                  let critKey = tokenCrit[0]
                  let critOps = tokenCrit[1]
                  let critVal = tokenCrit[2]
                  filterCrit[critKey] = critOps + ':' + critVal
                }
                Vue.set(this.filter, component.id, filterCrit)
              } else {
                Vue.set(this.filter, component.id, {})
              }
            } else {
              Vue.set(this.filter, component.id, {})
            }
            Vue.set(this.currentPage, component.id, 1)
            Vue.set(this.perPage, component.id, 5)
            Vue.set(this.totalRows, component.id, 0)
            for (let i = 0; i < component.fields.length; i++) {
              let field = component.fields[i]
              // let columnMap = {key: field.key, label: field.label, sortable: field.sortable, class: field.class}
              if (field.type === 'date') {
                field.formatter = (value, key, item) => {
                  let format = 'YYYY-MM-DD'
                  if (field.format) format = field.format
                  let utcTime = moment.utc(getObjectFromString(item, key), 'x')
                  // momentjs is mutable, doing moment.utc(value, 'x').local() will change all
                  let localTime = moment(utcTime).local()
                  return localTime.format(format)
                }
              } else if (field.type === 'datetime') {
                field.formatter = (value, key, item) => {
                  let format = 'YYYY-MM-DD h:mm:ss'
                  if (field.format) format = field.format
                  let utcTime = moment.utc(getObjectFromString(item, key), 'x')
                  // momentjs is mutable, doing moment.utc(value, 'x').local() will change all
                  let localTime = moment(utcTime).local()
                  return localTime.format(format)
                }
              } else if (field.type === 'stringlist') {
                if (field.source) {
                  api.get('generic/class/' + field.source.model,
                    (response) => {
                      let optionList = []
                      for (let i = 0; i < response.data.length; i++) {
                        let option = response.data[i]
                        option.value = option[field.source.value]
                        option.text = option[field.source.text]
                        optionList.push(option)
                      }
                      Vue.set(this.options, field.source.model, optionList)
                    },
                    () => { }
                  )
                }
                field.formatter = (value, key, item) => {
                  let val = getObjectFromString(item, key)
                  let result = ''
                  if (field.source && val && this.options[field.source.model]) {
                    let option = this.options[field.source.model]
                    let optionMap = {}
                    for (let j = 0; j < option.length; j++) {
                      optionMap[option[j].value] = option[j]
                    }
                    for (let k = 0; k < val.length; k++) {
                      if (result === '') {
                        if (optionMap.hasOwnProperty(val[k])) result += optionMap[val[k]].text
                        else result += '<' + val[k] + '>'
                      } else {
                        if (optionMap.hasOwnProperty(val[k])) result += ', ' + optionMap[val[k]].text
                        else result += ', <' + val[k] + '>'
                      }
                    }
                  } else if (field.data && val) {
                    let option = field.data
                    let optionMap = {}
                    for (let j = 0; j < option.length; j++) {
                      optionMap[option[j].value] = option[j]
                    }
                    for (let k = 0; k < val.length; k++) {
                      if (result === '') {
                        result += optionMap[val[k]].text
                      } else {
                        result += ', ' + optionMap[val[k]].text
                      }
                    }
                  }
                  return result
                }
              } else {
                field.formatter = (value, key, item) => {
                  return getObjectFromString(item, key)
                }
              }
              this.fields[component.id].splice(this.fields[component.id].length, 1, field)
            }
            this.fields[component.id].splice(this.fields[component.id].length, 1, { key: 'actions', label: 'Actions' })
          }
          // if component is map (needed because the map will need to be refreshed if hidden intially)
          // or has ref which means will likely get refered from other then put it on shared components stack
          if (component.ref || component.type === 'map' || component.type === 'mapLineArray' || component.type === 'mapArray') {
            this.shared.components.push(component)
          }
        }
      }
    }
    this.$nextTick(() => {
      // Code that will run only after the entire view and child has been rendered
      // scan all map component and fitbounds the marker on each map
      for (let i = 0; i < this.shared.components.length; i++) {
        let comp = this.shared.components[i]
        if (comp.type === 'map' || comp.type === 'mapLineArray' || comp.type === 'mapArray') {
          this.refreshMap(comp)
        }
      }
    })
  },
  methods: {
    myProvider (ctx, callback) {
      let token = ctx.apiUrl.split(';')
      let compId = token[0]
      let apiUrl = token[1]
      let empty = []
      let filter = this.filter[compId]
      let params = '?page=' + (ctx.currentPage - 1) + '&size=' + ctx.perPage
      if (ctx.sortBy) {
        params = params + '&sort=' + ctx.sortBy + ';' + (ctx.sortDesc ? 'desc' : 'asc')
      }
      let hasFilter = false
      let filterCrit = ''
      for (var key in filter) {
        if (filter.hasOwnProperty(key) && filter[key] != null && filter[key].length > 0) {
          hasFilter = true
          let filterVal = filter[key]
          let filterOperator = 'filter'
          let pos = filterVal.indexOf(':')
          if (pos > -1) {
            filterOperator = filterVal.substr(0, pos)
            filterVal = filterVal.substr(pos + 1)
          }
          if (filterCrit.length === 0) {
            filterCrit = key + ';' + filterOperator + ';' + filterVal
          } else {
            filterCrit = filterCrit + ',' + key + ';' + filterOperator + ';' + filterVal
          }
        }
      }
      if (hasFilter) {
        params = params + '&criteria=' + filterCrit
      }
      if (apiUrl.startsWith('@')) {
        api.post(
          apiUrl.substr(1) + params, {},
          (response) => {
            let dataMap = response.data
            this.totalRows[compId] = dataMap.totalRows
            callback(dataMap.list)
          },
          () => {
            this.totalRows[compId] = 0
            callback(empty)
          }
        )
      } else {
        api.get(
          'generic/class/findAllWithTotal/' + apiUrl + params,
          (response) => {
            let dataMap = response.data
            this.totalRows[compId] = dataMap.totalRows
            callback(dataMap.list)
          },
          () => {
            this.totalRows[compId] = 0
            callback(empty)
          }
        )
      }
      // Must return null or undefined to signal b-table that callback is being used
      return null
    },
    rowActionClick (item, index, component, action) {
      this.processAction(action, component, item, index, this.$route.query)
    },
    filterTyped (component) {
      this.$refs[component.id][0].refresh()
    },
    btnClick (action, component) {
      this.processAction(action, component, null, null, this.$route.query)
    },
    processAction (action, component, item, index, urlParam) {
      let mapInject = {data: this.data, item: item, urlParam: urlParam, index: index, component: component, action: action}
      let url = stringInject(action.url, mapInject)
      switch (action.type) {
        case 'getData':
          if (action.method && action.method === 'post') {
            api.post(url, {},
              (response) => {
                for (let key in response.data) {
                  Vue.set(this.data, action.prefix ? action.prefix + '_' + key : key, response.data[key])
                }
              },
              () => { }
            )
          } else {
            api.get(url,
              (response) => {
                for (let key in response.data) {
                  Vue.set(this.data, action.prefix ? action.prefix + '_' + key : key, response.data[key])
                }
              },
              () => { }
            )
          }
          break
        case 'goto':
          this.$router.push({ path: url })
          break
        case 'goback':
          this.$router.go(-1)
          break
        case 'addRow':
          if (this.data[action.model]) {
            let count = this.data[action.model] + 1
            Vue.set(this.data, action.model, count)
          } else {
            Vue.set(this.data, action.model, 1)
          }
          break
        case 'exec':
          if (!action.use_validate) {
            this.execForm(action, component, item, index, urlParam)
          } else {
            this.$validator.validateAll().then((isValid) => {
              if (!isValid) {
                // eslint-disable-next-line
                console.log('Correct them errors!')
                return
              }

              this.execForm(action, component, item, index, urlParam)
            })
          }
          break
      }
    },
    execForm (action, component, item, index, urlParam) {
      let mapInject = {data: this.data, item: item, urlParam: urlParam, index: index, component: component, action: action}
      let url = stringInject(action.url, mapInject)
      let payload = {}
      if (action.data) {
        for (let i = 0; i < action.data.length; i++) {
          let sentKey = action.data[i]
          if (action.unprefix) {
            sentKey = replaceAll(action.unprefix + '_', '', sentKey)
          }
          payload[sentKey] = this.data[action.data[i]]
        }
      } else {
        payload = this.data
      }
      switch (action.method) {
        case 'post':
          api.post(url, payload,
            (response) => {
              if (action.noAlert) {
                if (action.redirect) {
                  this.$router.push({ path: action.redirect })
                } else if (action.goback) {
                  this.$router.go(-1)
                }
                if (component.type === 'table') {
                  this.$refs[component.id][0].refresh()
                }
              } else {
                this.showAlert({
                  alertType: 'info',
                  alertTitle: 'Success',
                  alertMessage: 'Data Successfully Submitted',
                  okCallback: () => {
                    if (action.redirect) {
                      this.$router.push({ path: action.redirect })
                    } else if (action.goback) {
                      this.$router.go(-1)
                    }
                    if (component.type === 'table') {
                      this.$refs[component.id][0].refresh()
                    }
                  }
                })
              }
            },
            () => {
              console.log('ERROR button click' + component.type + '-' + component.text)
            }
          )
          break
        case 'put':
          api.put(url, payload,
            (response) => {
              if (action.noAlert) {
                if (action.redirect) {
                  this.$router.push({ path: action.redirect })
                } else if (action.goback) {
                  this.$router.go(-1)
                }
                if (component.type === 'table') {
                  this.$refs[component.id][0].refresh()
                }
              } else {
                this.showAlert({
                  alertType: 'info',
                  alertTitle: 'Success',
                  alertMessage: 'Data Successfully Submitted',
                  okCallback: () => {
                    if (action.redirect) {
                      this.$router.push({ path: action.redirect })
                    } else if (action.goback) {
                      this.$router.go(-1)
                    }
                    if (component.type === 'table') {
                      this.$refs[component.id][0].refresh()
                    }
                  }
                })
              }
            },
            () => {
              console.log('ERROR button click' + component.type + '-' + component.text)
            }
          )
          break
        case 'get':
          api.get(
            url,
            (response) => {
              if (component.type === 'table') {
                this.$refs[component.id][0].refresh()
              }
            },
            () => {
            }
          )
          break
        case 'delete':
          if (action.noAlert) {
            api.delete(
              url,
              (response) => {
                if (component.type === 'table') {
                  this.$refs[component.id][0].refresh()
                }
              },
              () => {
              }
            )
          } else {
            this.showAlert({
              alertType: 'yesNo',
              alertTitle: 'Are you sure ?',
              alertMessage: 'Once deleted, you will not be able to recover the data',
              okCallback: () => {
                api.delete(
                  url,
                  (response) => {
                    if (component.type === 'table') {
                      this.$refs[component.id][0].refresh()
                    }
                  },
                  () => {
                  }
                )
              }
            })
          }
          break
      }
    },
    dropdownValue (value) {
      if (value !== null && typeof value === 'object' && value._id) {
        if (value._id) return value._id
        else if (value.id) return value.id
        else return value
      } else {
        return value
      }
    },
    dropdownInput (model, component, value) {
      let option = this.options[component.source.model]
      this.dump(option)
      if (option) {
        for (let i = 0; i < option.length; i++) {
          if (option[i].value === value) {
            Vue.set(this.data, model, option[i])
            break
          }
        }
        if (component.refreshId) {
          let comp = this.findRefComponent(component.refreshId)
          if (comp.type === 'map' || comp.type === 'mapLineArray') {
            this.refreshMap(comp)
          }
        }
      }
    },
    checkboxValue (value) {
      return value
    },
    checkboxInput (model, component, value) {
      if (value) Vue.set(this.data, model, value)
    },
    labelValue (component) {
      let result = component.text ? component.text : (component.model ? getObjectFromString(this.data, component.model) : '')
      return result
    },
    switchChanged (action, component, item, itemIndex) {
      this.processAction(action, component, item, itemIndex, this.$route.query)
    },
    getObjectFromString (key, defaultValue) {
      let result = getObjectFromString(this.data, key)
      if (result === null) {
        return defaultValue
      } else if (result instanceof Array) {
        return result.join(', ')
      } else {
        return result
      }
    },
    evaluateString (strStatement, component, data, item, index) {
      // eslint-disable-next-line no-eval
      return eval(strStatement)
    },
    uploadb64 (data, component, dataUri) {
      Vue.set(data, component.model, dataUri)
    },
    stringInjectFunc (str, data) {
      return stringInject(str, data)
    },
    mapPickerClick (model, component) {
      let locationStr = this.data[model]
      let locationPicked = this.stringToLatlng(locationStr)
      let mapComp = this.findRefComponent(component.refreshId)
      let instance = this
      this.selectMapLocation({
        latlng: locationPicked,
        selectLocationCallback: (latlng) => {
          Vue.set(instance.data, model, latlng.lat + ',' + latlng.lng)
          instance.refreshMap(mapComp)
        }
      })
    },
    findRefComponent (id) {
      let refComp = null
      for (let i = 0; i < this.shared.components.length; i++) {
        let compCheck = this.shared.components[i]
        if (compCheck.id === id) {
          refComp = compCheck
          break
        }
      }
      return refComp
    },
    stringToLatlng (locationStr) {
      let locationPicked = null
      if (locationStr && locationStr.length > 0) {
        let locationToken = locationStr.split(',')
        if (locationToken.length === 2) {
          let latConvert = parseFloat(locationToken[0])
          let lngConvert = parseFloat(locationToken[1])
          if (typeof latConvert === 'number' && typeof lngConvert === 'number') {
            locationPicked = {lat: latConvert, lng: lngConvert}
          }
        }
      }
      return locationPicked
    },
    refreshMap (mapComp) {
      let refMap = this.$refs[mapComp.id]
      if (refMap) {
        Object.assign(this.shared.refs, this.$refs)
      } else {
        refMap = this.shared.refs[mapComp.id]
      }
      if (refMap && refMap[0]) {
        let markerList = []
        if (mapComp.type === 'map') {
          markerList.push(this.stringToLatlng(this.data[mapComp.model]))
        } else if (mapComp.type === 'mapArray') {
          for (let idx = 1; idx <= this.data[mapComp.modelCount]; idx++) {
            if (this.data[mapComp.model + '_' + idx]) {
              markerList.push(this.stringToLatlng(this.data[mapComp.model + '_' + idx]))
            }
          }
        } else if (mapComp.type === 'mapLineArray') {
          for (let idx = 1; idx <= this.data[mapComp.modelCount]; idx++) {
            if (this.data[mapComp.modelFrom + '_' + idx]) {
              markerList.push(this.stringToLatlng(this.data[mapComp.modelFrom + '_' + idx].latLng))
            }
            if (this.data[mapComp.modelTo + '_' + idx]) {
              markerList.push(this.stringToLatlng(this.data[mapComp.modelTo + '_' + idx].latLng))
            }
          }
        }
        refMap[0].$mapCreated.then(() => {
          console.log(markerList)
          let bounds = new window.google.maps.LatLngBounds()
          for (let idx = 0; idx < markerList.length; idx++) {
            if (markerList[idx] == null) continue
            var myLatLng = new window.google.maps.LatLng({ lat: markerList[idx].lat, lng: markerList[idx].lng })
            bounds.extend(myLatLng)
          }
          refMap[0].fitBounds(bounds)
          Vue.$gmapDefaultResizeBus.$emit('resize')
        })
      }
    },
    cardToggleClick (component, dataIndex) {
      Vue.set(this.data, component.model + dataIndex, component.value)
    },
    ...mapMutations({
      showAlert: SHOW_ALERT
    }),
    ...mapMutations({
      selectMapLocation: SELECT_LOCATION
    }),
    dump (obj) {
      return obj
    }
  }
}

function orderComponentList (componentList) {
  let result = []
  // group all row component
  let rowMap = {}
  let maxRow = 0
  componentList.sort(function (comp1, comp2) {
    if (!comp1.row && !comp2.row) return -1
    else if (comp1.row && !comp2.row) return -1
    else if (!comp1.row && comp2.row) return 1
    else return comp1.row - comp2.row
  })
  for (let i = 0; i < componentList.length; i++) {
    let component = componentList[i]
    if (!component.row) component.row = maxRow + 1
    if (component.row > maxRow) maxRow = component.row
    if (rowMap[component.row]) {
      rowMap[component.row].push(component)
    } else {
      rowMap[component.row] = [component]
    }
  }
  // sorting each column of row to start from little column number
  for (let row in rowMap) {
    if (rowMap.hasOwnProperty(row)) {
      rowMap[row].sort(function (comp1, comp2) {
        if (!comp1.col && !comp2.col) return -1
        else if (comp1.col && !comp2.col) return -1
        else if (!comp1.col && comp2.col) return 1
        else return comp1.col - comp2.col
      })
      // change rowMap[row] from list of component to list of [component, component,...]
      for (let i = 0; i < rowMap[row].length; i++) {
        let component = rowMap[row][i]
        if (component.type === 'group') {
          component.isGroup = true
          rowMap[row][i] = component
        } else {
          rowMap[row][i] = { isGroup: false, ifCondition: component.ifCondition, col: component.col, width: component.width, row: component.row, offset: component.offset, align: component.align, noPadding: component.noPadding, content: [component] }
        }
      }
    }
  }
  for (let i = 0; i <= maxRow; i++) {
    if (rowMap.hasOwnProperty(i)) {
      result.push(rowMap[i])
    }
  }
  return result
}

function stringInject (str, data) {
  if (typeof str === 'string' && (data instanceof Array)) {
    return str.replace(/({\d})/g, function (i) {
      return data[i.replace(/{/, '').replace(/}/, '')]
    })
  } else if (typeof str === 'string' && (data instanceof Object)) {
    for (let key in data) {
      return str.replace(/({([^}]+)})/g, function (i) {
        let key = i.replace(/{/, '').replace(/}/, '')
        let result = getObjectFromString(data, key)
        if (result === null) {
          return i
        }
        return result
      })
    }
  } else {
    return false
  }
}

function getObjectFromString (data, key) {
  let tokenArr = key.split('.')
  let result = null
  for (let i = 0; i < tokenArr.length; i++) {
    let token = tokenArr[i]
    if (result === null) {
      if (data.hasOwnProperty(token)) {
        result = data[token]
      } else {
        break
      }
    } else if (result.hasOwnProperty(token)) {
      result = result[token]
    } else {
      break
    }
  }
  return result
}

function escapeRegExp (str) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')
}

function replaceAll (find, replace, str) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace)
}

function guid () {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}
</script>

<style lang="css">
  .table {display: table;}

  .table-cell {
      display: table-cell;
  }

  .vertical-align {
    vertical-align: middle;
  }

  .row-action-button {
    margin-right: 5px;
  }

  .mx-datepicker-popup {
    left: 0!important;
  }

  .full-width {
    width: 100%;
  }

  .align-center {
    text-align: center;
  }

  .align-right {
    text-align: right;
  }

  .align-left {
    text-align: left;
  }
</style>
