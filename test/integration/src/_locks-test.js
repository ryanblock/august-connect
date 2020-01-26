let test = require('tape')
let august = require('../../../src/')
let _locks = require('../../../src/_locks')
let isCI = process.env.CI
// eslint-disable-next-line
if (!isCI) require('dotenv').config()

test('Get locks (external call)', async t => {
  t.plan(1)
  let locks = await august.locks()
  console.log(locks)
  let lockName = locks[Object.keys(locks)[0]].LockName
  t.ok(lockName, `Got a lock back: ${lockName}`)
})

test('Get locks (internal call)', async t => {
  t.plan(1)
  let {body} = await _locks()
  console.log(body)
  let lockName = body[Object.keys(body)[0]].LockName
  t.ok(lockName, `Got a lock back: ${lockName}`)
})
