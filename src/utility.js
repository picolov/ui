import { UPDATE_DATA, REMOVE_ROW, SHOW_ALERT, REFRESH_COMPONENT } from './store/mutation-types'
import moment from 'moment'
import api from './api/common'
import {_} from 'vue-underscore'

export default {
  install: function (Vue) {
    Object.defineProperty(Vue.prototype, '$util', { value: {stringInject, getObjectOrDefault, getObjectFromString, orderComponentList, uuid, evaluateString, processAction, datetimeToString, moneyFormat, getQueryStringObject, deepSearch, getComponents, getComponentsWithModel} })
  }
}

function processAction (instance, action, component, item, index, urlParam, dataId) {
  let data = instance.$store.state.generic.data[dataId]
  let actionOption = {data: data, item: item, urlParam: urlParam, index: index, component: component}

  if (!action.hasOwnProperty('functions')) {
    // backward compatible
    processFunction(instance, data, action, actionOption, dataId)
    return
  }
  let functionSequences = generateFunctionSequences(action)
  if (functionSequences.length === 0) return

  if (action.showLoading) { instance.$bus.$emit('show-full-loading', { key: 'processAction' }) }

  var functionCount = Object.keys(functionSequences).length
  var sequenceCount = 0

  _.reduce(functionSequences, (previousAgenda, actionAgenda) => {
    return previousAgenda.then((previousResult) => {
      let agendaPromise = []
      sequenceCount++

      _.reduce(actionAgenda, (result, action) => {
        let actionPromise = processFunction(instance, data, action, actionOption, dataId)
          .then((actionResult) => {
            return actionResult
          })
        agendaPromise.push(actionPromise)
        // return untuk memberikan param ke action selanjutnya
      }, [])

      let chainPromise = Promise.all(agendaPromise)

      // sequenceCount === functionCount, is last executed function, it will out of loop and promise will needed to run last action
      if (sequenceCount === functionCount) {
        chainPromise.then((result) => {
          // To do: Action Callback after all process running
          instance.$bus.$emit('hide-full-loading', { key: 'processAction' })
          console.log('all function done', result)
          Promise.resolve(result)
        }).catch((error) => {
          instance.$bus.$emit('hide-full-loading', { key: 'processAction' })
          Promise.reject(error)
        })
      }

      return chainPromise
    }).catch((error) => {
      instance.$bus.$emit('hide-full-loading', { key: 'processAction' })
      console.log('error when executing action:', error)
    })
  }, Promise.resolve())

  return true
}

/*
function simulateASync (e) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(e), 2000)
  })
}
*/

function changeRoute (instance, route, routeOption) {
  let pageRoutes = instance.$store.state.app.pageRoutes
  let nextRoute = null
  if (pageRoutes && pageRoutes.length > 0) {
    nextRoute = pageRoutes.find(function (itemRoute) {
      return itemRoute.id === route
    })
  }
  if (nextRoute) {
    instance.$router.push({ path: instance.$util.stringInject(nextRoute.url, {...routeOption}) })
  } else {
    console.log('route not found')
  }
}

function processFunction (instance, data, action, actionOption, dataId) {
  let url = stringInject(action.url, {...actionOption, action: action})
  var deferred = new Deferred()
  switch (action.type) {
    case 'refreshTable':
      instance.$store.commit(REFRESH_COMPONENT, {id: action.componentId})
      if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
      deferred.resolve()
      break
    case 'copyModel':
      let sourceData = actionOption.item
      if (action.source) {
        sourceData = getObjectOrDefault(data, action.source, null)
      }
      instance.$store.commit(UPDATE_DATA, {id: dataId, key: action.target, value: sourceData})
      if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
      deferred.resolve()
      break
    case 'getData':
      if (action.method && action.method === 'post') {
        api.post(url, {},
          (response) => {
            for (let key in response.data) {
              if (action.prefix) {
                instance.$store.commit(UPDATE_DATA, {id: dataId, key: action.prefix + '_' + key, value: response.data[key]})
              } else {
                instance.$store.commit(UPDATE_DATA, {id: dataId, key: key, value: response.data[key]})
              }
            }
            if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
            deferred.resolve(response)
          },
          (error) => {
            if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
            deferred.reject(error)
          }
        )
      } else {
        api.get(url,
          (response) => {
            for (let key in response.data) {
              if (action.prefix) {
                instance.$store.commit(UPDATE_DATA, {id: dataId, key: action.prefix + '_' + key, value: response.data[key]})
              } else {
                instance.$store.commit(UPDATE_DATA, {id: dataId, key: key, value: response.data[key]})
              }
            }
            if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
            deferred.resolve(response)
          },
          (error) => {
            if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
            deferred.reject(error)
          }
        )
      }
      break
    case 'goto':
      changeRoute(instance, action.route, actionOption)
      if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
      deferred.resolve()
      break
    case 'goback':
      instance.$router.go(-1)
      if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
      deferred.resolve()
      break
    case 'addRow':
      if (data[action.model]) {
        let count = data[action.model] + 1
        instance.$store.commit(UPDATE_DATA, {id: dataId, key: action.model, value: count})
      } else {
        instance.$store.commit(UPDATE_DATA, {id: dataId, key: action.model, value: 1})
      }
      if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
      deferred.resolve()
      break
    case 'removeRow':
      instance.$store.commit(REMOVE_ROW, {id: dataId, arraySequence: actionOption.index, arrayCount: action.model})
      if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
      deferred.resolve()
      break
    case 'exec':
      if (!action.use_validate) {
        execForm(instance, data, action, actionOption, dataId).then((result) => {
          deferred.resolve(result)
        }).catch((error) => {
          deferred.reject(error)
        })
      } else {
        instance.$validator.validateAll().then((isValid) => {
          if (!isValid) {
            // eslint-disable-next-line
            console.log('Correct them errors!')
            return
          }
          execForm(instance, data, action, actionOption, dataId).then((result) => {
            deferred.resolve(result)
          }).catch((error) => {
            deferred.reject(error)
          })
        })
      }
      break
    default:
      deferred.resolve()
      break
  }
  return deferred.promise
}

function generateFunctionSequences (action) {
  let functionSequences = {}
  if (!Array.isArray(action.functions)) return functionSequences

  _.forEach(action.functions, function (fn) {
    let indexSequence = 'default'
    if (fn.sequence) {
      indexSequence = fn.sequence
    }
    if (!functionSequences.hasOwnProperty(indexSequence)) {
      functionSequences[indexSequence] = []
    }
    functionSequences[indexSequence].push(fn)
  })

  return functionSequences
}

function execForm (instance, data, action, actionOption, dataId) {
  let url = stringInject(action.url, actionOption)
  var deferredRequest = new Deferred()
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
          let data = response.data
          if (action.model) {
            if (action.model === 'root' || action.model === '') {
              for (let key in data) {
                if (action.prefix) {
                  instance.$store.commit(UPDATE_DATA, {id: dataId, key: action.prefix + '_' + key, value: data[key]})
                } else {
                  instance.$store.commit(UPDATE_DATA, {id: dataId, key: key, value: data[key]})
                }
              }
            } else {
              instance.$store.commit(UPDATE_DATA, {id: dataId, key: action.model, value: data})
            }
          }
          if (action.noAlert) {
            if (action.redirect) {
              changeRoute(instance, action.redirect, {item: data})
            } else if (action.goback) {
              instance.$router.go(-1)
            }
            if (actionOption.component.type === 'a-table') {
              instance.$store.commit(REFRESH_COMPONENT, {id: actionOption.component.id})
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
                  changeRoute(instance, action.redirect, {item: data})
                } else if (action.goback) {
                  instance.$router.go(-1)
                }
                if (actionOption.component.type === 'a-table') {
                  instance.$store.commit(REFRESH_COMPONENT, {id: actionOption.component.id})
                }
              }
            })
          }
          if (action.refreshId) {
            instance.$store.commit(REFRESH_COMPONENT, {id: action.refreshId})
          }
          deferredRequest.resolve(response)
        },
        (error) => {
          console.log('ERROR button click' + actionOption.component.type + '-' + actionOption.component.text)
          if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
          deferredRequest.reject(error)
        }
      )
      break
    case 'put':
      api.put(url, payload,
        (response) => {
          let data = response.data
          if (action.noAlert) {
            if (action.redirect) {
              changeRoute(instance, action.redirect, {item: data})
            } else if (action.goback) {
              instance.$router.go(-1)
            }
            if (actionOption.component.type === 'a-table') {
              instance.$store.commit(REFRESH_COMPONENT, {id: actionOption.component.id})
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
                  changeRoute(instance, action.redirect, {item: data})
                } else if (action.goback) {
                  instance.$router.go(-1)
                }
                if (actionOption.component.type === 'a-table') {
                  instance.$store.commit(REFRESH_COMPONENT, {id: actionOption.component.id})
                }
              }
            })
          }
          deferredRequest.resolve(response)
        },
        (error) => {
          console.log('ERROR button click' + actionOption.component.type + '-' + actionOption.component.text)
          if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
          deferredRequest.reject(error)
        }
      )
      break
    case 'get':
      api.get(
        url,
        (response) => {
          if (actionOption.component.type === 'a-table') {
            instance.$store.commit(REFRESH_COMPONENT, {id: actionOption.component.id})
          }
          if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
          deferredRequest.resolve(response)
        },
        (error) => {
          if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
          deferredRequest.reject(error)
        }
      )
      break
    case 'delete':
      if (action.noAlert) {
        return api.delete(
          url,
          (response) => {
            if (actionOption.component.type === 'a-table') {
              instance.$store.commit(REFRESH_COMPONENT, {id: actionOption.component.id})
            }
            if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
            deferredRequest.resolve(response)
          },
          (error) => {
            if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
            deferredRequest.reject(error)
          }
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
                if (actionOption.component.type === 'a-table') {
                  instance.$store.commit(REFRESH_COMPONENT, {id: actionOption.component.id})
                }
                deferredRequest.resolve(response)
              },
              (error) => {
                if (action.showLoading) { instance.$bus.$emit('hide-full-loading', { key: 'fetchLayout' }) }
                deferredRequest.reject(error)
              }
            )
          },
          cancelCallback: () => {
            deferredRequest.reject('prompt canceled')
          }
        })
      }
      break
    default:
      deferredRequest.resolve()
      break
  }
  return deferredRequest.promise
}

function datetimeToString (datetime, formatParam) {
  let format = 'YYYY-MM-DD h:mm:ss'
  if (formatParam) format = formatParam
  let utcTime = moment.utc(datetime, 'x')
  // momentjs is mutable, doing moment.utc(value, 'x').local() will change all
  let localTime = moment(utcTime).local()
  return localTime.format(format)
}

function stringInject (str, data, dataId) {
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
        return evaluateString(statement, null, null, null, dataId)
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
          return evaluateString(statement, null, null, null, dataId)
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
      result = null
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

function evaluateString (strStatement, component, item, index, dataId) {
  // eslint-disable-next-line no-unused-vars
  let data = []
  if (this && this.$store != null) {
    data = this.$store.state.generic.data[dataId]
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

/**
 * Get the value of a querystring
 * @param  {String} url   The URL to get the value from
 * @return {Object}       The object of query value
 */
function getQueryStringObject (url) {
  let queryString = url.substring(url.indexOf('?') + 1)

  let params = {}
  let queries
  let temp
  let i
  let l
  // Split into key/value pairs
  queries = queryString.split('&')
  // Convert the array of strings into an object
  for (i = 0, l = queries.length; i < l; i++) {
    temp = queries[i].split('=')
    params[temp[0]] = temp[1]
  }
  return params
}

/**
 * Get the list of object that have property with same key and value pair
 * @param  {String} items          list of object
 * @param  {String} attrs          key and value pair for criteria of object
 * @param  {String} applyFunction  the function callback that want to applied to object
 * @param  {String} findFirst      flag to stop on first match
 * @return {Object}                The object of query value
 */
function deepSearch (items, attrs, applyFunction = undefined, findFirst = false, matchCallback = undefined) {
  var matchFunction = matchCallback
  if (!matchFunction || typeof matchFunction !== 'function') {
    matchFunction = (value) => {
      for (var key in attrs) {
        if (!_.isUndefined(value)) {
          if (attrs[key] !== value[key]) {
            return false
          }
        }
      }

      if (typeof applyFunction === 'function') {
        applyFunction(value)
      }
      return true
    }
  }

  return traverse(items, findFirst, matchFunction)
}

/**
 * Get the list of a-component from layout
 * @param  {String} items          layout of page
 * @param  {String} applyFunction  the function callback that want to applied to object
 * @param  {String} findFirst      flag to stop on first match
 * @return {Object}                The object of query value
 */

function getComponents (items, applyFunction = undefined, findFirst = false) {
  return traverse(items, findFirst, (value) => {
    if (!_.isUndefined(value)) {
      if (!value.hasOwnProperty('type') || value['type'].substring(0, 2) !== 'a-') {
        return false
      }
    }

    if (typeof applyFunction === 'function') {
      applyFunction(value)
    }
    return true
  })
}

/**
 * Get the list of a-component from layout
 * @param  {String} items          layout of page
 * @param  {String} applyFunction  the function callback that want to applied to object
 * @param  {String} findFirst      flag to stop on first match
 * @return {Object}                The object of query value
 */

function getComponentsWithModel (items, applyFunction = undefined, findFirst = false) {
  return traverse(items, findFirst, (value) => {
    if (!_.isUndefined(value)) {
      if (!value.hasOwnProperty('model') && !value.hasOwnProperty('modelLabel') && !value.hasOwnProperty('modelFrom') && !value.hasOwnProperty('modelTo') && !value.hasOwnProperty('modelCount')) {
        return false
      }
    }

    if (typeof applyFunction === 'function') {
      applyFunction(value)
    }
    return true
  })
}

// Backwards and forwards compatible helper for obsolete Promise.defer()
function Deferred () {
  // update 062115 for typeof
  if (typeof (Promise) !== 'undefined' && Promise.defer) {
    // need import of Promise.jsm for example: Cu.import('resource:/gree/modules/Promise.jsm');
    return Promise.defer()
    /* eslint-disable no-undef */
  } else if (typeof (PromiseUtils) !== 'undefined' && PromiseUtils.defer) {
    // need import of PromiseUtils.jsm for example: Cu.import('resource:/gree/modules/PromiseUtils.jsm');
    /* eslint-disable no-undef */
    return PromiseUtils.defer()
  } else {
    /* A method to resolve the associated Promise with the value passed.
    * If the promise is already settled it does nothing.
    *
    * @param {anything} value : This value is used to resolve the promise
    * If the value is a Promise then the associated promise assumes the state
    * of Promise passed as value.
    */
    this.resolve = null

    /* A method to reject the assocaited Promise with the value passed.
    * If the promise is already settled it does nothing.
    *
    * @param {anything} reason: The reason for the rejection of the Promise.
    * Generally its an Error object. If however a Promise is passed, then the Promise
    * itself will be the reason for rejection no matter the state of the Promise.
    */
    this.reject = null

    /* A newly created Promise object.
    * Initially in pending state.
    */
    this.promise = new Promise(function (resolve, reject) {
      this.resolve = resolve
      this.reject = reject
    }.bind(this))
    Object.freeze(this)
  }
}

function traverse (value, findFirst, matchFunction) {
  var result = []

  _.forEach(value, function (val) {
    if (matchFunction(val)) {
      result.push(val)
      if (findFirst) {
        return false
      }
    }

    if (_.isObject(val) || _.isArray(val)) {
      let traverseResult = traverse(val, findFirst, matchFunction)
      if (traverseResult.length > 0) {
        result = [...result, ...traverseResult]
      }
    }

    if (result) {
      return false
    }
  })

  return result
}
