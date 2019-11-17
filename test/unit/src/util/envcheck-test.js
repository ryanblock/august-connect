let test = require('tape')
let envcheck = require('../../../../src/util/envcheck')
let resetEnv = require('../../reset-env')

test('Set up', t => {
  t.plan(1)
  t.ok(envcheck, 'envcheck is present')
})

test('Env is ok', t => {
  resetEnv()
  t.plan(1)
  process.env.AUGUST_API_KEY = 'AUGUST_API_KEY'
  process.env.AUGUST_INSTALLID = 'AUGUST_INSTALLID'
  process.env.AUGUST_PASSWORD = 'AUGUST_PASSWORD'
  process.env.AUGUST_ID_TYPE = 'phone'
  process.env.AUGUST_ID = 'AUGUST_ID'
  envcheck()
  t.pass('No errors thrown')
})

test('Missing API key', t => {
  resetEnv()
  process.env.AUGUST_INSTALLID = 'AUGUST_INSTALLID'
  process.env.AUGUST_PASSWORD = 'AUGUST_PASSWORD'
  process.env.AUGUST_ID_TYPE = 'phone'
  process.env.AUGUST_ID = 'AUGUST_ID'
  t.throws(envcheck)
  t.end()
})

test('Missing install ID', t => {
  resetEnv()
  process.env.AUGUST_API_KEY = 'AUGUST_API_KEY'
  process.env.AUGUST_PASSWORD = 'AUGUST_PASSWORD'
  process.env.AUGUST_ID_TYPE = 'phone'
  process.env.AUGUST_ID = 'AUGUST_ID'
  t.throws(envcheck)
  t.end()
})

test('Missing password', t => {
  resetEnv()
  process.env.AUGUST_API_KEY = 'AUGUST_API_KEY'
  process.env.AUGUST_INSTALLID = 'AUGUST_INSTALLID'
  process.env.AUGUST_ID_TYPE = 'phone'
  process.env.AUGUST_ID = 'AUGUST_ID'
  t.throws(envcheck)
  t.end()
})

test('Missing ID type', t => {
  resetEnv()
  process.env.AUGUST_API_KEY = 'AUGUST_API_KEY'
  process.env.AUGUST_INSTALLID = 'AUGUST_INSTALLID'
  process.env.AUGUST_PASSWORD = 'AUGUST_PASSWORD'
  process.env.AUGUST_ID = 'AUGUST_ID'
  t.throws(envcheck)
  t.end()
})

test('Missing ID', t => {
  resetEnv()
  process.env.AUGUST_API_KEY = 'AUGUST_API_KEY'
  process.env.AUGUST_INSTALLID = 'AUGUST_INSTALLID'
  process.env.AUGUST_PASSWORD = 'AUGUST_PASSWORD'
  process.env.AUGUST_ID_TYPE = 'phone'
  t.throws(envcheck)
  t.end()
})

test('Clean up env', t => {
  t.plan(1)
  resetEnv()
  t.pass('Env reset')
})
