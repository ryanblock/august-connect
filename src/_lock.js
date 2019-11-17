const session = require('./util/session')
const getLocks = require('./_locks')
const tiny = require('tiny-json-http')

// Lock the lock

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
        const url = 'https://api-production.august.com/remoteoperate/' + lockID + '/lock'
        headers['Content-Length'] = 0 // endpoint requires `Content-length: 0` or it won't hang up ¯\_(ツ)_/¯
        tiny.put({
          url,
          headers
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
    getLocks(function pickTheLock(err, {body, headers}) {
      if (err) callback(err)
      else {
        let locks = Object.keys(body)
        // Make sure we never, ever lock or unlock the wrong lock
        if (locks.length > 1) {
          callback(Error('If you own multiple locks, you must specify which lock to lock.'))
        }
        else {
          lockID = locks[0]
          const url = 'https://api-production.august.com/remoteoperate/' + lockID + '/lock'
          headers['Content-Length'] = 0 // endpoint requires `Content-length: 0` or it won't hang up ¯\_(ツ)_/¯
          tiny.put({
            url,
            headers
          }, function done(err, response) {
            if (err) callback(err)
            else {
              let body = response.body
              callback(null, {body, headers})
            }
          })
        }
      }
    })
  }

  return promise
}
