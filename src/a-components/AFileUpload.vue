<template>
    <b-card>
        <b-media no-body>
            <b-media-aside vertical-align="center">
                <i slot="aside" :class="[fileIcon]" style="font-size:60px"/>
            </b-media-aside>
            <b-media-body class="ml-3" style="padding-top: 6px">
                <div>{{file.fileName}}</div>
                 <i class="fa fa-upload"/>
                    <input class="fileuploadInput" type="file" @change="onChange" />
                    <b-link class="uploadLabel"><u><b>{{'general-uploadFile' | translate}}</b></u></b-link><br>
                  <i class="fa fa-download" v-if="data && data.id && data.extension"/>
                  <b-link v-if="data && data.id && data.extension" class="downloadLabel" :href="fileLink"><u><b>{{'general-downloadOriginalFile' | translate}}</b></u></b-link>
            </b-media-body>
        </b-media>
    </b-card>
</template>

<script>
import { UPDATE_DATA } from '../store/mutation-types'
import * as config from '../config'

export default {
  name: 'a-fileUpload',
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
      file: {
        fileName: '<uploaded-file name>',
        icon: 'fa fa-file-o',
        extension: 'none'
      }
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
    fileLink () {
      let fileLink = '#'
      if (this.data && this.data.id && this.data.extension) {
        fileLink = config.BASE_URL + config.FILE_VIEW_PATH + this.data.id + '.' + this.data.extension
      }
      return fileLink
    },
    fileIcon () {
      let icon = 'fa fa-file-o'
      switch (this.file.extension) {
        case 'image/jpeg':
        case 'image/png':
        case 'image/gif':
        case 'image/bitmap':
        case 'jpg':
        case 'png':
        case 'gif':
        case 'bmp':
          icon = 'fa fa-file-image-o'
          break
        case 'application/pdf':
        case 'pdf':
          icon = 'fa fa-file-pdf-o'
          break
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        case 'doc':
        case 'docx':
          icon = 'fa fa-file-word-o'
          break
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        case 'xls':
        case 'xlsx':
          icon = 'fa fa-file-excel-o'
          break
        case 'text/plain':
        case 'txt':
          icon = 'fa fa-file-text-o'
          break
        default:
          icon = 'fa fa-file-o'
      }
      return icon
    }
  },
  mounted () {
    if (this.data) {
      console.log(this.data)
      if (this.data.fileName) this.file.fileName = this.data.fileName
      if (this.data.extension) this.file.extension = this.data.extension
    }
  },
  methods: {
    getObjectFromString (key, defaultValue) {
      let result = this.$util.getObjectFromString(this.$store.state.generic.data[this.dataId], key)
      if (result === null) {
        return defaultValue
      } else if (result instanceof Array) {
        return result.join(', ')
      } else {
        return result
      }
    },
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
      this.file.fileName = file.name
      this.file.extension = file.type
      this.$emit('file', file)

      var reader = new FileReader()

      reader.onload = function (e) {
        var dataURI = e.target.result

        if (dataURI) {
          _this.$emit('load', dataURI)
          _this.data = {fileName: file.fileName, size: file.size, extension: file.extension, data: dataURI}
        }
      }
      // read blob url from file data
      reader.readAsDataURL(file)
    }
  }
}
</script>

<style lang="scss">
.fileuploadInput {
  position: absolute;
  margin: 0;
  width: 120px;
  opacity: 0.0;
  filter: alpha(opacity=0);
  cursor: pointer;
}
.uploadLabel {
  
}
</style>

