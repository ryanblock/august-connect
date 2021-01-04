const session = require('august-connect/src/util/session')
const getLocks = require('august-connect/src/_locks')
const tiny = require('tiny-json-http')

/**
 * Details
 * - Get details for a single lock
 * - If lock isn't specified, gets details for the first lock returned by the API
 */
module.exports = function battery(params={}, callback) {
  if (!callback && typeof params === 'function') {
    callback = params
    params = {}
  }
  let { lockID } = params

  let promise
  if (!callback) {
    promise = new Promise((res, rej) => {
      callback = (err, result) => {
        err ? rej(err) : res(result)
      }
    })
  }

  if (lockID) {
    session(params,
    function _status(err, result) {
      if (err) callback(err)
      else {
        let { headers, token } = result
        let url = 'https://api-production.august.com/locks/' + lockID
        headers['Content-Length'] = 0 // endpoint requires `Content-length: 0` or it won't hang up ¯\_(ツ)_/¯
        tiny.get({
          url,
          headers
        }, function done(err, response) {
          if (err) callback(err)
          else {
            let result = {
              ...response.body,
              token
            }
            callback(null, result)
          }
        })
      }
    })
  }
  else {
    // Just pick the first lock
    getLocks(params,
    function pickTheLock(err, result) {
      if (err) callback (err)
      else {
        let { body, headers, token } = result
        // TODO maybe enable this method to return status of all locks?
        let locks = Object.keys(body)
        lockID = locks[0]
        let url = 'https://api-production.august.com/locks/' + lockID
        headers['Content-Length'] = 0 // endpoint requires `Content-length: 0` or it won't hang up ¯\_(ツ)_/¯
        tiny.get({
          url,
          headers
        }, function done(err, response) {
          if (err) callback(err)
          else {
            let result = {
              ...response.body,
              token
            }
            callback(null, result)
          }
        })
      }
    })
  }

  return promise
}
