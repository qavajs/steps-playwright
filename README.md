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
            'node_modules/@qavajs/steps-playwright'
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
{
    browser: {
        trace: {
            event: ['onFail'], // Events to save trace. Possible value onFail or AfterScenario 
            dir: 'dirToStoreTraces', // Dir to store traces. Default is traces/
            attach: true // Define if trace need to be attached to cucumber report. Default false
        }
    }
}
```
