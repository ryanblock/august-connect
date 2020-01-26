let test = require('tape')
let proxyquire = require('proxyquire')

let session = callback => (callback(null, {headers:{}}))
let lockData = {
  body: {foo: 'bar'},
  headers: {foo: 'bar'}
}
let locks = callback => (callback(null, lockData))
let params
let tiny = {
  put: (p, callback) => {
    params = p
    callback(null, {body:'foo'})
  }
}
let unlock = proxyquire('../../../src/_unlock', {
  './util/session': session,
  './_locks': locks,
  'tiny-json-http': tiny
})

test('Returns a Promise or uses continuation passing', t => {
  t.plan(5)
  let isPromise = unlock() instanceof Promise
  t.ok(isPromise, 'Promise returned (without params)')
  isPromise = unlock('foo') instanceof Promise
  t.ok(isPromise, 'Promise returned (with params)')
  unlock(() => (t.pass('Executed callback (without params)')))
  unlock(null, () => (t.pass('Executed callback (null params)')))
  unlock('foo', () => (t.pass('Executed callback (with params)')))
})

test('Calls August endpoint with correct params (passed lockID)', t => {
  t.plan(3)
  unlock('myLockID', (err, result) => {
    if (err) t.fail(err)
    t.equal(params.url, 'https://api-production.august.com/remoteoperate/myLockID/unlock', 'Valid August endpoint')
    t.equal(params.headers['Content-Length'], 0, 'Appended zero content-length to request headers')
    t.ok(result, 'Returned result')
  })
})

test('Fails when no lockID is passed and multiple locks are returned by the API', t => {
  t.plan(1)
  lockData.body['baz'] = 'buz'
  unlock(null, (err) => {
    delete lockData.body['baz']
    t.ok(err, `Error returned: ${err}`)
  })
})

test('Calls August endpoint with correct params (no lockID passed)', t => {
  t.plan(3)
  unlock(null, (err, result) => {
    if (err) t.fail(err)
    t.equal(params.url, 'https://api-production.august.com/remoteoperate/foo/unlock', 'Valid August endpoint')
    t.equal(params.headers['Content-Length'], 0, 'Appended zero content-length to request headers')
    t.ok(result, 'Returned result')
  })
})
