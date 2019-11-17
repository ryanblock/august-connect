let test = require('tape')
let locks = require('../../../src/_locks')
let isCI = process.env.CI
// eslint-disable-next-line
if (!isCI) require('dotenv').config()

test('Get locks', async t => {
  t.plan(1)
  let {body} = await locks()
  console.log(body)
  let lockName = body[Object.keys(body)[0]].LockName
  t.ok(lockName, `Got a lock back: ${lockName}`)
})
