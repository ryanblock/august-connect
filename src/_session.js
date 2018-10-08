let tiny = require('tiny-json-http')

// Session
// - Once validated, August provides JWTs statelessly
// - To keep this module stateless, we'll fetch the JWT from session with each request

let sessionEndpoint = 'https://api-production.august.com/session'

let installId = process.env.AUGUST_INSTALLID
let password = process.env.AUGUST_PASSWORD
let identifierType = process.env.AUGUST_ID_TYPE
let identifier = process.env.AUGUST_ID
let ID = identifierType + ":" + identifier

// Set up standard headers
let AugustAPIKey = process.env.AUGUST_API_KEY
let keaseAPIKey = AugustAPIKey // these two keys are the same ¯\_(ツ)_/¯
let headers = {
  'x-august-api-key': AugustAPIKey,
  'x-kease-api-key': keaseAPIKey,
  'Content-Type': 'application/json',
  'Accept-Version': '0.0.1',
  'User-Agent': 'August/Luna-3.2.2',
}

let AugustAccessTokenRequestBody = { installId, password, identifier: ID }

module.exports = function AugustAccessTokenRequest(callback) {
  tiny.post({
    url: sessionEndpoint,
    headers,
    data: AugustAccessTokenRequestBody,
  }, function _done(err, response) {
    if (err) {
      console.log(err)
    } else {
      headers['x-august-access-token'] = response.headers['x-august-access-token']
      callback(headers)
    }
  })
}
