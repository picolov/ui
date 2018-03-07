<template>
    <div class="vue-base64-file-upload" :id="attr.id">
        <img v-show="previewImage && attr.showPreview" :src="previewImage" />
        <div class="vue-base64-file-upload-wrapper" :style="wrapperStyles">
            <input type="file" @change="onChange" :style="fileInputStyles" :accept="'image/png,image/gif,image/jpeg'" />
            <b-btn :style="btnStyles">{{attr.label||'Select File'}}</b-btn>
        </div>
    </div>
</template>

<script>
import { UPDATE_DATA } from '../store/mutation-types'

export default {
  name: 'a-fileUploadBase64',
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
  data: function data () {
    return {
      file: null,
      preview: null
    }
  },
  computed: {
    data: {
      get () {
        return this.$store.state.generic.data[this.dataId][this.attr.model + this.arraySequence]
      },
      set (value) {
        this.$store.commit(UPDATE_DATA, {id: this.dataId, key: this.attr.model + this.arraySequence, value: value})
      }
    },
    wrapperStyles: function wrapperStyles () {
      return {
        'position': 'relative',
        'width': '100%'
      }
    },
    fileInputStyles: function fileInputStyles () {
      return {
        'width': '100%',
        'position': 'absolute',
        'top': 0,
        'left': 0,
        'right': 0,
        'bottom': 0,
        'opacity': 0,
        'overflow': 'hidden',
        'outline': 'none',
        'cursor': 'pointer'
      }
    },
    btnStyles: function btnStyles () {
      return {
        'width': '100%',
        'cursor': 'pointer'
      }
    },
    previewImage: function previewImage () {
      return this.preview || this.attr.defaultPreview
    }
  },
  methods: {
    onChange: function onChange (e) {
      var _this = this

      var files = e.target.files || e.dataTransfer.files

      if (!files.length) {
        return
      }

      var file = files[0]
      var size = file.size && file.size / Math.pow(1000, 2)

      // check file max size
      let maxSize = 10
      if (this.attr.maxSize) maxSize = this.attr.maxSize
      if (size > maxSize) {
        this.$emit('size-exceeded', size)
        return
      }

      // update file
      this.file = file
      this.$emit('file', file)

      var reader = new FileReader()

      reader.onload = function (e) {
        var dataURI = e.target.result

        if (dataURI) {
          _this.$emit('load', dataURI)
          _this.data = dataURI
          _this.preview = dataURI
        }
      }
      // read blob url from file data
      reader.readAsDataURL(file)
    }
  }
}
</script>
