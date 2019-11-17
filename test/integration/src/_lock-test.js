let test = require('tape')
let lock = require('../../../src/_lock')
let isCI = process.env.CI
// eslint-disable-next-line
if (!isCI) require('dotenv').config()

test('Lock a lock', async t => {
  t.plan(1)
  let locked = await lock()
  console.log(locked)
  t.equal(locked.status, 'kAugLockState_Locked', `Lock locked`)
})
