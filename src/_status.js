const session = require('./_session')
const getLocks = require('./_locks')
const tiny = require('tiny-json-http')

// Status
// - Get status for a single lock
// - If lock isn't specified, gets status for the first lock returned by the API

module.exports = function status(lockID, callback) {

  if (lockID) {
    const url = 'https://api-production.august.com/remoteoperate/' + lockID + '/status'
    session(
      function _status(headers) {
        headers['Content-Length'] = 0 // endpoint requires `Content-length: 0` or it won't hang up ¯\_(ツ)_/¯
        tiny.put({
          url,
          headers,
        }, function done(err, response) {
          if (err) {
            console.log(err)
          }
          else {
            callback(response.body, headers)
          }
        })
      }
    )
  }
  else {
    // Just pick the first lock
    getLocks(
      function pickTheLock(data, headers) {
        // TODO maybe enable this method to return status of all locks?
        const locks = Object.keys(data)
        lockID = locks[0]
        const url = 'https://api-production.august.com/remoteoperate/' + lockID + '/status'
        headers['Content-Length'] = 0 // endpoint requires `Content-length: 0` or it won't hang up ¯\_(ツ)_/¯
        tiny.put({
          url,
          headers,
        }, function done(err, response) {
          if (err) {
            console.log(err)
          }
          else {
            callback(response.body, headers)
          }
        })
      }
    )
  }
}
