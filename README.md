[![npm version](https://badge.fury.io/js/@qavajs%2Fsteps-playwright.svg)](https://badge.fury.io/js/@qavajs%2Fsteps-playwright)

# @qavajs/steps-playwright
Step library to work with playwright in qavajs framework

## Installation

`npm install @qavajs/steps-playwright`

## Configuration
```javascript
const App = require('./page_object');
module.exports = {
    default: {
        require: [
            'node_modules/@qavajs/steps-playwright/index.js'
        ],
        browser: {
            timeout: {
                present: 10000,
                visible: 20000,
                page: 10000
            },
            capabilities: {
                browserName: 'chromium'
            }
        },
        pageObject: new App()
    }
}
```

## Global variables
@qavajs/steps-playwright exposes following global variables
         
| variable   | type                                        | description                                  |
|------------|---------------------------------------------|----------------------------------------------|
| `browser`  | `Browser`                                   | browser instance                             |
| `driver`   | `Browser`                                   | browser instance (alias for browser)         |
| `context`  | `BrowserContext`                            | current browser context                      |
| `page`     | `Page`                                      | current context page                         |
| `contexts` | `{ [contextName: string]: BrowserContext }` | Map of opened contexts in multi browser mode |

## Connect to playwright server
In order to connect to playwright server pass _wsEndpoint_ property in capabilities object
```typescript
{
    capabilities: {
        browserName: 'chromium',
        wsEndpoint: 'ws://127.0.0.1:60291/2bd48ce272de2b543e4c8c533f664b83'    
    }
}
```

## Connect to cdp endpoint
In order to connect to CDP endpoint pass _cdpEndpoint_ property in capabilities object 
```typescript
{
    capabilities: {
        browserName: 'chromium',
        cdpEndpoint: 'http://localhost:9222/'    
    }
}
```

## Screenshot strategy
@qavajs/steps-playwright has build-in capability to take screenshot on particular event. If you need to add 
screenshot to your report add _screenshot_ property to profile config.
Supported events:
- onFail
- beforeStep
- afterStep

```javascript
module.exports = {
    default: {
        screenshot: ['onFail']
    }
}
```

## Playwright traces
@qavajs support capturing playwright traces. https://playwright.dev/docs/next/trace-viewer-intro
```typescript
export default {
    //...
    browser: {
        trace: {
            event: ['onFail'], // Events to save trace. Possible value onFail or AfterScenario 
            dir: 'dirToStoreTraces', // Dir to store traces. Default is traces/
            attach: true // Define if trace need to be attached to cucumber report. Default false
        }
    }
}
```

## Video
@qavajs support capturing playwright traces. https://playwright.dev/docs/next/trace-viewer-intro
```typescript
export default {
    //...
    browser: {
        video: {
            event: ['onFail'], // Events to save video. Possible value onFail or AfterScenario 
            dir: 'dirToStoreVideo', // Dir to store video. Default is video/
            size: { width: 640, height: 480 }, // Video resolution
            attach: true // Define if trace need to be attached to cucumber report. Default false
        }
    }
}
```

## Typescript
To properly use globals exposed by @qavajs/steps-playwright add corresponding types to tsconfig.json
```json
{
  "compilerOptions": {
    "types": [
      "@qavajs/steps-playwright/globals"
    ]
  }
}
```

