# [august-connect](https://www.npmjs.com/package/august-connect)

[![GitHub CI status](https://github.com/ryanblock/august-connect/workflows/Node%20CI/badge.svg)](https://github.com/ryanblock/august-connect/actions?query=workflow%3A%22Node+CI%22)

A simple module for locking, unlocking, and getting the status of August smart locks via the [August Connect WiFi bridge](https://august.com/products/august-connect-wifi-bridge/).

---

## Setup

You'll need:

- A set up & configured August Smart Lock + August Connect WiFi bridge
- The password to the August account you'll be using with this client
- A valid August API key¹

```sh
npm i august-connect
```

Require `august-connect` in your project:
```javascript
let august = require('august-connect')
```

---

## Configuration

Calls must be made with a configuration set either as environment variables, or passed in the parameters of the method in question.


### Environment variables

The following configuration environment variables are **required** if not passing a `config` **object**:

- `AUGUST_API_KEY` - **string** - a valid August API key¹ (please refer notes at the bottom of this readme for more)
- `AUGUST_INSTALLID` - **string** - referred to as the "installation" below, this string represents your authorized session; changing it will break things and require re-authorization; suggest using something reasonably long, random, and unique
- `AUGUST_PASSWORD` - **string** - your August password
- `AUGUST_ID_TYPE` - **string** - one of `email` or `phone`
- `AUGUST_ID` - **string** - the corresponding account email or a phone number (phone format is `+[countrycode][number]` with no other symbols, i.e. `+12345678901`)

To work with `august-connect` locally, I suggest setting up your variables with [dotenv](https://www.npmjs.com/package/dotenv).


### Config object

The following configuration keys are **required** if not passing the environment variables noted above:

- `apiKey` - - **string** - a valid August API key¹ (please refer notes at the bottom of this readme for more)
- `installID` - - **string** - referred to as the "installation" below, this string represents your authorized session; changing it will break things and require re-authorization; suggest using something reasonably long, random, and unique
- `password` - - **string** - your August password
- `IDType` - - **string** - one of `email` or `phone`
- `augustID` - - **string** - the corresponding account email or a phone number (phone format is `+[countrycode][number]` with no other symbols, i.e. `+12345678901`)


### Tokens

August's API uses short-lived tokens (JWTs); as of version 3.0 `august-connect` returns a `token` **string** from its first session initiation; subsequent requests may reuse the same token.

> ⚠️ **Warning:** Depending on how your processes run, network conditions, API latency, etc., these tokens may expire mid-use. **If you aren't totally sure, don't reuse your token between transactions.**

---

## API

### Authorization
#### `august.authorize([params][, callback])` → `[Promise]`
#### ⚠️ Required step!

> Also aliased to `august.validate()`

Before you can use `august-connect`, you'll have to authorize an installation (i.e. your `AUGUST_INSTALLID`, which is just a unique identifier of your choosing that you'll continue reusing). **You only need to authorize an installation one time** – you should not attempt continued / ongoing reauthorization attempts.

If passed, params must be an **object**; this object may contain a `code` **string**, and `config` **object**.

Returns **error**, or (if provided `code`) **string** of the authorized installation ID.

To authorize an installation, you must input a six digit code that August will send to your `email` or `phone` ID. Here's how:

- First, assuming your configuration env vars are set, initiate the request for an auth code by calling: `august.authorize({config: {...})`
- Then, complete your auth request by adding the six digit code (as a string) as the first param: `august.authorize({code: '123456'})`

You should now have an authorized installation!

> ⚠️ **Warning:** if you change your `AUGUST_INSTALLID`, or don't make use of that installation's session for 120 days, you'll have to repeat the authorization process again.

##### Example
```javascript
// Get a second-factor code
august.authorize({
  config: {
    apiKey,
    installID,
    password,
    IDType,
    augustID
  }
}, console.log)

// Authorize
august.authorize({
  code,
  ...config
}, console.log)
```


### Status / info

#### `august.status([params][, callback])` → `[Promise]`

If passed, params must be an **object**; this object may contain a `lockID` **string**, `config` **object**, and `token` **string**.

Returns **error**, or **object** containing status and diagnostic info of a single lock, and a reusable [`token`](#tokens):
- If your account only has access to a single lock, you can opt not to specify a `lockID`
- For reference, lock states:
  - `status.kAugLockState_Locked`: lock is **locked**
  - `status.kAugLockState_Unlocked`: lock is **unlocked**

##### Example
```javascript
// Check your lock's status
const August = require('august-connect')

August.status({ lockID: '7EDFA965E0AE0CE19772AFA435364295' }, console.log)
// {
//   status: 'kAugLockState_Locked',
//   info: { ... }
//   retryCount: 1,
//   totalTime: 1786,
//   resultsFromOperationCache: false,
//   token: 'foobar'
// }
```


#### `august.locks([params][, callback])` → `[Promise]`

If passed, params must be an **object**, and may contain a `config` **object**, and `token` **string**.

Returns **error**, or **object** containing locks that your valid installation has access to, and a reusable [`token`](#tokens)

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
//    HouseName: 'Home',
//    token: 'foobar
//   }
// }
```


### Lock / unlock

#### `august.lock([params][, callback])` → `[Promise]`

If passed, params must be an **object**, and may contain a `lockID` **string**, `config` **object**, and `token` **string**.

Returns **error**, or **object** containing status and diagnostic info after locking a single lock, and a reusable [`token`](#tokens)
- If your account only has access to a single lock, you can opt not to specify a `lockID`
- If your account has access multiple locks, **you must specify a lockID**
  - This is to prevent locking the wrong lock, which would be *pretty not good*

##### Examples
```javascript
// Lock a specific lock
const August = require('august-connect')

August.lock({ lockID: '7EDFA965E0AE0CE19772AFA435364295' }, console.log)
// {
//   status: 'kAugLockState_Locked',
//   info: { ... }
//   retryCount: 1,
//   totalTime: 1786,
//   resultsFromOperationCache: false,
//   token: 'foobar'
// }
```

```javascript
// Assuming your have only one August lock on your account
const August = require('august-connect')

;(async () => {
  await August.lock()
})
```


#### `august.unlock([params][, callback])` → `[Promise]`

If passed, params must be an **object**, and may contain a `lockID` **string**, `config` **object**, and `token` **string**.

Returns **error**, or **object** containing status and diagnostic info after unlocking a single lock, and a reusable [`token`](#tokens)
- If your account only has access to a single lock, you can opt not to specify a `lockID`
- If your account has access multiple locks, **you must specify a lockID**
  - This is to prevent unlocking the wrong lock, which would be *pretty not good*

##### Examples
```javascript
// Unlock a specific lock
const August = require('august-connect')

August.unlock({ lockID: '7EDFA965E0AE0CE19772AFA435364295' }, console.log)
// {
//   status: 'kAugLockState_Unlocked',
//   info: { ... }
//   retryCount: 1,
//   totalTime: 1786,
//   resultsFromOperationCache: false,
//   token: 'foobar
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

## Upgrade guide

### 3.0

- Version 3.0 now requires calls that methods may only be passed objects; specifically, those breaking changes would manifest in the following ways:
  - `august.authorize`:
    - Before: `august.authorize('123456')`
    - After: `august.authorize({ code: '123456' })`
  - `august.status`:
    - Before: `august.status('7EDFA965E0AE0CE19772AFA435364295')`
    - After: `august.status({ lockID: '7EDFA965E0AE0CE19772AFA435364295' })`
  - `august.lock`:
    - Before: `august.lock('7EDFA965E0AE0CE19772AFA435364295')`
    - After: `august.lock({ lockID: '7EDFA965E0AE0CE19772AFA435364295' })`
  - `august.unlock`:
    - Before: `august.unlock('7EDFA965E0AE0CE19772AFA435364295')`
    - After: `august.unlock({ lockID: '7EDFA965E0AE0CE19772AFA435364295' })`

---

## Contributing

- Please fork and submit PRs against `master`
- Make sure unit tests pass
- Integration tests should also pass, but are **not automated**
  - Because we wouldn't want real doors getting locked and unlocked in the real world, integration tests are not part of the automated test suite
  - To run them, ensure you are using a valid API key¹, set up your local `.env` file, and test against your own hardware with a valid installation

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
