import { UPDATE_DATA, SHOW_ALERT, REFRESH_COMPONENT } from './store/mutation-types'
import moment from 'moment'
import api from './api/common'

export default {
  install: function (Vue) {
    Object.defineProperty(Vue.prototype, '$util', { value: {stringInject, getObjectOrDefault, getObjectFromString, orderComponentList, uuid, evaluateString, processAction, datetimeToString, moneyFormat} })
  }
}

function processAction (instance, action, component, item, index, urlParam) {
  if (action.showLoading) { instance.$bus.$emit('show-full-loading', { key: 'fetchLayout' }) }
  let data = instance.$store.state.generic.data
  let mapInject = {data: data, item: item, urlParam: urlParam, index: index, component: component, action: action}
  let url = stringInject(action.url, mapInject)
  switch (action.type) {
    case 'refreshTable':
      instance.$store.commit(REFRESH_COMPONENT, {id: action.componentId})
      if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
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
            if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
          },
          () => { if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) } }
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
            if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
          },
          () => { if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) } }
        )
      }
      break
    case 'goto':
      instance.$router.push({ path: url })
      if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
      break
    case 'goback':
      instance.$router.go(-1)
      if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
      break
    case 'addRow':
      if (data[action.model]) {
        let count = data[action.model] + 1
        instance.$store.commit(UPDATE_DATA, {key: action.model, value: count})
      } else {
        instance.$store.commit(UPDATE_DATA, {key: action.model, value: 1})
      }
      if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
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
          if (action.model) {
            if (action.model === 'root' || action.model === '') {
              for (let key in response.data) {
                if (action.prefix) {
                  instance.$store.commit(UPDATE_DATA, {key: action.prefix + '_' + key, value: response.data[key]})
                } else {
                  instance.$store.commit(UPDATE_DATA, {key: key, value: response.data[key]})
                }
              }
            } else {
              instance.$store.commit(UPDATE_DATA, {key: action.model, value: response.data})
            }
          }
          if (action.noAlert) {
            if (action.redirect) {
              instance.$router.push({ path: action.redirect })
            } else if (action.goback) {
              instance.$router.go(-1)
            }
            if (component.type === 'a-table') {
              instance.$store.commit(REFRESH_COMPONENT, {id: component.id})
            }
            if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
          } else {
            if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
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
          if (action.refreshId) {
            instance.$store.commit(REFRESH_COMPONENT, {id: action.refreshId})
          }
        },
        () => {
          console.log('ERROR button click' + component.type + '-' + component.text)
          if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
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
            if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
          } else {
            if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
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
          if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
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
          if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
        },
        () => { if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) } }
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
            if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
          },
          () => { if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) } }
        )
      } else {
        if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
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
      let params = i.replace(/{/, '').replace(/}/, '')
      let paramArray = params.split(';')
      if (paramArray.length === 1) {
        return data[paramArray[0]]
      } else if (paramArray.length === 2) {
        let statement = paramArray[1]
        let value = data[paramArray[0]]
        if (typeof value === 'string' || value instanceof String) {
          statement = replaceAll('#', '"' + value + '"', statement)
        } else {
          statement = replaceAll('#', value, statement)
        }
        return evaluateString(statement, null, null, null)
      } else {
        return i
      }
    })
  } else if (typeof str === 'string' && (data instanceof Object)) {
    for (let key in data) {
      return str.replace(/({([^}]+)})/g, function (i) {
        let params = i.replace(/{/, '').replace(/}/, '')
        let paramArray = params.split(';')
        if (paramArray.length === 1) {
          return getObjectFromString(data, paramArray[0])
        } else if (paramArray.length === 2) {
          let statement = paramArray[1]
          let value = getObjectFromString(data, paramArray[0])
          if (typeof value === 'string' || value instanceof String) {
            statement = replaceAll('#', '"' + value + '"', statement)
          } else {
            statement = replaceAll('#', value, statement)
          }
          return evaluateString(statement, null, null, null)
        } else {
          return i
        }
      })
    }
  } else {
    return false
  }
}

function orderComponentList (componentList) {
  let result = []
  // group all row component
  let rowMap = {}
  let maxRow = 0
  componentList.sort(function (comp1, comp2) {
    if (!comp1.row && !comp2.row) return 1
    else if (comp1.row && !comp2.row) return 1
    else if (!comp1.row && comp2.row) return -1
    else return comp1.row - comp2.row
  })
  for (let i = 0; i < componentList.length; i++) {
    let component = componentList[i]
    if (component.row == null) component.row = maxRow + 1
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
        if (!comp1.col && !comp2.col) return 1
        else if (comp1.col && !comp2.col) return 1
        else if (!comp1.col && comp2.col) return -1
        else return comp1.col - comp2.col
      })
      let maxCol = 1
      for (let i = 0; i < rowMap[row].length; i++) {
        let component = rowMap[row][i]
        if (component.col > maxCol) {
          component.offset = component.col - maxCol
        } else {
          maxCol += component.width
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

function getObjectOrDefault (data, key, defaultValue) {
  let result = getObjectFromString(data, key)
  if (result === null) {
    return defaultValue
  } else if (result instanceof Array) {
    if (result[0] && (typeof result[0] === 'string' || result[0] instanceof String)) {
      return result.join(', ')
    } else {
      return result
    }
  } else {
    return result
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

function evaluateString (strStatement, component, item, index) {
  // eslint-disable-next-line no-unused-vars
  let data = []
  if (this && this.$store != null) {
    data = this.$store.state.generic.data
  }
  // eslint-disable-next-line no-eval
  return eval(strStatement)
}

function escapeRegExp (str) {
  return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&')
}

function replaceAll (find, replace, str) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace)
}

function moneyFormat (number, currency, decPlaces, thouSeparator, decSeparator) {
  decPlaces = isNaN(decPlaces = Math.abs(decPlaces)) ? 2 : decPlaces
  decSeparator = decSeparator === undefined ? '.' : decSeparator
  thouSeparator = thouSeparator === undefined ? ',' : thouSeparator
  let sign = number < 0 ? '-' : ''
  let i = parseInt(number = Math.abs(+number || 0).toFixed(decPlaces)) + ''
  let j = i.length > 3 ? i.length % 3 : 0
  return (currency ? currency + ' ' : '') + sign + (j ? i.substr(0, j) + thouSeparator : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thouSeparator) + (decPlaces ? decSeparator + Math.abs(number - i).toFixed(decPlaces).slice(2) : '')
}
