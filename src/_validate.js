let session = require('./_session')
let tiny = require('tiny-json-http')

// Validation
// - User + pass only gets you a session token
// - Each session token must then be validated
// - Session tokens are keyed by installId

let identifierType = process.env.AUGUST_ID_TYPE
let identifier = process.env.AUGUST_ID

// Used to generate a validation code
let validationEndpoint = 'https://api-production.august.com/validation/' + identifierType

// Used to validate the token with the code
let validateEndpoint = 'https://api-production.august.com/validate/' + identifierType

module.exports = function validate(code) {

  if (!code) {
    // Generate a validation code from the session
    session(
      function _getValidationCode(headers) {
        let data = { value: identifier }
        tiny.post({
          url: validationEndpoint,
          headers,
          data,
        }, function _done(err) {
          if (err) {
            console.log(err)
          } else {
            console.log(`Check ${identifier} for your validation code`)
          }
        })
      }
    )
  } else {
    // Check that the validation code is, uh, valid
    if (code.toString().length !== 6) {
      throw new Error('Validation code is invalid, should be six digits')
    } else {
      // Validatate the session
      session(
        function _validateCode(headers) {
          console.log(headers)
          let data = {
            code
          }
          data[identifierType] = identifier
          tiny.post({
            url: validateEndpoint,
            headers,
            data,
          }, function _done(err) {
            if (err) {
              console.log(err)
            } else {
              console.log('Your session is now validated! Please remove references to the validate methods from your code.')
            }
          })
        }
      )
    }
  }
}
