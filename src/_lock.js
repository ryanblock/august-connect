let session = require('./_session')
let getLocks = require('./_locks')
let tiny = require('tiny-json-http')

// Lock the lock

module.exports = function status(lockID, callback) {

  if (lockID) {
    let statusEndpoint = 'https://api-production.august.com/remoteoperate/' + lockID + '/lock'
    session(
      function _status(headers) {
        headers['Content-Length'] = 0 // endpoint requires `Content-length: 0` or it won't hang up ¯\_(ツ)_/¯
        tiny.put({
          url: statusEndpoint,
          headers
        }, function done(err, response) {
          if (err) {
            console.log(err)
          } else {
            let data = response.body
            callback(data, headers)
          }
        })
      }
    )
  } else {
    getLocks(
      function pickTheLock(data, headers) {
        let locks = Object.keys(data)
        // Make sure we never, ever lock or unlock the wrong lock
        if (locks.length > 1) {
          throw Error('If you own multiple locks, you must specify which lock to lock.')
        }
        lockID = locks[0]
        let statusEndpoint = 'https://api-production.august.com/remoteoperate/' + lockID + '/lock'
        headers['Content-Length'] = 0 // endpoint requires `Content-length: 0` or it won't hang up ¯\_(ツ)_/¯
        tiny.put({
          url: statusEndpoint,
          headers
        }, function done(err, response) {
          if (err) {
            console.log(err)
          } else {
            let data = response.body
            callback(data, headers)
          }
        })
      }
    )
  }
}
