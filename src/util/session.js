const envcheck = require('./envcheck')
const tiny = require('tiny-json-http')

// Session
// - Once validated, August provides JWTs statelessly
// - To keep this module stateless, we'll fetch the JWT from session with each request
module.exports = function AugustAccessTokenRequest(callback) {
  envcheck()

  const url = 'https://api-production.august.com/session'
  const env = process.env
  const installId = env.AUGUST_INSTALLID
  const password = env.AUGUST_PASSWORD
  const identifier = env.AUGUST_ID_TYPE + ':' + env.AUGUST_ID
  const AugustAPIKey = env.AUGUST_API_KEY // Same as 'kease' API key ¯\_(ツ)_/¯

  // Set up standard headers
  let headers = {
    'x-august-api-key': AugustAPIKey,
    'x-kease-api-key': AugustAPIKey,
    'Content-Type': 'application/json',
    'Accept-Version': '0.0.1',
    'User-Agent': 'August/Luna-3.2.2',
  }

  // August access token request body
  let data = { installId, password, identifier }

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
