let test = require('tape')
let proxyquire = require('proxyquire')

let session = (params, callback) => (callback(null, {headers:{}}))
let params
let tiny = {
  get: (p, callback) => {
    params = p
    callback(null, {body:'foo'})
  }
}
let locks = proxyquire('../../../src/_locks', {
  './util/session': session,
  'tiny-json-http': tiny
})

test('Returns a Promise or uses continuation passing', t => {
  t.plan(5)
  let isPromise = locks() instanceof Promise
  t.ok(isPromise, 'Promise returned (without params)')
  isPromise = locks('foo') instanceof Promise
  t.ok(isPromise, 'Promise returned (with params)')
  locks(() => (t.pass('Executed callback (without params)')))
  locks(null, () => (t.pass('Executed callback (undefined params)')))
  locks('foo', () => (t.pass('Executed callback (with params)')))
})

test('Calls August endpoint with correct params', t => {
  t.plan(2)
  // Uses params set in last test
  t.equal(params.url, 'https://api-production.august.com/users/locks/mine', 'Valid August endpoint')
  t.equal(params.headers['Content-Length'], 0, 'Appended zero content-length to request headers')
})
