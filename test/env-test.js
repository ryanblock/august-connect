require('dotenv').config()
let session = require('../_session')
let test = require('tape')

test('env', t => {
  t.plan(1)
  session(r => {
    t.ok(session, 'August session')
  })
})
