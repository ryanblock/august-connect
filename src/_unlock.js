const session = require('./util/session')
const getLocks = require('./_locks')
const tiny = require('tiny-json-http')

/**
 * Unlock a lock
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
        let url = 'https://api-production.august.com/remoteoperate/' + lockID + '/unlock'
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
    getLocks({}, function pickTheLock(err, {body, headers}) {
      if (err) callback(err)
      else {
        let locks = Object.keys(body)
        // Make sure we never, ever lock or unlock the wrong lock
        if (locks.length > 1) {
          callback(Error('If you own multiple locks, you must specify which lock to lock.'))
        }
        else {
          lockID = locks[0]
          let url = 'https://api-production.august.com/remoteoperate/' + lockID + '/unlock'
          headers['Content-Length'] = 0
          tiny.put({
            url,
            headers,
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
