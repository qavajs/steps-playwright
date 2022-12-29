import Memory from './memory';
import App from './page_object';

const common = {
    paths: ['test-e2e/features/*.feature'],
    require: ['test-e2e/step-definitions/*.ts', 'src/*.ts'],
    browser: {
        logLevel: 'warn',
        timeout: {
            page: 5000
        },
        capabilities: {
            browserName: 'chromium'
        }
    },
    format: [
        'json:test-e2e/report.json',
        '@qavajs/xunit-formatter:test-e2e/report.xml'
    ],
    memory: new Memory(),
    pageObject: new App(),
    parallel: 1,
    publishQuiet: true
}

export default common;

export const debug = {
    ...common,
    tags: '@debug',
    browser: {
        logLevel: 'warn',
        timeout: {
            page: 5000
        },
        capabilities: {
            browserName: 'chromium',
            headless: false
        },
        trace: {
            event: 'onFail',
            dir: 'customDir',
            attach: true
        }
    }
}
