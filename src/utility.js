import { UPDATE_DATA, SHOW_ALERT, REFRESH_COMPONENT } from './store/mutation-types'
import moment from 'moment'
import api from './api/common'

export default {
  install: function (Vue) {
    Object.defineProperty(Vue.prototype, '$util', { value: {stringInject, getObjectFromString, uuid, evaluateString, processAction, datetimeToString} })
  }
}

function processAction (instance, action, component, item, index, urlParam) {
  let data = instance.$store.state.generic.data
  let mapInject = {data: data, item: item, urlParam: urlParam, index: index, component: component, action: action}
  let url = stringInject(action.url, mapInject)
  switch (action.type) {
    case 'refreshTable':
      instance.$store.commit(REFRESH_COMPONENT, {id: action.componentId})
      break
    case 'getData':
      if (action.method && action.method === 'post') {
        api.post(url, {},
          (response) => {
            for (let key in response.data) {
              if (action.prefix) {
                instance.$store.commit(UPDATE_DATA, {key: action.prefix + '_' + key, value: response.data[key]})
              } else {
                instance.$store.commit(UPDATE_DATA, {key: key, value: response.data[key]})
              }
            }
          },
          () => { }
        )
      } else {
        api.get(url,
          (response) => {
            for (let key in response.data) {
              if (action.prefix) {
                instance.$store.commit(UPDATE_DATA, {key: action.prefix + '_' + key, value: response.data[key]})
              } else {
                instance.$store.commit(UPDATE_DATA, {key: key, value: response.data[key]})
              }
            }
          },
          () => { }
        )
      }
      break
    case 'goto':
      instance.$router.push({ path: url })
      break
    case 'goback':
      instance.$router.go(-1)
      break
    case 'addRow':
      if (data[action.model]) {
        let count = data[action.model] + 1
        instance.$store.commit(UPDATE_DATA, {key: action.model, value: count})
      } else {
        instance.$store.commit(UPDATE_DATA, {key: action.model, value: 1})
      }
      break
    case 'exec':
      if (!action.use_validate) {
        execForm(instance, action, component, item, index, urlParam)
      } else {
        instance.$validator.validateAll().then((isValid) => {
          if (!isValid) {
            // eslint-disable-next-line
            console.log('Correct them errors!')
            return
          }
          execForm(instance, action, component, item, index, urlParam)
        })
      }
      break
  }
}

function execForm (instance, action, component, item, index, urlParam) {
  let data = instance.$store.state.generic.data
  let mapInject = {data: data, item: item, urlParam: urlParam, index: index, component: component, action: action}
  let url = stringInject(action.url, mapInject)
  let payload = {}
  if (action.data) {
    for (let i = 0; i < action.data.length; i++) {
      let sentKey = action.data[i]
      if (action.unprefix) {
        sentKey = replaceAll(action.unprefix + '_', '', sentKey)
      }
      payload[sentKey] = data[action.data[i]]
    }
  } else {
    payload = data
  }
  switch (action.method) {
    case 'post':
      api.post(url, payload,
        (response) => {
          if (action.noAlert) {
            if (action.redirect) {
              instance.$router.push({ path: action.redirect })
            } else if (action.goback) {
              instance.$router.go(-1)
            }
            if (component.type === 'a-table') {
              instance.$store.commit(REFRESH_COMPONENT, {id: component.id})
            }
          } else {
            instance.$store.commit(SHOW_ALERT, {
              alertType: 'info',
              alertTitle: 'Success',
              alertMessage: 'Data Successfully Submitted',
              okCallback: () => {
                if (action.redirect) {
                  instance.$router.push({ path: action.redirect })
                } else if (action.goback) {
                  instance.$router.go(-1)
                }
                if (component.type === 'a-table') {
                  instance.$store.commit(REFRESH_COMPONENT, {id: component.id})
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
              instance.$router.push({ path: action.redirect })
            } else if (action.goback) {
              instance.$router.go(-1)
            }
            if (component.type === 'a-table') {
              instance.$store.commit(REFRESH_COMPONENT, {id: component.id})
            }
          } else {
            instance.$store.commit(SHOW_ALERT, {
              alertType: 'info',
              alertTitle: 'Success',
              alertMessage: 'Data Successfully Submitted',
              okCallback: () => {
                if (action.redirect) {
                  instance.$router.push({ path: action.redirect })
                } else if (action.goback) {
                  instance.$router.go(-1)
                }
                if (component.type === 'a-table') {
                  instance.$store.commit(REFRESH_COMPONENT, {id: component.id})
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
          if (component.type === 'a-table') {
            instance.$store.commit(REFRESH_COMPONENT, {id: component.id})
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
            if (component.type === 'a-table') {
              instance.$store.commit(REFRESH_COMPONENT, {id: component.id})
            }
          },
          () => {
          }
        )
      } else {
        instance.$store.commit(SHOW_ALERT, {
          alertType: 'yesNo',
          alertTitle: 'Are you sure ?',
          alertMessage: 'Once deleted, you will not be able to recover the data',
          okCallback: () => {
            api.delete(
              url,
              (response) => {
                if (component.type === 'a-table') {
                  instance.$store.commit(REFRESH_COMPONENT, {id: component.id})
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
}

function datetimeToString (datetime, formatParam) {
  let format = 'YYYY-MM-DD h:mm:ss'
  if (formatParam) format = formatParam
  let utcTime = moment.utc(datetime, 'x')
  // momentjs is mutable, doing moment.utc(value, 'x').local() will change all
  let localTime = moment(utcTime).local()
  return localTime.format(format)
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

function uuid () {
  var d = new Date().getTime()
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now() // use high-precision timer if available
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

function evaluateString (strStatement, component, data, item, index) {
  // eslint-disable-next-line no-eval
  return eval(strStatement)
}

function escapeRegExp (str) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')
}

function replaceAll (find, replace, str) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace)
}
