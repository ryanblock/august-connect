# august-connect changelog

---

## [2.0.0 RC] 2019-11-16

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
  - Apologies to everyone who suffered through my janky / inconsistent first implementation 🙏🏻
- All methods now also have cleaner returns
- Environment check also now looks for `AUGUST_API_KEY`

---
