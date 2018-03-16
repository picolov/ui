<template>
    <b-card>
        <b-media no-body>
            <b-media-aside vertical-align="center">
                <i slot="aside" :class="[fileIcon]" style="font-size:60px"/>
            </b-media-aside>
            <b-media-body class="ml-3" style="padding-top: 6px">
                <div>{{data.fileName}}</div>
                 <i class="fa fa-download"/>
                    <b-link class="downloadLabel" :href="fileLink"><u><b>{{'general-downloadFile' | translate}}</b></u></b-link>
            </b-media-body>
        </b-media>
    </b-card>
</template>

<script>
import { UPDATE_DATA } from '../store/mutation-types'
import * as config from '../config'

export default {
  name: 'a-fileDownload',
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
      switch (this.data.extension) {
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
    }
  }
}
</script>

<style lang="scss">
.downloadLabel {
  
}
</style>

