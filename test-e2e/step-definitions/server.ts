import { BeforeExecution, AfterExecution } from '@qavajs/core';
import express, { Express } from 'express';
import { createServer } from 'node:http';

let httpServer: any;

BeforeExecution(async function () {
    const app: Express = express();
    const port = 3000;

    app.use(express.static('./test-e2e/apps'))
    httpServer = createServer(app);
    httpServer.listen(port);
});

AfterExecution(async function () {
    httpServer.close();
});
