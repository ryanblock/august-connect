let test = require('tape')
let august = require('../../../src/')
let isCI = process.env.CI
// eslint-disable-next-line
if (!isCI) require('dotenv').config()

test('Unlock a lock', async t => {
  t.plan(1)
  let unlocked = await august.unlock()
  console.log(unlocked)
  t.equal(unlocked.status, 'kAugLockState_Unlocked', `Lock unlocked`)
})

test('Lock a lock', async t => {
  t.plan(1)
  let locked = await august.lock()
  console.log(locked)
  t.equal(locked.status, 'kAugLockState_Locked', `Lock locked`)
})
