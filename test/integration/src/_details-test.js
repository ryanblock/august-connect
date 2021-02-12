let test = require('tape')
let august = require('../../../src/')
let isCI = process.env.CI
// eslint-disable-next-line
if (!isCI) require('dotenv').config()

let token

test('Get lock battery details - get a token', async t => {
  t.plan(1)
  let lock = await august.details()
  console.log({ ...lock, token: '***' })
  t.ok(lock.battery, `Got lock battery details: ${lock.battery}`)
  token = lock.token
})

test('Get lock battery details - pass a token', async t => {
  t.plan(1)
  let lock = await august.details({ token })
  console.log({ ...lock, token: '***' })
  t.ok(lock.battery, `Got lock battery details: ${lock.battery}`)
})
