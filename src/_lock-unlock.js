const session = require('./util/session')
const getLocks = require('./_locks')
const tiny = require('tiny-json-http')

/**
 * Unlock a lock
 */
module.exports = function lockUnlock(action='lock', lockID, callback) {
  if (action !== 'lock' && action !== 'unlock')
    throw ReferenceError(`Action must either be 'lock' or 'unlock'`)

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

  let url = lock => `https://api-production.august.com/remoteoperate/${lock}/${action}`

  if (lockID) {
    session(function _status(err, headers) {
      if (err) callback(err)
      else {
        headers['Content-Length'] = 0 // Endpoint requires `Content-length: 0` or it won't hang up ¯\_(ツ)_/¯
        tiny.put({
          url: url(lockID),
          headers
        }, function done(err, response) {
          if (err) callback(err)
          else callback(null, response.body)
        })
      }
    })
  }
  else {
    getLocks(function pickTheLock(err, response) {
      if (err) callback(err)
      else {
        let {body, headers} = response
        let locks = Object.keys(body)
        // Make sure we never, ever lock or unlock the wrong lock
        if (locks.length > 1) {
          callback(Error(`If you own multiple locks, you must specify which lock to ${action}.`))
        }
        else {
          lockID = locks[0]
          headers['Content-Length'] = 0 // Endpoint requires `Content-length: 0` or it won't hang up ¯\_(ツ)_/¯
          tiny.put({
            url: url(lockID),
            headers
          }, function done(err, response) {
            if (err) callback(err)
            else callback(null, response.body)
          })
        }
      }
    })
  }

  return promise
}
