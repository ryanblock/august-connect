const session = require('./_session')
const tiny = require('tiny-json-http')

// Get locks
// - Returns an object containing account's locks

module.exports = function locks(callback) {
  const url = 'https://api-production.august.com/users/locks/mine'

  session(
    function _locks(headers) {
      headers['Content-Length'] = 0 // endpoint requires `Content-length: 0` or it won't hang up ¯\_(ツ)_/¯
      tiny.get({
        url,
        headers
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
