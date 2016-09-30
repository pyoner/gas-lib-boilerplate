import { schedulerMiddleware } from './middlewares/scheduler';
import promiseMiddleware from './middlewares/promise';
import { triggerMiddleware } from './middlewares/triggers';
import { webActionMiddleware, testAction, logAction } from './middlewares/webActions';

import { initApp } from './core';
import { webAccessWrapper } from './helpers';
import * as test from '../tests/server';
import * as app from './app';

let access = webAccessWrapper({ whitelist: ['devex.soft@gmail.com'] });
let middlewares = [
    schedulerMiddleware,
    promiseMiddleware,
    triggerMiddleware,
    webActionMiddleware('action', {
        test: access(testAction(test)),
        log: access(logAction),
    }),
];
initApp(app, middlewares, global);
