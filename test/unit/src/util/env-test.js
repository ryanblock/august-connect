let test = require('tape')
let env = require('../../../../src/util/env')
let resetEnv = require('../../reset-env')

test('Set up', t => {
  t.plan(1)
  t.ok(env, 'env is present')
})

test('Env is ok', t => {
  resetEnv()
  t.plan(1)
  process.env.AUGUST_API_KEY = 'AUGUST_API_KEY'
  process.env.AUGUST_INSTALLID = 'AUGUST_INSTALLID'
  process.env.AUGUST_PASSWORD = 'AUGUST_PASSWORD'
  process.env.AUGUST_ID_TYPE = 'phone'
  process.env.AUGUST_ID = 'AUGUST_ID'
  env({}, err => {
    if (err) t.fail(err)
    t.pass('No errors thrown')
  })
})

test('Missing API key', t => {
  resetEnv()
  t.plan(1)
  process.env.AUGUST_INSTALLID = 'AUGUST_INSTALLID'
  process.env.AUGUST_PASSWORD = 'AUGUST_PASSWORD'
  process.env.AUGUST_ID_TYPE = 'phone'
  process.env.AUGUST_ID = 'AUGUST_ID'
  env({}, err => {
    if (err) t.ok(err, `Failed with error: ${err}`)
    else t.fail('No error found')
  })
})

test('Missing install ID', t => {
  resetEnv()
  t.plan(1)
  process.env.AUGUST_API_KEY = 'AUGUST_API_KEY'
  process.env.AUGUST_PASSWORD = 'AUGUST_PASSWORD'
  process.env.AUGUST_ID_TYPE = 'phone'
  process.env.AUGUST_ID = 'AUGUST_ID'
  env({}, err => {
    if (err) t.ok(err, `Failed with error: ${err}`)
    else t.fail('No error found')
  })
})

test('Missing password', t => {
  resetEnv()
  t.plan(1)
  process.env.AUGUST_API_KEY = 'AUGUST_API_KEY'
  process.env.AUGUST_INSTALLID = 'AUGUST_INSTALLID'
  process.env.AUGUST_ID_TYPE = 'phone'
  process.env.AUGUST_ID = 'AUGUST_ID'
  env({}, err => {
    if (err) t.ok(err, `Failed with error: ${err}`)
    else t.fail('No error found')
  })
})

test('Missing ID type', t => {
  resetEnv()
  t.plan(1)
  process.env.AUGUST_API_KEY = 'AUGUST_API_KEY'
  process.env.AUGUST_INSTALLID = 'AUGUST_INSTALLID'
  process.env.AUGUST_PASSWORD = 'AUGUST_PASSWORD'
  process.env.AUGUST_ID = 'AUGUST_ID'
  env({}, err => {
    if (err) t.ok(err, `Failed with error: ${err}`)
    else t.fail('No error found')
  })
})

test('Missing ID', t => {
  resetEnv()
  t.plan(1)
  process.env.AUGUST_API_KEY = 'AUGUST_API_KEY'
  process.env.AUGUST_INSTALLID = 'AUGUST_INSTALLID'
  process.env.AUGUST_PASSWORD = 'AUGUST_PASSWORD'
  process.env.AUGUST_ID_TYPE = 'phone'
  env({}, err => {
    if (err) t.ok(err, `Failed with error: ${err}`)
    else t.fail('No error found')
  })
})

test('Clean up env', t => {
  t.plan(1)
  resetEnv()
  t.pass('Env reset')
})
