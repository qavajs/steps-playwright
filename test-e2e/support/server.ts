// @ts-ignore
import express, { Express } from 'express';
import { createServer } from 'http';

class Service {
    httpServer: any;
    before() {
        const app: Express = express();
        const port = 3000;

        app.use(express.static('./test-e2e/apps'))
        this.httpServer = createServer(app);
        this.httpServer.listen(port);
    };
    after() {
        this.httpServer.close();
    }
}

export default new Service();
