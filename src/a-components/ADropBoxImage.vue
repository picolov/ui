<template>
  <div class="dropbox">
    <div class="dropbox-placeholder">
      <div class="upload-area" :style="{ 'display': isInitial ? 'block' : 'none' }">
        <input type="file" :id="uploadFieldName" :name="uploadFieldName" @change="filesChange($event.target.name, $event)" accept="image/*" class="input-file">
        <img class="input-button" src="static/img/icons/plus-button.png"/>
      </div>
      <div>
        <img v-if="!isInitial && uploadedFile" :src="uploadedFile.url" :alt="uploadedFile.originalName">
        <div v-if="isSaving">
        <b-progress :value="uploadProgress" class="w-50" style="margin: auto;"></b-progress>
          <p>
            <a href="javascript:void(0)">
              <small>Uploading file...</small>
            </a>
          </p>
        </div>
        <p v-if="isSuccess">
          <a href="javascript:void(0)">
            <label :for="uploadFieldName"><small>Change image</small></label>
          </a>
        </p>
        <p v-if="isFailed">
          <a href="javascript:void(0)" @click="retry()">
            Error {{uploadError}}, Try again
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../api/common'

const STATUS_INITIAL = 0
const STATUS_SAVING = 1
const STATUS_SUCCESS = 2
const STATUS_FAILED = 3

export default {
  name: 'a-dropBoxImage',
  props: {
    attr: {
      type: Object,
      required: true,
      default: () => {}
    },
    arraySequence: {
      type: String,
      required: false,
      default: () => ''
    },
    dataId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      uploadedFile: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: 'file',
      uploadProgress: 75
    }
  },
  computed: {
    isInitial () {
      return this.currentStatus === STATUS_INITIAL
    },
    isSaving () {
      return this.currentStatus === STATUS_SAVING
    },
    isSuccess () {
      return this.currentStatus === STATUS_SUCCESS
    },
    isFailed () {
      return this.currentStatus === STATUS_FAILED
    }
  },
  methods: {
    reset () {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL
      this.uploadedFile = null
      this.uploadError = null
    },
    upload (formData) {
      // upload data to the server
      this.currentStatus = STATUS_SAVING
      var config = {
        onUploadProgress: function (progressEvent) {
          this.uploadProgress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        }
      }

      api.upload('/generic/file/upload', formData, config,
        (response) => {
          // this.uploadedFiles = [].concat(response)
          this.currentStatus = STATUS_SUCCESS
        },
        (err) => {
          this.uploadError = err.response
          this.currentStatus = STATUS_FAILED
        }
      )
    },
    dummyUpload (formData) {
      this.currentStatus = STATUS_SAVING
      setTimeout(
        () => { this.currentStatus = STATUS_SUCCESS }
        , 1500)
    },
    previewImage (fileData) {
      this.getImage(fileData)
        .then((img) => {
          this.uploadedFile = {
            id: img,
            originalName: fileData.name,
            fileName: fileData.name,
            url: img.src
          }
        })
    },
    getImage (file) {
      return new Promise((resolve, reject) => {
        const fReader = new FileReader()
        const img = document.createElement('img')

        fReader.onload = () => {
          img.src = fReader.result
          resolve(img)
        }

        fReader.readAsDataURL(file)
      })
    },
    wait (ms) {
      return (x) => {
        return new Promise(resolve => setTimeout(() => resolve(x), ms))
      }
    },
    filesChange (fieldName, e) {
      var fileList = e.target.files || e.dataTransfer.files
      if (!fileList.length) return

      this.reset()

      let fileData = fileList[0]

      // preview it
      this.previewImage(fileData)

      // save it
      // this.dummyUpload(fileData)
      // handle file changes
      const formData = new FormData()

      if (!fileList.length) return

      // append the files to FormData
      Array
        .from(Array(fileList.length).keys())
        .map(x => {
          formData.append(fieldName, fileList[x], fileList[x].name)
        })
      this.upload(formData)
    }
  },
  mounted () {
    this.reset()
  }
}
</script>

<style lang="scss">
  .dropbox {
    min-height: 150px; /* minimum height */
    position: relative;
  }

  .dropbox .upload-area{
    border:1px solid #e7e7e7;
    border-radius: 4px;
    color: dimgray;
  }

  .dropbox .upload-area:hover {
    background: #f9f9f9; /* when mouse over to the drop zone, change color */
  }

  .dropbox .dropbox-placeholder {
    font-size: 1.2em;
    text-align: center;
  }
  
  .dropbox .dropbox-placeholder img {
    max-width: 100%;
    min-height: 100px;
  }
  
  .dropbox .dropbox-placeholder img.input-button {
    padding: 50px 0;
  }
  
  .dropbox .dropbox-placeholder label {
    cursor: pointer;
  }

  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 100%;
    position: absolute;
    cursor: pointer;
    left: 0;
    top: 0;
  }
</style>