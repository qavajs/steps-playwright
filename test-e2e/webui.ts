import Memory from './memory';
import App from './page_object';
import localServer from './support/server';

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
        },
        trace: {
            event: ['onFail'],
            dir: 'dirToStoreTraces',
            attach: true
        },
        video: {
            event: ['onFail'],
            dir: 'dirToStoreVideos',
            size: { width: 800, height: 600 },
            attach: true
        }
    },
    format: [
        '@qavajs/console-formatter',
        '@qavajs/xunit-formatter:test-e2e/report.xml',
        '@qavajs/html-formatter:test-e2e/report.html'
    ],
    memory: new Memory(),
    pageObject: new App(),
    parallel: 4,
    publishQuiet: true,
    retry: 1,
    service: [localServer],
    screenshot: ['onFail'],
    tags: 'not @skip'
}

export default common;

export const debug = {
    ...common,
    retry: 0,
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
        },
        video: {
            event: ['onFail'],
            dir: 'video',
            size: { width: 800, height: 600 },
            attach: true
        }
    }
}
