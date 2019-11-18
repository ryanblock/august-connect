# august-connect

[![GitHub CI status](https://github.com/ryanblock/august-connect/workflows/Node%20CI/badge.svg)](https://github.com/ryanblock/august-connect/actions?query=workflow%3A%22Node+CI%22)

A simple module for locking, unlocking, and getting the status of August smart locks via the [August Connect WiFi bridge](https://august.com/products/august-connect-wifi-bridge/).


## Setup
You'll need:

- A set up & configured August Smart Lock + August Connect WiFi bridge
- The password to the August account you'll be using with this client
- A valid August API key¹

```sh
npm i august-connect
```

Set up the following **required** configuration environment variables:

- `AUGUST_API_KEY` - **string** - a valid August API key¹ (please refer notes at the bottom of this readme for more)
- `AUGUST_INSTALLID` - **string** - referred to as the `installation` below, this string represents your authorized session; changing it will break things and require re-authorization; suggest using something reasonably long, random, and unique
- `AUGUST_PASSWORD` - **string** - your August password
- `AUGUST_ID_TYPE` - **string** - one of `email` or `phone`
- `AUGUST_ID` - **string** - the corresponding account email or a phone number (phone format is `+[countrycode][number]` with no other symbols, i.e. `+12345678901`)

To work with `august-connect` locally, I suggest setting up your variables with [dotenv](https://www.npmjs.com/package/dotenv).

Require `august-connect` in your project:
```javascript
let august = require('august-connect')
```

## API

### Authorization
#### `august.authorize([code][, callback])` → `[Promise]`
#### ⚠️ Required step!

> Also aliased to `august.validate()`

Returns **error**, or (if provided `code`) **string** of the authorized installation ID.

Before you can use `august-connect`, you'll have to authorize an `installation` (i.e. your `AUGUST_INSTALLID`, which is just a unique identifier of your choosing that you'll continue reusing). **You only need to authorize an `installation` one time** – you should not attempt continued / ongoing reauthorization attempts.

To authorize an `installation`, you must input a six digit code that August will send to your `email` or `phone` ID. Here's how:

- First, assuming your configuration env vars are set, initiate the request for an auth code by calling: `august.authorize()`
- Then, complete your auth request by adding the six digit code (as a string) as the first param: `august.authorize('123456')`

You should now have an authorized `installation`!

> ⚠️ **Warning:** if you change your `AUGUST_INSTALLID`, or don't make use of that installation's session for 120 days, you'll have to repeat the authorization process again.


### Status / info

#### `august.status([lockID][, callback])` → `[Promise]`

Returns **error**, or **object** containing status and diagnostic info of a single lock
- If your account only has access to a single lock, you can opt not to specify a `lockID`
- For reference, lock states:
  - `status.kAugLockState_Locked`: lock is **locked**
  - `status.kAugLockState_Unlocked`: lock is **unlocked**

##### Example
```javascript
// Check your lock's status
const August = require('august-connect')

August.status('7EDFA965E0AE0CE19772AFA435364295', console.log)
// {
//   status: 'kAugLockState_Locked',
//   info: { ... }
//   retryCount: 1,
//   totalTime: 1786,
//   resultsFromOperationCache: false
// }
```


#### `august.locks([callback])` → `[Promise]`

Returns **error**, or **object** containing locks that your valid `installation` has access to

##### Example
```javascript
// Check to see if your lock is locked
const August = require('august-connect')

August.locks(console.log)
// {
//  '7EDFA965E0AE0CE19772AFA435364295': {
//    LockName: 'Front door',
//    UserType: 'superuser',
//    macAddress: '1A:2B:3C:4D:5E:6F',
//    HouseID: '097dcab3-a29a-491a-8468-bab41b6b7040',
//    HouseName: 'Home'
//   }
// }
```


### Lock / unlock

#### `august.lock([lockID][, callback])` → `[Promise]`

Returns **error**, or **object** containing status and diagnostic info after locking a single lock
- If your account only has access to a single lock, you can opt not to specify a `lockID`
- If your account has access multiple locks, **you must specify a lockID**
  - This is to prevent locking the wrong lock, which would be *pretty not good*

##### Examples
```javascript
// Lock a specific lock
const August = require('august-connect')

August.lock('7EDFA965E0AE0CE19772AFA435364295', console.log)
// {
//   status: 'kAugLockState_Locked',
//   info: { ... }
//   retryCount: 1,
//   totalTime: 1786,
//   resultsFromOperationCache: false
// }
```

```javascript
// Assuming your have only one August lock on your account
const August = require('august-connect')

;(async () => {
  await August.lock()
})
```


#### `august.unlock([lockID][, callback])` → `[Promise]`

Returns **error**, or **object** containing status and diagnostic info after unlocking a single lock
- If your account only has access to a single lock, you can opt not to specify a `lockID`
- If your account has access multiple locks, **you must specify a lockID**
  - This is to prevent unlocking the wrong lock, which would be *pretty not good*

##### Examples
```javascript
// Unlock a specific lock
const August = require('august-connect')

August.unlock('7EDFA965E0AE0CE19772AFA435364295', console.log)
// {
//   status: 'kAugLockState_Unlocked',
//   info: { ... }
//   retryCount: 1,
//   totalTime: 1786,
//   resultsFromOperationCache: false
// }
```

```javascript
// Assuming your have only one August unlock on your account
const August = require('august-connect')

;(async () => {
  await August.unlock()
})
```

---

## Contributing

- Please fork and submit PRs against `master`
- Make sure unit tests pass
- Integration tests should also pass, but are **not automated**
  - Because we wouldn't want real doors getting locked and unlocked in the real world, integration tests are not part of the automated test suite
  - To run them, ensure you are using a valid API key¹, set up your local `.env` file, and test against your own hardware with a valid `installation`

---


## Acknowledgments
Big ups to [Nolan Brown](https://medium.com/@nolanbrown/august-lock-rest-apis-the-basics-7ec7f31e7874) and [Joe Lu](https://github.com/snjoetw)'s [py-august](https://github.com/snjoetw/py-august) project for paving the way!


## Notes
¹ `august-connect` uses August's unpublished API, and August has been known to occasionally recycle their client API keys. Hard-coding a August API key into `august-connect` would not reliable, so you'll need to acquire a key of your own. I suggest using [Nolan Brown's August API reverse engineering guide](https://medium.com/@nolanbrown/the-process-of-reverse-engineering-the-august-lock-api-9dbd12ab65cb) to get one – or there's always Google!

- This module was tested with a 1st-generation August Smart Lock
  - If you have future-gen August smart locks, I'd love to know more about how the library performs for you!
- This module does not provide an interface to August locks via BLE
- This module is not intended to provide complete coverage of the August API, only the bare minimum necessary to operate the August Smart Lock
- Unfortunately, August does not publish their API for consumer usage, so this may break at any time; August name etc. trademark Assa Abloy (who make some truly great locks, by the way!)
- **I am in no way responsible for any safety issues that arise from the use of this module!**
