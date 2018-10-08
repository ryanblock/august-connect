let _envcheck = require('./_envcheck')
let _validate = require('./_validate')
let _locks = require('./_locks')
let _status = require('./_status')
let _lock = require('./_lock')
let _unlock = require('./_unlock')

_envcheck()

module.exports = {
  validate(code) {
    _validate(code)
  },
  locks(callback) {
    _locks(callback)
  },
  status(lockID, callback) {
    _status(lockID, callback)
  },
  lock(lockID, callback) {
    _lock(lockID, callback)
  },
  unlock(lockID, callback) {
    _unlock(lockID, callback)
  },
}
