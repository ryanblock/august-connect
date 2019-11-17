module.exports = function resetEnv () {
  delete process.env.AUGUST_API_KEY
  delete process.env.AUGUST_INSTALLID
  delete process.env.AUGUST_PASSWORD
  delete process.env.AUGUST_ID_TYPE
  delete process.env.AUGUST_ID
  let e = process.env
  if (e.AUGUST_API_KEY ||
      e.AUGUST_INSTALLID ||
      e.AUGUST_PASSWORD ||
      e.AUGUST_ID_TYPE ||
      e.AUGUST_ID)
    throw Error('Test env reset failed')
}
