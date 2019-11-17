const session = require('./util/session')
const tiny = require('tiny-json-http')

/**
 * Authorization
 * - User + pass only gets you a session token
 * - Each session token must then be validated
 * - Session tokens are keyed by installId
 */
module.exports = function authorize(code, callback) {
  const identifier = process.env.AUGUST_ID
  const identifierType = process.env.AUGUST_ID_TYPE

  let promise
  if (!callback) {
    promise = new Promise((res, rej) => {
      callback = (err, result) => {
        err ? rej(err) : res(result)
      }
    })
  }

  if (!code) {
    // Generate a validation code from the session
    session(function _getValidationCode(err, headers) {
      if (err) callback(err)
      else {
        // Endpoint used to generate a validation code
        let url = 'https://api-production.august.com/validation/' + identifierType
        let data = { value: identifier }
        tiny.post({
          url,
          headers,
          data,
        }, function _done(err) {
          if (err) callback(err)
          else {
            console.log(`Check ${identifier} for your validation code`)
            callback()
          }
        })
      }
    })
  }
  else {
    // Check that the validation code is, uh, valid
    if (code.toString().length !== 6) {
      callback(Error('Validation code is invalid, should be six digits'))
    }
    else {
      // Validatate the session
      session(function _validateCode(err, headers) {
        if (err) callback(err)
        else {
          // Endpoint used to validate the token with the code
          let url = 'https://api-production.august.com/validate/' + identifierType
          let data = { code }
          data[identifierType] = identifier
          tiny.post({
            url,
            headers,
            data,
          }, function _done(err) {
            if (err) callback(err)
            else {
              console.log('Session validated!')
              callback(null, process.env.AUGUST_INSTALLID)
            }
          })
        }
      })
    }
  }

  return promise
}
