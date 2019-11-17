let test = require('tape')
let proxyquire = require('proxyquire')
let resetEnv = require('../reset-env')

let session = callback => (callback())
let params
let tiny = {
  post: (p, callback) => {
    params = p
    callback()
  }
}
let validate = proxyquire('../../../src/_authorize', {
  './util/session': session,
  'tiny-json-http': tiny
})

test('Returns a Promise or uses continuation passing', t => {
  t.plan(2)
  process.env.AUGUST_API_KEY = 'AUGUST_API_KEY'
  process.env.AUGUST_INSTALLID = 'AUGUST_INSTALLID'
  process.env.AUGUST_PASSWORD = 'AUGUST_PASSWORD'
  process.env.AUGUST_ID_TYPE = 'phone'
  process.env.AUGUST_ID = 'AUGUST_ID'
  let isPromise = validate() instanceof Promise
  t.ok(isPromise, 'Promise returned')
  validate(null, () => {
    t.pass('Executed callback')
  })
})

test('Calls August endpoint with correct params (no code)', t => {
  t.plan(2)
  // Uses params set in last test
  t.equal(params.url, 'https://api-production.august.com/validation/phone', 'Valid August endpoint')
  t.equal(params.data.value, 'AUGUST_ID', 'Valid ID')
})

test('Invalid code fails', t => {
  t.plan(1)
  validate('foo', err => {
    t.ok(err, err)
  })
})

test('Calls August endpoint with correct params (with code)', t => {
  t.plan(3)
  let code = '123456'
  validate(code, () => {
    t.equal(params.url, 'https://api-production.august.com/validate/phone', 'Valid August endpoint')
    t.equal(params.data.code, code, 'Valid code')
    t.equal(params.data.phone, 'AUGUST_ID', 'Valid type + ID')
  })
})

test('Clean up env', t => {
  t.plan(1)
  resetEnv()
  t.pass('Env reset')
})
