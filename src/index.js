let authorize = require('./_authorize')
let lockUnlock = require('./_lock-unlock')
let locks = require('./_locks')
let status = require('./_status')

module.exports = {
  authorize,
  lock: lockUnlock.bind({}, 'lock'),
  locks: locks.bind({}, {internal: false}),
  status,
  unlock: lockUnlock.bind({}, 'unlock'),
  validate: authorize
}
