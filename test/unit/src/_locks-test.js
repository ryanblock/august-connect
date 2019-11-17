let test = require('tape')
let proxyquire = require('proxyquire')

let session = callback => (callback(null, {headers:{}}))
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
  t.plan(2)
  let isPromise = locks() instanceof Promise
  t.ok(isPromise, 'Promise returned')
  locks(() => {
    t.pass('Executed callback')
  })
})

test('Calls August endpoint with correct params', t => {
  t.plan(2)
  // Uses params set in last test
  t.equal(params.url, 'https://api-production.august.com/users/locks/mine', 'Valid August endpoint')
  t.equal(params.headers['Content-Length'], 0, 'Appended zero content-length to request headers')
})
