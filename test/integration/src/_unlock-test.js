let test = require('tape')
let unlock = require('../../../src/_unlock')
let isCI = process.env.CI
// eslint-disable-next-line
if (!isCI) require('dotenv').config()

test('Unlock a lock', async t => {
  t.plan(1)
  let unlocked = await unlock()
  console.log(unlocked)
  t.equal(unlocked.status, 'kAugLockState_Unlocked', `Lock unlocked`)
})
