import { isFunction } from 'util';
import scheduler from '../scheduler';
import process, { getLog } from '../monkeys/process'; // monkey patch for process events
import console from '../console';

let isUncaughtException = false;

function logUncaughtException(err) {
    let count = process.listenerCount('uncaughtException');
    if (count) {
        try {
            process.emit('uncaughtException', err);
        } catch (e) {
            isUncaughtException = true;
            console.error(e);
            process.exit(1);
        }
    } else {
        isUncaughtException = true;
        console.error(err);
        process.exit(7);
    }
}

function valueOf(obj) {
    return obj && isFunction(obj.valueOf) ? obj.valueOf() : obj;
}

export function schedulerMiddleware(type) {
    return (next) => (event) => {
        let result;
        try {
            result = next(event);
        } catch (err) {
            logUncaughtException(err);
        } finally {
            if (!isUncaughtException) {
                try {
                    let runned = false;
                    while (!runned || !scheduler.isEmpty()) {
                        runned = true;
                        scheduler();
                        process.emit('beforeExit');
                    }
                    process.exit(0);
                } catch (err) {
                    logUncaughtException(err);
                }
            }
            return isUncaughtException ? ContentService.createTextOutput(getLog()) : valueOf(result);
        }
    }
}
