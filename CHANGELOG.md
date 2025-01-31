# Change Log

All notable changes to the "@qavajs/steps-playwright" will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

:rocket: - new feature

:beetle: - bugfix

:x: - deprecation/removal

:pencil: - chore

:microscope: - experimental

## [Unreleased]
- :rocket: added source maps

## [2.3.0]
- :rocket: added `I expect {value} css property of every element in {playwrightLocator} collection {validation} {value}` step

## [2.2.1]
- :rocket: added capability to pass page object as instance

## [2.2.0]
- :rocket: added `locator.as` method to define top level components (like pages)
```typescript
export class App {
  LoginPage = locator.as(LoginPage);
}

class LoginPage {
  username = locator('#username');
  password = locator('#password');
}
```

## [2.1.0]
- :rocket: added grouping by steps in traces
- :rocket: added `FrameLocator` as possible return type for `locator.native`

## [2.0.0]
- :pencil: added memory processor to playwrightLocator parameter type
- :pencil: added page object end-to-end tests
- :rocket: reworked page object approach
- :rocket: added new function _locator_ to define page objects

```typescript
import { locator } from '@qavajs/steps-playwright/po';

class App {
  /**
   * simple locator
   * I click 'Simple'
   */
  Simple = locator('#simple');
  /**
   * dynamic locator by provided argument
   * I click 'Template (some text)'
   */
  Template = locator.template(text => `div:has-text("${text}")`);
  /**
   * locator that uses native playwright capabilities
   * I click 'Native'
   */
  Native = locator.native(({ page }) => page.locator('#native'));
}
```

  - new way to define components
```typescript
import { locator } from '@qavajs/steps-playwright/po';

class App {
  /**
   * I click 'Component > Child'
   */
  Component = locator('#parent').as(Component);
}

class Component {
    Child = locator('#child')
}
```
  - removed collection in favor of template locators

- :x: - removed frame steps in favor of using frame locators
- :x: - removed wait steps in favor of validation steps
- :x: - removed multi-browser steps

## [1.0.0]
- release 1.0.0

## [0.54.0]
- :rocket: added _I save file to {string} by clicking {string}_ step

## [0.53.0]
- :rocket: added _I grant {string} permission_ step
- :rocket: added _I revoke browser permissions_ step
- :rocket: added _I set {string} geolocation_ step
- :beetle: improved _I scroll until_ steps to use same locator

## [0.52.0]
- :rocket: added _I wait for network idle {playwrightTimeout}_ step

## [0.51.0]
Breaking change:
- :rocket: include page objects into step bundle
Migration guide: replace all po-playwright lib imports `@qavajs/po-playwright` to `@qavajs/steps-playwright/po`

## [0.50.0]
- :rocket: added _I click {string} until text of {string} {playwrightValidation} {string}( ){playwrightTimeout}_ step
- :rocket: added _I click {string} until value of {string} {playwrightValidation} {string}( ){playwrightTimeout}_ step

## [0.49.0]
- :rocket: added capability to configure traces
- :pencil: update playwright to 1.45.1

## [0.48.0]
Breaking change: moved _@qavajs/validation_ to peer dependencies
After update please install latest version of @qavajs/validation package
- :x: - removed playwright runner code as it moved to separate package @qavajs/playwright

## [0.47.1]
- :beetle: enhance logic of _I refresh page until text of {string} {playwrightValidation} {string}( ){playwrightTimeout}_ step

## [0.47.0]
- :rocket: updated collection validation to use polling 

## [0.46.3]
- :rocket: added _I refresh page until text of {string} {playwrightValidation} {string}( ){playwrightTimeout}_ step
- :rocket: added _I refresh page until {string} {playwrightConditionWait}( ){playwrightTimeout}_ step

## [0.46.2]
- :beetle: added error handling during trace attach
- :pencil: updated dependencies

## [0.46.1]
- :beetle: updated compile target

## [0.46.0]
- :microscope: added experimental support of playwright ui

## [0.45.0]
- :pencil: cleaned up dependencies
- :rocket: added value wait and validation

## [0.44.0]
- :rocket: added option to take full page screenshot (_config.browser.screenshot.fullPage_)
- :x: top level _config.screenshot_ property was removed. Define this property in _config.browser.screenshot_
- updated playwright version

## [0.43.1]
- :beetle: fixed globals.d.ts file name
- updated playwright version

## [0.43.1]
- :beetle: fixed globals.d.ts file name
- updated playwright version

## [0.43.0]
- :rocket: added _I scroll until {string} to be visible_ step
- :rocket: added _I scroll in {string} until {string} to be visible_ step

## [0.42.0]
- :rocket: added _I tap {string}_ step
```gherkin
When I tap 'Button'
```
- :beetle: added present timeout for value waits

## [0.41.5]
- :beetle: updated validation package

## [0.41.4]
- :beetle: added existence waiter before value waits to avoid promise reject without reason error
- :rocket: added _restartBrowser_ config flag to restart browser between tests (default is false, considering restarting context)

## [0.41.3]
- :rocket: added _I type {string} chars to {string}_ step

## [0.41.2]
- :rocket: replaced deprecated type() method with fill()

## [0.41.1]
- :rocket: added _reuseSession_ option to keep browser/application opened after test ends

## [0.41.0]
- :rocket: introduced browserManager object to control all launched browser and electron instances
- :rocket: added steps to start/stop/switch to other browser/electron instances

## [0.40.0]
- :rocket: changed simple expects to poll expects
- :rocket: changed behavior of _I switch to {string} window_ step (now it is wait for window existence)
- :rocket: replaced _playwrightValueWait_ type with more generic _playwrightValueWait_ allowing more wait types
  Breaking change: value waits now depends on _value_ timeout
- :beetle: fixed getting of electron context

## [0.39.0]
- :rocket: enabled logger for page objects

## [0.38.0]
- :rocket: added _I close current tab_ step

## [0.37.0]
- :rocket: added _I wait until {string} css property of {string} {playwrightValueWait} {string}( ){playwrightTimeout}_ step
- :rocket: added experimental electron support
- :rocket: added js selector strategy (you can pass js expression that returns iterator of document nodes)

```javascript
class YourComponent {
    Element = $('js=document.querySelectorAll("div.class")')
}
```

## [0.36.0]
- :rocket: added _I save full page screenshot as {string}_ step

## [0.35.0]
- :rocket: added _I click {playwrightBrowserButton} button_ step

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
