<template>
  <div class="a-autocomplete">
    <i class="fa fa-spinner fa-spin" v-if="isLoading"></i>
    <template v-else>
      <i class="fa fa-search" v-show="isEmpty"></i>
      <i class="fa fa-times" v-show="isDirty" @click="reset"></i>
    </template>

    <input 
      :id="attr.id + '-autocomplete-control'"
      type="text"
      class="a-autocomplete__input form-control"
      :style="attr.style"
      :placeholder="attr.placeholder"
      v-model="query"
      :state="errors.has(attr.model + arraySequence) ? false : null"

      autocomplete="off"
      @keydown.down="down"
      @keydown.up="up"
      @keydown.enter="hit"
      @keydown.esc="reset"
      @blur="onBlur"
      @keyup="onKeyUp"/>

    <input
      :id="attr.id"
      type="hidden"
      :name="attr.model + arraySequence"
      v-model="data"
      v-validate="!attr.validation ? '' : attr.validation.join('|')"
      :data-vv-as="attr.label | translate"/>
      
    <b-form-invalid-feedback v-if="attr.validation" tag="span" :force-show="errors.has(attr.model+arraySequence)">
      {{ errors.first(attr.model + arraySequence) }}
    </b-form-invalid-feedback>

    <ul v-show="showList">
      <li v-for="(item, index) in items" :class="activeClass(index)" @mousedown="hit" @mousemove="setActive(index)" :key="index">
        <span class="name" v-text="item[attr.displayKey]"></span>
        <span class="screen-name" v-text="item[attr.subDisplayKey]"></span>
      </li>
    </ul>
  </div>
</template>

<script>
// import { mapState, mapMutations } from 'vuex'
import { UPDATE_DATA, UPDATE_COMPONENT } from '../store/mutation-types'
import api from '../api/common'

export default {
  name: 'a-autocomplete',
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
      // indicate the highlighted item on list
      current: -1,
      // Highlight the first item in the list after search
      selectFirst: false,
      // indicate isLoading on progress
      isLoading: false,
      // indicate the list has been selected after search
      onSearch: false,
      // items that will be displayed on list
      items: [],
      // The body data that would be sent by request (if method post)
      preparedBody: {},
      // Limit the number of items which is shown at the list
      limit: 5,
      // Init a timeout variable to be used below
      timeout: null,
      // The minimum character length needed before triggering
      minChars: 3,
      // Override the default value (`q`) of query parameter name
      // Use a falsy value for RESTful query
      queryParamName: 'q',
      // Use for input autocomplete
      query: ''
    }
  },
  computed: {
    showList () {
      return this.items.length > 0 && !this.isLoading && this.onSearch
    },

    isEmpty () {
      return !this.query
    },

    isDirty () {
      return !!this.query
    },

    data: {
      get () {
        if (this.attr.filterKey && this.attr.filterComponentId) {
          return this.filterStr
        } else {
          return this.$store.state.generic.data[this.dataId][this.attr.model + this.arraySequence]
        }
      },
      set (value) {
        if (this.attr.filterKey && this.attr.filterComponentId) {
          this.$store.commit(UPDATE_COMPONENT, {id: this.attr.filterComponentId, attr: 'filter', key: this.attr.filterKey, value: value})
          this.filterStr = value
        } else {
          this.$store.commit(UPDATE_DATA, {id: this.dataId, key: this.attr.model + this.arraySequence, value: value})
        }
      }
    }
  },
  mounted () {
  },
  methods: {
    onKeyUp () {
      this.onSearch = true

      if (!this.query) {
        return this.reset()
      }

      if (this.minChars && this.query.length < this.minChars) {
        return
      }

      this.isLoading = true

      // Clear the timeout if it has already been set.
      // This will prevent the previous task from executing
      // if it has been less than <MILLISECONDS>
      clearTimeout(this.timeout)

      // Make a new timeout set to go off in 1000ms
      this.timeout = setTimeout(() => { this.fetch() }, 1000)
    },

    fetch () {
      if (!this.attr.src) {
        return console.log('the `url` of Autocomplete needed to be set')
      }

      this.cancel()

      let request = null

      if (!this.attr.method || this.attr.method === 'get') {
        if (!this.attr.src.includes('?')) { this.attr.src = this.attr.src + '?' }
        const src = this.queryParamName ? this.attr.src + '&' + this.queryParamName + '=' + this.query : this.attr.src
        request = api.get(src, (response) => {
          if (response && this.query) {
            let list = this.prepareResponseData ? this.prepareResponseData(response) : response
            this.items = this.limit ? list.slice(0, this.limit) : list
            this.current = -1
            this.isLoading = false

            if (this.selectFirst) {
              this.down()
            }
          }
        }, (err) => {
          console.log('error: ', err.message)
        })
      } else if (this.attr.method === 'post') {
        const params = this.queryParamName
          ? Object.assign({ [this.queryParamName]: this.query }, this.preparedBody)
          : this.preparedBody
        request = api.post(this.attr.src, params, (response) => {
          if (response && this.query) {
            let list = this.prepareResponseData ? this.prepareResponseData(response) : response
            this.items = this.limit ? list.slice(0, this.limit) : list
            this.current = -1
            this.isLoading = false

            if (this.selectFirst) {
              this.down()
            }
          }
        }, (err) => {
          console.log('error: ', err.message)
        })
      } else {
        return console.log('the method must be get or post')
      }

      this.cancel = () => { api.cancel(request.source) }
    },

    cancel () {
      // used to 'cancel' previous searches
    },

    // reset the search
    reset () {
      this.items = []
      this.query = ''
      this.data = null
      this.isLoading = false
    },

    // set active for class use
    setActive (index) {
      this.current = index
    },

    // check active
    activeClass (index) {
      return {
        active: this.current === index
      }
    },

    onBlur () {
      this.onSearch = false
      if (this.data) {
        this.query = this.data[this.attr.displayKey]
      } else {
        this.reset()
      }
    },

    // The callback function which is triggered when the user hits on an item
    onHit (item) {
      this.onSearch = false
      this.data = item
      this.query = item[this.attr.displayKey]
    },

    hit () {
      if (this.current !== -1) {
        this.onHit(this.items[this.current])
      }
    },

    up () {
      if (this.current > 0) {
        this.current--
      } else if (this.current === -1) {
        this.current = this.items.length - 1
      } else {
        this.current = -1
      }
    },

    down () {
      if (this.current < this.items.length - 1) {
        this.current++
      } else {
        this.current = -1
      }
    },

    // The callback function which is triggered when the response data are received
    prepareResponseData (response) {
      return response.data.list
    }
  }
}
</script>

<style lang="scss" scoped>
.a-autocomplete {
  position: relative;
}

.a-autocomplete__input {
  width: 100%;
  /* font-size: 14px; 
  color: #2c3e50;
  line-height: 1.42857143;
  box-shadow: inset 0 1px 4px rgba(0,0,0,.4);
  -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
  transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
  font-weight: 300;
  padding: 12px 26px;
  border: none;
  border-radius: 22px;
  letter-spacing: 1px;*/
  box-sizing: border-box;
}
/*
.a-autocomplete__input:focus {
  border-color: #4fc08d;
  outline: 0;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px #4fc08d;
}
*/
.fa-times {
  cursor: pointer;
}

i {
  float: right;
  position: relative;
  top: 1.7rem;
  right: 1rem;
  opacity: 0.4;
}

ul {
  position: absolute;
  padding: 0;
  margin-top: 8px;
  min-width: 100%;
  background-color: #fff;
  list-style: none;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0,0,0, 0.25);
  z-index: 1000;
  text-align: left;
}

li {
  padding: 10px 16px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}

li:first-child {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

li:last-child {
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom: 0;
}

span {
  display: block;
  color: #2c3e50;
}

.active {
  background-color: #3aa373;
}

.active span {
  color: white;
}

.name {
  font-weight: 700;
  font-size: 18px;
}

.screen-name {
  font-style: italic;
  line-height: 1.3;
}
</style>

