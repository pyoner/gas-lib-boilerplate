import { getLog } from '../monkeys/process';

const WEB_TYPES = ['doGet', 'doPost'];

export function webActionMiddleware(name, actions) {
    return (type) => {
        if (WEB_TYPES.indexOf(type) === -1) {
            return false;
        }
        return (next) => (event) => {
            let key = event.parameter[name];
            if (key) {
                let func = actions[key];
                if (func) {
                    return func(event, type, next);
                }
            }
            return next(event);
        }
    }
}

export function testAction(test) {
    return (event, type) => {
        let func = test[type];
        if (func) {
            return func(event);
        }
        return ContentService.createTextOutput(`Not found test ${type}`);
    }
}

export function logAction(event) {
    return ContentService.createTextOutput(getLog(true));
}
