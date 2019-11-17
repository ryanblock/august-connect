// Test requires access to the internets
let validate = require('../../../../src/util/session')
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

test('session integration test', t => {
  validate((err, result) => {
    let token = jwt.decode(result['x-august-access-token'], 'foo', true).installId
    t.equal(token, process.env.AUGUST_INSTALLID, 'Received valid session token from integration test')
    result['x-august-access-token'] = '***'
    console.log(err, result)
  })
  t.end()
})
