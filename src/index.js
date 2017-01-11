import { initApp } from 'gas-core';
import { schedulerMiddleware } from 'gas-core/lib/middlewares/scheduler';
import promiseMiddleware from 'gas-core/lib/middlewares/promise';
import { triggerMiddleware } from 'gas-core/lib/middlewares/triggers';
import { webActionMiddleware, testAction, logAction } from 'gas-core/lib/middlewares/webActions';
import { webAccessWrapper } from 'gas-core/lib/helpers';

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
