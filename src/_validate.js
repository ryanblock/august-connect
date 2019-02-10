const session = require('./_session')
const tiny = require('tiny-json-http')

// Validation
// - User + pass only gets you a session token
// - Each session token must then be validated
// - Session tokens are keyed by installId

const identifier = process.env.AUGUST_ID
const identifierType = process.env.AUGUST_ID_TYPE

module.exports = function validate(code) {

  if (!code) {
    // Endpoint used to generate a validation code
    const url = 'https://api-production.august.com/validation/' + identifierType
    // Generate a validation code from the session
    session(
      function _getValidationCode(headers) {
        let data = { value: identifier }
        tiny.post({
          url,
          headers,
          data,
        }, function _done(err) {
          if (err) {
            console.log(err)
          }
          else {
            console.log(`Check ${identifier} for your validation code`)
          }
        })
      }
    )
  }
  else {
    // Check that the validation code is, uh, valid
    if (code.toString().length !== 6) {
      throw new Error('Validation code is invalid, should be six digits')
    }
    else {
      // Endpoint used to validate the token with the code
      const url = 'https://api-production.august.com/validate/' + identifierType
      // Validatate the session
      session(
        function _validateCode(headers) {
          console.log(headers)
          let data = {
            code
          }
          data[identifierType] = identifier
          tiny.post({
            url,
            headers,
            data,
          }, function _done(err) {
            if (err) {
              console.log(err)
            }
            else {
              console.log('Your session is now validated! Please remove references to the validate methods from your code.')
            }
          })
        }
      )
    }
  }
}
