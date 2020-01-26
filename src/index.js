let authorize = require('./_authorize')
let lockUnlock = require('./_lock-unlock')
let _locks = require('./_locks')
let status = require('./_status')

module.exports = {
  authorize,
  lock: lockUnlock.bind({}, 'lock'),
  locks: callback => {
    _locks({internal: false}, callback)
  },
  status,
  unlock: lockUnlock.bind({}, 'unlock'),
  validate: authorize
}
