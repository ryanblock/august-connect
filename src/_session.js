const tiny = require('tiny-json-http')

// Session
// - Once validated, August provides JWTs statelessly
// - To keep this module stateless, we'll fetch the JWT from session with each request

const url = 'https://api-production.august.com/session'

const installId = process.env.AUGUST_INSTALLID
const password = process.env.AUGUST_PASSWORD
const identifierType = process.env.AUGUST_ID_TYPE
const identifier = process.env.AUGUST_ID
const ID = identifierType + ":" + identifier

// Set up standard headers
const AugustAPIKey = process.env.AUGUST_API_KEY
const keaseAPIKey = AugustAPIKey // these two keys are the same ¯\_(ツ)_/¯
let headers = {
  'x-august-api-key': AugustAPIKey,
  'x-kease-api-key': keaseAPIKey,
  'Content-Type': 'application/json',
  'Accept-Version': '0.0.1',
  'User-Agent': 'August/Luna-3.2.2',
}

// August access token request body
const data = { installId, password, identifier: ID }

module.exports = function AugustAccessTokenRequest(callback) {
  tiny.post({
    url,
    headers,
    data,
  }, function _done(err, response) {
    if (err) {
      console.log(err)
    }
    else {
      headers['x-august-access-token'] = response.headers['x-august-access-token']
      callback(headers)
    }
  })
}
