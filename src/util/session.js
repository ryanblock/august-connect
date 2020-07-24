const env = require('./env')
const tiny = require('tiny-json-http')

// Session
// - Once validated, August provides JWTs statelessly
// - To keep this module stateless, we'll fetch the JWT from session with each request
module.exports = function AugustAccessTokenRequest(params, callback) {
  env(params,
  function go(err, auth) {
    if (err) callback(err)
    else {
      const { apiKey, installID, password, IDType, augustID } = auth
      const url = 'https://api-production.august.com/session'
      const identifier = `${IDType}:${augustID}`
      const AugustAPIKey = apiKey // Same as 'kease' API key ¯\_(ツ)_/¯

      // Set up standard headers
      let headers = {
        'x-august-api-key': AugustAPIKey,
        'x-kease-api-key': AugustAPIKey,
        'Content-Type': 'application/json',
        'Accept-Version': '0.0.1',
        'User-Agent': 'August/Luna-3.2.2',
      }

      // August access token request body
      let data = { installID, password, identifier }

      tiny.post({
        url,
        headers,
        data,
      }, function _done(err, response) {
        if (err) callback(err)
        else {
          headers['x-august-access-token'] = response.headers['x-august-access-token']
          callback(null, headers)
        }
      })
    }
  })
}
