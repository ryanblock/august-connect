// Test requires access to the internets
let session = require('../../../../src/util/session')
let test = require('tape')
let jwt = require('jwt-simple')
let isCI = process.env.CI
// eslint-disable-next-line
if (!isCI) require('dotenv').config()

// process.env.AUGUST_API_KEY populated by dotenv or CI
process.env.AUGUST_INSTALLID = Date.now()
process.env.AUGUST_PASSWORD = 'AUGUST_PASSWORD'
process.env.AUGUST_ID_TYPE = 'phone'
process.env.AUGUST_ID = 'AUGUST_ID'

let augustToken

test('Session integration test - get a token', t => {
  t.plan(2)
  session({}, (err, result) => {
    if (err) t.fail(err)
    else {
      let { headers, token } = result
      let headerToken = jwt.decode(headers['x-august-access-token'], 'foo', true).installId
      t.equal(headerToken, process.env.AUGUST_INSTALLID, 'Received valid headers session token from integration test')
      t.equal(headers['x-august-access-token'], token, 'Received valid session token from integration test')
      augustToken = token
      let log = {
        ...result,
        headers: {
          ...headers,
          'x-august-access-token': '***'
        },
        token: '***'
      }
      console.log(log)
    }
  })
})

test('Session integration test - pass a token', t => {
  t.plan(2)
  session({ token: augustToken }, (err, result) => {
    if (err) t.fail(err)
    else {
      let { headers, token } = result
      let headerToken = jwt.decode(headers['x-august-access-token'], 'foo', true).installId
      t.equal(headerToken, process.env.AUGUST_INSTALLID, 'Received valid headers session token from integration test')
      t.equal(headers['x-august-access-token'], token, 'Received valid session token from integration test')
      let log = {
        ...result,
        headers: {
          ...headers,
          'x-august-access-token': '***'
        },
        token: '***'
      }
      console.log(log)
    }
  })
})
