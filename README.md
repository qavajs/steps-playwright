[![npm version](https://badge.fury.io/js/@qavajs%2Fsteps-playwright.svg)](https://badge.fury.io/js/@qavajs%2Fsteps-playwright)

# @qavajs/steps-playwright
**`@qavajs/steps-playwright`** provides a comprehensive set of pre-built step definitions for [qavajs](https://github.com/qavajs/qavajs), powered by [Playwright](https://playwright.dev). 
It enables easy and efficient browser automation in a behavior-driven development (BDD) style using Cucumber syntax.

## Features

- Predefined steps for web automation using Playwright
- Seamless integration with `@qavajs/core`
- Support for dynamic locators and parameters
- Built-in assertions and synchronization steps
- Easily extendable for custom needs

## Installation
```bash
npm install @qavajs/steps-playwright
```

## Configuration
```typescript
import App from './page_object'
export default {
    require: [
        'node_modules/@qavajs/steps-playwright/index.js'
    ],
    browser: {
        timeout: {
            present: 10000,
            visible: 20000,
            page: 10000,
            value: 5000, // expect value timeout
            valueInterval: 500, // expect value interval
            pageRefreshInterval: 2000 // refresh page for _I refresh page..._ steps
        },
        capabilities: {
            browserName: 'chromium',
            headless: true
        }
    },
    pageObject: new App()
}
```

## Context variables
@qavajs/steps-playwright exposes following to step context
         
| variable                  | type                             | description                          |
|---------------------------|----------------------------------|--------------------------------------|
| `this.playwright.browser` | `Browser \| ElectronApplication` | browser instance                     |
| `this.playwright.driver`  | `Browser \| ElectronApplication` | browser instance (alias for browser) |
| `this.playwright.context` | `BrowserContext`                 | current browser context              |
| `this.playwright.page`    | `Page`                           | current context page                 |

## Connect to playwright server
In order to connect to playwright server pass `wsEndpoint` property in capabilities object
```typescript
export default {
    browser: {
        capabilities: {
            browserName: 'chromium',
            wsEndpoint: 'ws://127.0.0.1:60291/2bd48ce272de2b543e4c8c533f664b83'
        }
    },
}

```

## Connect to cdp endpoint
In order to connect to CDP endpoint pass `cdpEndpoint` property in capabilities object 
```typescript
export default {
    browser: {
        capabilities: {
            browserName: 'chromium',
            cdpEndpoint: 'http://localhost:9222/'
        }
    },
}
```

## Screenshot strategy
@qavajs/steps-playwright has build-in capability to take screenshot on particular event. If you need to add 
screenshot to your report add `screenshot.event` property to profile config.
Supported events:
- onFail
- beforeStep
- afterStep

```typescript
export default {
    browser: {
        screenshot: {
            event: ['onFail'], //event to take screenshot
            fullPage: true // option to take full page screenshot (default false)
        }
    }
}

```

## Playwright traces
@qavajs support capturing playwright traces. 
https://playwright.dev/docs/next/trace-viewer-intro

Trace Viewer - https://trace.playwright.dev/

```typescript
export default {
    //...
    browser: {
        trace: {
            event: ['onFail'], // Events to save trace. Possible value onFail or afterScenario 
            dir: 'dirToStoreTraces', // Dir to store traces. Default - traces/
            attach: true, // Whether trace need to be attached to cucumber report. Default - false
            screenshots: true, // Whether to capture screenshots during tracing. Screenshots are used to build a timeline preview. Default - true
            snapshots: true, // Whether to capture DOM and network activity
        }
    }
}
```

## Video
```typescript
export default {
    //...
    browser: {
        video: {
            event: ['onFail'], // Events to save video. Possible value onFail or afterScenario 
            dir: 'dirToStoreVideo', // Dir to store video. Default is video/
            size: { width: 640, height: 480 }, // Video resolution
            attach: true // Define if trace need to be attached to cucumber report. Default false
        }
    }
}
```

## reuseSession
`reuseSession` flag allows to share session between tests in frames of process. But setting of this flag
transfers session control to user.

```typescript
export default {
    browser: {
        reuseSession: true
    }
}

```

## restartBrowser
`restartBrowser` flag allows to restart browser between tests instead of default restarting context

```typescript
export default {
    browser: {
        restartBrowser: true
    }
}

```


## Development and testing
Install dependencies
```
npm install
```

Install playwright browsers
```
npm install:browsers`
```

Build lib
```
npm run build
```

Execute unit test (with vitest)
```
npm run test`
```

Execute e2e browser tests
```
npm run test:e2e`
```

Execute e2e electron tests
```
npm run test:e2e:electron`
```
