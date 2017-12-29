import { formatFileSize, isDefinedGlobally } from './utils'
import Vue from 'vue'

const messages = {
  _default: (field) => Vue.i18n.translate('veeValidate_default', {'field': field}),
  after: (field, [target, inclusion]) => {
    if (inclusion) {
      return Vue.i18n.translate('veeValidate_after_equal', {'field': field, 'target': target})
    }

    return Vue.i18n.translate('veeValidate_after', {'field': field, 'target': target})
  },
  alpha_dash: (field) => Vue.i18n.translate('veeValidate_alpha_dash', {'field': field}),
  alpha_num: (field) => Vue.i18n.translate('veeValidate_alpha_num', {'field': field}),
  alpha_spaces: (field) => Vue.i18n.translate('veeValidate_alpha_spaces', {'field': field}),
  alpha: (field) => Vue.i18n.translate('veeValidate_alpha', {'field': field}),
  before: (field, [target, inclusion]) => {
    if (inclusion) {
      return Vue.i18n.translate('veeValidate_before_equal', {'field': field, 'target': target})
    }

    return Vue.i18n.translate('veeValidate_before', {'field': field, 'target': target})
  },
  between: (field, [min, max]) => Vue.i18n.translate('veeValidate_between', {'field': field, 'min': min, 'max': max}),
  confirmed: (field, [confirmedField]) => Vue.i18n.translate('veeValidate_confirmed', {'field': field, 'confirmedField': confirmedField}),
  credit_card: (field) => Vue.i18n.translate('veeValidate_credit_card', {'field': field}),
  date_between: (field, [min, max]) => Vue.i18n.translate('veeValidate_date_between', {'field': field, 'min': min, 'max': max}),
  date_format: (field, [format]) => Vue.i18n.translate('veeValidate_date_format', {'field': field, 'format': format}),
  decimal: (field, [decimals = '*'] = []) => Vue.i18n.translate('veeValidate_decimal', {'field': field, 'decimals': !decimals || decimals === '*' ? '' : decimals}),
  digits: (field, [length]) => Vue.i18n.translate('veeValidate_digits', {'field': field, 'length': length}),
  dimensions: (field, [width, height]) => Vue.i18n.translate('veeValidate_dimensions', {'field': field, 'width': width, 'height': height}),
  email: (field) => Vue.i18n.translate('veeValidate_email', {'field': field}),
  ext: (field) => Vue.i18n.translate('veeValidate_ext', {'field': field}),
  image: (field) => Vue.i18n.translate('veeValidate_image', {'field': field}),
  in: (field) => Vue.i18n.translate('veeValidate_in', {'field': field}),
  integer: (field) => Vue.i18n.translate('veeValidate_integer', {'field': field}),
  ip: (field) => Vue.i18n.translate('veeValidate_ip', {'field': field}),
  length: (field, [length, max]) => {
    if (max) {
      return Vue.i18n.translate('veeValidate_length_max', {'field': field, 'length': length, 'max': max})
    }

    return Vue.i18n.translate('veeValidate_length', {'field': field, 'length': length})
  },
  max: (field, [length]) => Vue.i18n.translate('veeValidate_max', {'field': field, 'length': length}),
  max_value: (field, [size]) => Vue.i18n.translate('veeValidate_max_value', {'field': field, 'size': size}),
  mimes: (field) => Vue.i18n.translate('veeValidate_mimes', {'field': field}),
  min: (field, [length]) => Vue.i18n.translate('veeValidate_min', {'field': field, 'length': length}),
  min_value: (field, [size]) => Vue.i18n.translate('veeValidate_min_value', {'field': field, 'size': size}),
  not_in: (field) => Vue.i18n.translate('veeValidate_not_in', {'field': field}),
  numeric: (field) => {
    return Vue.i18n.translate('veeValidate_numeric', {'field': field})
  },
  regex: (field) => Vue.i18n.translate('veeValidate_regex', {'field': field}),
  required: (field) => Vue.i18n.translate('veeValidate_required', {'field': field}),
  size: (field, [size]) => Vue.i18n.translate('veeValidate_size', {'field': field, 'size': formatFileSize(size)}),
  url: (field) => Vue.i18n.translate('veeValidate_url', {'field': field})
}

const locale = {
  name: 'en',
  messages,
  attributes: {}
}

if (isDefinedGlobally()) {
  // eslint-disable-next-line
  VeeValidate.Validator.localize({ [locale.name]: locale })
}

export default locale
