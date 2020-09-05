const env = require('./util/env')
const session = require('./util/session')
const tiny = require('tiny-json-http')

/**
 * Authorization
 * - User + pass only gets you a session token
 * - Each session token must then be validated
 * - Session tokens are keyed by installId
 */
module.exports = function authorize(params={}, callback) {
  if (!callback && typeof params === 'function') {
    callback = params
    params = {}
  }
  let { code } = params

  let promise
  if (!callback) {
    promise = new Promise((res, rej) => {
      callback = (err, result) => {
        err ? rej(err) : res(result)
      }
    })
  }

  env(params, function go(err, auth) {
    if (err) callback(err)
    else {
      let { installID, IDType, augustID } = auth
      if (!code) {
        // Generate a validation code from the session
        session(params, function _getValidationCode(err, result) {
          if (err) callback(err)
          else {
            let { headers } = result
            // Endpoint used to generate a validation code
            let url = 'https://api-production.august.com/validation/' + IDType
            let data = { value: augustID }
            tiny.post({
              url,
              headers,
              data
            }, function _done(err) {
              if (err) callback(err)
              else {
                console.log(`Check ${augustID} for your validation code`)
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
          session(params, function _validateCode(err, result) {
            if (err) callback(err)
            else {
              let  { headers } = result
              // Endpoint used to validate the token with the code
              let url = 'https://api-production.august.com/validate/' + IDType
              let data = { code }
              data[IDType] = augustID
              tiny.post({
                url,
                headers,
                data
              }, function _done(err) {
                if (err) callback(err)
                else {
                  console.log('Session validated!')
                  callback(null, installID)
                }
              })
            }
          })
        }
      }
    }
  })

  return promise
}
