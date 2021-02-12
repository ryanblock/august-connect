let authorize = require('./_authorize')
let lockUnlock = require('./_lock-unlock')
let { external } = require('./_locks')
let status = require('./_status')
let details = require('./_details')

module.exports = {
  authorize,
  details,
  lock: lockUnlock.bind({}, 'lock'),
  locks: external,
  status,
  unlock: lockUnlock.bind({}, 'unlock'),
  validate: authorize
}
