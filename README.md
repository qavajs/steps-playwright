[![npm version](https://badge.fury.io/js/@qavajs%2Fsteps-playwright.svg)](https://badge.fury.io/js/@qavajs%2Fsteps-playwright)

# @qavajs/steps-playwright
Step library to work with playwright in qavajs framework

## installation

`npm install @qavajs/steps-playwright`

## configuration
```javascript
const App = require('./page_object');
module.exports = {
    default: {
        require: [
            '@qavajs/steps-playwright'
        ],
        browser: {
            timeout: {
                present: 10000,
                visible: 20000    
            },
            capabilities: {
                browserName: 'chrome'
            }
        },
        pageObject: new App()
    }
}
```

## screenshot strategy
@qavajs/steps-playwright has build-in capability to take screenshot on particular event. If you need to add 
screenshot to your report add _screenshot_ property to profile config.
Supported events:
- onFail
- beforeStep
- afterStep

```javascript
module.exports = {
    default: {
        screenshot: 'onFail'
    }
}
```
