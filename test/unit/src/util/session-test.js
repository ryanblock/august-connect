let test = require('tape')
let resetEnv = require('../../reset-env')
let proxyquire = require('proxyquire')

let headers
let tiny = {
  post: (params, callback) => {
    headers = params.headers
    callback(null, {
      headers: {
        'x-august-access-token': 'foobar'
      }
    })
  }
}
let session = proxyquire('../../../../src/util/session', {
  'tiny-json-http': tiny
})

test('Set up', t => {
  t.plan(1)
  t.ok(session, 'session is present')
})

test('Returns headers with session', t => {
  resetEnv()
  process.env.AUGUST_API_KEY = 'AUGUST_API_KEY'
  process.env.AUGUST_INSTALLID = 'AUGUST_INSTALLID'
  process.env.AUGUST_PASSWORD = 'AUGUST_PASSWORD'
  process.env.AUGUST_ID_TYPE = 'phone'
  process.env.AUGUST_ID = 'AUGUST_ID'
  session({}, (err, result) => {
    if (err) t.fail(err)
    t.equal(result.headers['x-august-access-token'], 'foobar', 'Returned headers with x-august-access-token token appended')
    t.equal(result.token, 'foobar', 'Returned reusable August access token')
  })
  t.end()
})

test('Posted with required headers', t => {
  t.plan(5)
  t.equal(headers['x-august-api-key'], 'AUGUST_API_KEY', 'Posted with correct x-august-api-key header')
  t.equal(headers['x-kease-api-key'], 'AUGUST_API_KEY', 'Posted with correct x-kease-api-key header')
  t.equal(headers['Content-Type'], 'application/json', 'Posted with correct Content-Type header')
  t.equal(headers['Accept-Version'], '0.0.1', 'Posted with correct Accept-Version header')
  t.equal(headers['User-Agent'], 'August/Luna-3.2.2', 'Posted with correct User-Agent header')
})

test('Clean up env', t => {
  t.plan(1)
  resetEnv()
  t.pass('Env reset')
})
