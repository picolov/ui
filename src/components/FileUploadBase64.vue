<template>
    <div class="vue-base64-file-upload">
        <img v-show="previewImage && !disablePreview" :src="previewImage" :class="imageClass" />
        <div class="vue-base64-file-upload-wrapper" :style="wrapperStyles">
            <input type="file" @change="onChange" :style="fileInputStyles" :accept="accept" />
            <b-btn :class="btnClass" :style="btnStyles">{{placeholder}}</b-btn>
        </div>
    </div>
</template>

<script>
export default {
  name: 'generic-filebase64',
  props: {
    imageClass: {
      type: String,
      default: ''
    },
    btnClass: {
      type: String,
      default: ''
    },
    accept: {
      type: String,
      default: 'image/png,image/gif,image/jpeg'
    },
    maxSize: {
      type: Number,
      default: 10 // megabytes
    },
    disablePreview: {
      type: Boolean,
      default: false
    },
    fileName: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Click here to upload image'
    },
    defaultPreview: {
      type: String,
      default: ''
    }
  },
  data: function data () {
    return {
      file: null,
      preview: null,
      visiblePreview: false
    }
  },
  computed: {
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
      return this.preview || this.defaultPreview
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
      if (size > this.maxSize) {
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
          _this.preview = dataURI
        }
      }
      // read blob url from file data
      reader.readAsDataURL(file)
    }
  }
}
</script>
