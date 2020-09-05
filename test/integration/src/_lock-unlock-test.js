let test = require('tape')
let august = require('../../../src/')
let isCI = process.env.CI
// eslint-disable-next-line
if (!isCI) require('dotenv').config()

let token

test('Unlock a lock - get a token', async t => {
  t.plan(1)
  let unlocked = await august.unlock()
  console.log({ ...unlocked, token: '***' })
  t.equal(unlocked.status, 'kAugLockState_Unlocked', `Lock unlocked`)
  token = unlocked.token
})

test('Lock a lock - get a token', async t => {
  t.plan(1)
  let locked = await august.lock()
  console.log({ ...locked, token: '***' })
  t.equal(locked.status, 'kAugLockState_Locked', `Lock locked`)
})

test('Unlock a lock - pass a token', async t => {
  t.plan(1)
  let unlocked = await august.unlock({ token })
  console.log({ ...unlocked, token: '***' })
  t.equal(unlocked.status, 'kAugLockState_Unlocked', `Lock unlocked`)
})

test('Lock a lock - pass a token', async t => {
  t.plan(1)
  let locked = await august.lock({ token })
  console.log({ ...locked, token: '***' })
  t.equal(locked.status, 'kAugLockState_Locked', `Lock locked`)
})
