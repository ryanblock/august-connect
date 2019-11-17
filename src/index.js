let authorize = require('./_authorize')
let lock = require('./_lock')
let _locks = require('./_locks')
let status = require('./_status')
let unlock = require('./_unlock')

module.exports = {
  authorize,
  lock,
  locks: callback => {
    _locks({internal: false}, callback)
  },
  status,
  unlock,
  validate: authorize
}
