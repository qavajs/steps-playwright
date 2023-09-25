# Change Log

All notable changes to the "@qavajs/steps-playwright" will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

:rocket: - new feature
:beetle: - bugfix
:x: - deprecation


## [0.34.0]
- :rocket: added _I upload {string} file by clicking {string}_ step
- :rocket: added _I save bounding rect of {string} as {string}_ step

## [0.33.0]
- :rocket: added _I set window size {string}_ step

## [0.32.0]
- :rocket: added _I click {string} coordinates in {string}_ step

## [0.31.0]
- :rocket: added _I scroll to {string}_ step

## [0.30.0]
Deprecated:
- :x: screenshot property moved to browser/driver config.
  Screenshot under root is marked as deprecated and will be removed in future releases.
 
## [0.29.1]
- :beetle: fixed video attachment

## [0.29.0]
- :rocket: added _I save screenshot of {string} as {string}_ step

## [0.28.0]
- :rocket: added _I expect every element in {string} collection {playwrightConditionWait}_ step

## [0.27.0]
- :rocket: added video recording
 
## [0.26.0]
- :rocket: added mouse and keyboard actions steps

## [0.25.0]
- :rocket: added enabled/disabled validation
- :beetle: fixed issue with default timeouts
- :beetle: fixed regexp in dynamic po steps
  
## [0.0.24]
- :rocket: added _I open new tab_
- :rocket: added steps to work with multiple browser contexts

## [0.0.23]
- :rocket: added types to global members
- :rocket: added _I switch to 'IFrame' frame_
- :rocket: added _I switch to 'window name or title' window_

## [0.0.22]
- :beetle: fixed exports of mock and poDefine

## [0.0.21]
- :rocket: added I drag and drop... step

## [0.0.20]
- :rocket: enabled all options in new context
- :rocket: implemented context reload instead browser

## [0.0.19]
- :rocket: added to match value wait
- :rocket: added in viewport validation

## [0.0.18]
- :rocket: added interceptor steps
- :rocket: added support of multiple events for taking screenshots

## [0.0.17]
- :rocket: added _I force click_ step
- :beetle: added support of memory values in _I click '$value' text in 'collection' collection_

## [0.0.16]
- :beetle: fixed optional params templates in wait steps

## [0.0.15]
- :rocket: added validation logs

## [0.0.14]
- :rocket: added custom timeout parameter

## [0.0.13]
- :rocket: added JS alert steps
- :rocket: added _I press button given number of times_ step

## [0.0.12]
- :rocket: added _I upload file_ step

## [0.0.11]
- :rocket: removed po package dependency
- :rocket: added util functions exports to build custom steps

## [0.0.9]
- :rocket: added scroll by offset steps
- :rocket: updated po dependency to support ignoreHierarchy options
 
## [0.0.8]
- :beetle: fixed issue that opens page from browser, not from context
- :rocket: added mock steps
- :rocket: added playwright traces

## [0.0.7]
- :rocket: added capability to connect via CDP
- :rocket: added I wait until current url step
- :rocket: added I wait until page title step
- :rocket: added I execute steps allow to execute client functions

## [0.0.6]
- :beetle: fixed issue in After hook if browser is not started
- :rocket: added I save css property step
- :rocket: added I expect css property step
- :rocket: added capability to connect to playwright server
