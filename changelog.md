# august-connect changelog

---

## [4.0.0] 2022-04-18

### Added

- Added `details()` method for getting batter information and other lock status data; thanks @techyowl!


### Changed

- Updated dependencies
- Breaking change: removed Node.js 10.x (EOL) from test suite; this module may continue working in 10.x, but it is no longer guaranteed

---

## [3.0.0] 2022-09-05

### Added

- Configuration may now be passed as an object via parameters to all method calls
  - See readme for documentation on how to pass params
- Successful calls now return a `token` parameter, which can be passed back to future calls (on a short-term basis) to speed up transactions and prevent too many token requests
- Added Node.js 14.x support to testing

### Changed

- To support passing configuration as params, method calls are now **objects**; this is a breaking change
- Removed Node.js 8.x (EOL) from test suite; this module will probably continue working in 8.x for quite some time to come, but it is no longer guaranteed; this is a breaking change

---

## [2.0.4] 2020-01-26

### Changed

- Internal API changes and DRYing up some methods

---

## [2.0.2 - 2.0.3] 2019-11-18

### Fixed

- Fixed some destructuring issues in error states
- Removed unnecessary files from package


### Changed

- Updated dependencies

---

## [2.0.1] 2019-11-18

### Changed

- Updated readme

---

## [2.0.0] 2019-11-16

### Added

- `async/await` support!
- A comprehensive test suite, including:
  - Automated unit tests (via GitHub Actions)!
  - Non-automated integration tests!
- This changelog!


### Changed

- `lock`, `locks`, `unlock`, and `status`, now return just the response body (as opposed to `{body, headers}`), which is a lot less noisy
- `validate` is now `authorize` (with support for the legacy method call)
- `authorize` now returns the ID of the authorized `installation`
- Cleaned up environment checking


### Fixed

- If not using `async/await` / Promises, all methods now use a totally normal, boring errback style
  - Also includes much cleaner, more consistent implementation of optional param passing to methods
  - Apologies to everyone who suffered through my janky / inconsistent first implementation 🙏🏻
- All methods now also have cleaner returns
- Environment check also now looks for `AUGUST_API_KEY`

---
