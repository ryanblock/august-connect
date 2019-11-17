let test = require('tape')
let index = require('../../../')

test('All methods are present', t => {
  t.plan(5)
  t.ok(index.validate, 'validate is present')
  t.ok(index.locks, 'locks is present')
  t.ok(index.status, 'status is present')
  t.ok(index.lock, 'lock is present')
  t.ok(index.unlock, 'unloc is present')
})
