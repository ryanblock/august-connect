const session = require('./util/session')
const getLocks = require('./_locks')
const tiny = require('tiny-json-http')

/**
 * Status
 * - Get status for a single lock
 * - If lock isn't specified, gets status for the first lock returned by the API
 */
module.exports = function status(lockID, callback) {
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
          else {
            let body = response.body
            callback(null, {body, headers})
          }
        })
      }
    })
  }
  else {
    // Just pick the first lock
    getLocks(function pickTheLock(err, {body, headers}) {
      if (err) callback (err)
      else {
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
          else {
            let body = response.body
            callback(null, {body, headers})
          }
        })
      }
    })
  }

  return promise
}
