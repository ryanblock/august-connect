module.exports = function envcheck(params={}, callback) {
  let { config={} } = params

  let errors = []
  let apiKey =    process.env.AUGUST_API_KEY    || config.apiKey
  let installID = process.env.AUGUST_INSTALLID  || config.installID
  let password =  process.env.AUGUST_PASSWORD   || config.password
  let IDType =    process.env.AUGUST_ID_TYPE    || config.IDType
  let augustID =  process.env.AUGUST_ID         || config.augustID

  if (!apiKey)
    errors.push(`Missing config.apiKey or AUGUST_API_KEY env var`)
  if (!installID)
    errors.push(`Missing config.installID or AUGUST_INSTALLID env var`)
  if (!password)
    errors.push(`Missing config.password or AUGUST_PASSWORD env var`)
  if (!IDType || IDType !== 'phone' && IDType !== 'email')
    errors.push(`Missing config.IDType or AUGUST_ID_TYPE env var: must be 'phone' or 'email'`)
  if (!augustID)
    errors.push(`Missing config.augustID or AUGUST_ID env var`)

  if (errors.length) callback(ReferenceError(`Env errors found:\n${errors.join('\n')}`))
  else {
    let auth = { apiKey, installID, password, IDType, augustID }
    callback(null, auth)
  }
}
