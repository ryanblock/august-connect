let test = require('tape')
let august = require('../../../src/')
let isCI = process.env.CI
// eslint-disable-next-line
if (!isCI) require('dotenv').config()

let token

test('Get lock status - get a token', async t => {
  t.plan(1)
  let lock = await august.status()
  console.log({ ...lock, token: '***' })
  t.ok(lock.status, `Got lock status: ${lock.status}`)
  token = lock.token
})

test('Get lock status - pass a token', async t => {
  t.plan(1)
  let lock = await august.status({ token })
  console.log({ ...lock, token: '***' })
  t.ok(lock.status, `Got lock status: ${lock.status}`)
})
