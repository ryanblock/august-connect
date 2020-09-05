const session = require('./util/session')
const tiny = require('tiny-json-http')

/**
 * Get locks
 * - Returns an object containing account's locks
 */
function locks(params={}, callback) {
  if (!callback && typeof params === 'function') {
    callback = params
    params = {}
  }
  params = params || {}

  let { internal=true } = params
  let promise
  if (!callback) {
    promise = new Promise((res, rej) => {
      callback = (err, result) => {
        err ? rej(err) : res(result)
      }
    })
  }

  session(params,
  function _locks(err, result) {
    if (err) callback(err)
    else {
      let { headers, token } = result
      let url = 'https://api-production.august.com/users/locks/mine'
      headers['Content-Length'] = 0 // endpoint requires `Content-length: 0` or it won't hang up ¯\_(ツ)_/¯
      tiny.get({
        url,
        headers
      }, function done(err, response) {
        if (err) callback(err)
        else {
          let result = internal
            ? { body: response.body, headers, token }
            : { ...response.body, token }
          callback(null, result)
        }
      })
    }
  })

  return promise
}

locks.external = function (params={}, callback) {
  params.internal = false
  return locks(params, callback)
}

module.exports = locks
