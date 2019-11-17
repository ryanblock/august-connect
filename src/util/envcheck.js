module.exports = function envcheck() {
  let errors = []
  let APIkey = process.env.AUGUST_API_KEY
  let installID = process.env.AUGUST_INSTALLID
  let password = process.env.AUGUST_PASSWORD
  let type  = process.env.AUGUST_ID_TYPE
  let id = process.env.AUGUST_ID

  if (!APIkey)
    errors.push(`Missing AUGUST_API_KEY env var`)
  if (!installID)
    errors.push(`Missing AUGUST_INSTALLID env var`)
  if (!password)
    errors.push(`Missing AUGUST_PASSWORD env var`)
  if (!type || type !== 'phone' && type !== 'email')
    errors.push(`Missing AUGUST_ID_TYPE env var: must be 'phone' or 'email'`)
  if (!id)
    errors.push(`Missing AUGUST_ID env var`)
  if (errors.length) throw ReferenceError(`Env errors found:\n${errors.join('\n')}`)
}
