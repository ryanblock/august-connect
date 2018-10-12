module.exports = function error() {
  function error(message) {
    throw ReferenceError(message)
  }
  if (!process.env.AUGUST_INSTALLID) {
    error(`Missing AUGUST_INSTALLID env var`)
  }
  if (!process.env.AUGUST_PASSWORD) {
    error(`Missing AUGUST_PASSWORD env var`)
  }
  if (!process.env.AUGUST_ID_TYPE) {
    error(`Missing AUGUST_ID_TYPE env var: must be 'phone' or 'email'`)
  }
  if (process.env.AUGUST_ID_TYPE !== ('phone' || 'email')) {
    error(`Invalid AUGUST_ID_TYPE env var: must be 'phone' or 'email'`)
  }
  if (!process.env.AUGUST_ID) {
    error(`Missing AUGUST_ID env var`)
  }
}
