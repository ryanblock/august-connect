# august-connect

A simple module for locking, unlocking, and getting the status of August smart locks via the [August Connect WiFi bridge](https://august.com/products/august-connect-wifi-bridge/).


## Setup
You'll need:

- A set up & configured August Smart Lock + August Connect WiFi bridge
- The password to the August account you'll be using with this client
- A valid August API key¹

```sh
npm i august-connect
```

Set up the following environment variables:
- `AUGUST_API_KEY` - a valid August API key¹ – please refer notes at the bottom of this readme for more
- `AUGUST_INSTALLID` - any string; suggest using something reasonably long, random, and unique; changing this will break things and require re-validation
- `AUGUST_PASSWORD` - your August password
- `AUGUST_ID_TYPE` - `email` or `phone`
- `AUGUST_ID` - the corresponding account email or a phone number (phone format is `+[countrycode][number]` with no other symbols, i.e. `+12345678901`)

To work with `august-connect` locally, I suggest setting up your variables with [dotenv](https://www.npmjs.com/package/dotenv).

Require `august-connect` in your project:
```javascript
let august = require('august-connect')
```

## API

### Validation
#### ⚠️ Required step!

Before you can use `august-connect`, we'll have to obtain a valid session token. This means inputting a six digit code that August will send to your `email` or `phone` ID. Here's how:

- First, initiate the request for a validation code by calling: `august.validate()`
- Then, complete your validation request by adding the six digit code (as a string) in the param: `august.validate('123456')`
- Finally, remove `august.validate()` from your code, because you won't need it anymore

Now you should have a valid session! If you change your `AUGUST_INSTALLID`, or don't use this session for 120 days, you'll have to validate a new session.


### Lock methods

- `august.locks(callback)` - returns object of locks your account has access to
- `august.status([lockID][, callback])` - returns status of a single lock
  - You can choose not to specify a `lockID` if your account only has access to a single lock
  - Just for reference, lock states:
    - `kAugLockState_Locked` == lock is locked
    - `kAugLockState_Unlocked` == lock is unlocked
- `august.lock([lockID][, callback])` - lock a single lock
  - You can choose not to specify a `lockID` if your account only has access to a single lock
  - If your account has access multiple locks you must specify a lockID; this is to prevent locking the wrong lock
- `august.unlock([lockID][, callback])` - unlock a single lock
  - You can choose not to specify a `lockID` if your account only has access to a single lock
  - Same as above, your account has access multiple locks you must specify a lockID; this is to prevent unlocking the wrong lock


## Examples

#### Lock your lock (assuming your have only one August lock on your account)
```javascript
let august = require('august-connect')

august.lock()
```

#### Lock a specific lock, log the results
```javascript
let august = require('august-connect')

august.lock('7EDFA965E0AE0CE19772AFA435364295', d=>console.log(d))
```

#### Unlock a specific lock
```javascript
let august = require('august-connect')

august.unlock('7EDFA965E0AE0CE19772AFA435364295')
```

#### Check to see if your lock is locked
```javascript
let august = require('august-connect')

august.status('7EDFA965E0AE0CE19772AFA435364295',
  function isItLocked(lock) {
    return (lock.status === 'kAugLockState_Locked') 
  }
)
```


## Coming soon
- Tests, especially for the August API (PRs welcome!)
- Support for returning promises probably
- Better handling of some obscure API error states
- idk, what else should this do?


## Acknowledgments
Big ups to [Nolan Brown](https://medium.com/@nolanbrown/august-lock-rest-apis-the-basics-7ec7f31e7874) and [Joe Lu](https://github.com/snjoetw)'s [py-august](https://github.com/snjoetw/py-august) project for paving the way!


## Notes
¹ `august-connect` uses August's unpublished API, and August has been known to occasionally recycle their client API keys. Hard-coding a August API key into `august-connect` would not reliable, so you'll need to acquire a key of your own. I suggest using [Nolan Brown's August API reverse engineering guide](https://medium.com/@nolanbrown/the-process-of-reverse-engineering-the-august-lock-api-9dbd12ab65cb) to get one – or there's always Google!

- This module was tested with a 1st-generation August Smart Lock
  - If you have a 2nd or 3rd-gen Pro (or regular), I'd love to know that it works!
- This module does not provide an interface to August locks via BLE
- This module is not intended to provide complete coverage of the August API, only the bare minimum necessary to operate the August Smart Lock
- Unfortunately, August does not publish their API for consumer usage, so this may break at any time; August name etc. trademark Assa Abloy (who make some truly locks, by the way!)
- **I am in no way responsible for any safety issues that arise from the use of this module!**
