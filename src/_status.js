let session = require('./_session')
let getLocks = require('./_locks')
let tiny = require('tiny-json-http')

// Status
// - Get status for a single lock
// - If lock isn't specified, gets status for the first lock returned by the API

module.exports = function status(lockID, callback) {

  if (lockID) {
    let statusEndpoint = 'https://api-production.august.com/remoteoperate/' + lockID + '/status'
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
    // Just pick the first lock
    getLocks(
      function pickTheLock(data, headers) {
        // TODO maybe enable this method to return status of all locks?
        let locks = Object.keys(data)
        lockID = locks[0]
        let statusEndpoint = 'https://api-production.august.com/remoteoperate/' + lockID + '/status'
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
