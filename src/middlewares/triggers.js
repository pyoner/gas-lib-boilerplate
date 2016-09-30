import EventEmitter from 'events';

export const EVENT_PREFIX = {
    onOpen: 'Open',
    onEdit: 'Edit',
    onInstall: 'Install',
    doGet: 'Get',
    doPost: 'Post',
}

class TriggerEmitter extends EventEmitter {}
export const emitter = new TriggerEmitter();

export function triggerMiddleware(type) {
    return (next) => (event) => {
        let name = EVENT_PREFIX[type];
        emitter.emit(`before${name}`, event);
        let result = next(event);
        emitter.emit(`after${name}`, event);
        return result;
    }
}
