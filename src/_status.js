const session = require('./util/session')
const getLocks = require('./_locks')
const tiny = require('tiny-json-http')

/**
 * Status
 * - Get status for a single lock
 * - If lock isn't specified, gets status for the first lock returned by the API
 */
module.exports = function status(lockID, callback) {
  if (!callback && typeof lockID === 'function') {
    callback = lockID
    lockID = undefined
  }

  let promise
  if (!callback) {
    promise = new Promise((res, rej) => {
      callback = (err, result) => {
        err ? rej(err) : res(result)
      }
    })
  }

  if (lockID) {
    session(function _status(err, headers) {
      if (err) callback(err)
      else {
        let url = 'https://api-production.august.com/remoteoperate/' + lockID + '/status'
        headers['Content-Length'] = 0 // endpoint requires `Content-length: 0` or it won't hang up ¯\_(ツ)_/¯
        tiny.put({
          url,
          headers,
        }, function done(err, response) {
          if (err) callback(err)
          else callback(null, response.body)
        })
      }
    })
  }
  else {
    // Just pick the first lock
    getLocks(function pickTheLock(err, params) {
      if (err) callback (err)
      else {
        let {body, headers} = params
        // TODO maybe enable this method to return status of all locks?
        let locks = Object.keys(body)
        lockID = locks[0]
        let url = 'https://api-production.august.com/remoteoperate/' + lockID + '/status'
        headers['Content-Length'] = 0 // endpoint requires `Content-length: 0` or it won't hang up ¯\_(ツ)_/¯
        tiny.put({
          url,
          headers,
        }, function done(err, response) {
          if (err) callback(err)
          else callback(null, response.body)
        })
      }
    })
  }

  return promise
}
