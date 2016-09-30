import EventEmitter from 'events';
import { Writable } from 'stream';

const funcs = [
    'addListener',
    'emit',
    'setMaxListeners',
    'on',
    'once',
    'removeListener',
    'removeAllListeners',
    'listeners',
    'listenerCount',
]

let p = new EventEmitter();

for (let i = 0; i < funcs.length; i++) {
    let k = funcs[i];
    process[k] = p[k].bind(p);
}

// stdout/stderr
const CACHE_KEY = '_log';
const CACHE_SIZE = 100 * 1024;
const CACHE_EXP = 21600;

let cache = CacheService.getScriptCache();
let log = '';

export function getLog(fromCache = false) {
    if (fromCache) {
        return cache.get(CACHE_KEY) || '';
    }
    return log;
}

function logToCache(data) {
    let lock = LockService.getScriptLock();
    if (lock.tryLock(1000)) {
        try {
            let value = (cache.get(CACHE_KEY) || '') + data;
            value = value.slice(-CACHE_SIZE)
            cache.put(CACHE_KEY, value, CACHE_EXP);
        } finally {
            lock.releaseLock();
        }
    }
}

class Log extends Writable {
    _write(chunk, encoding, next) {
        log += chunk;
        next();
    }
}

let opts = {
    decodeStrings: false
}

process.stderr = new Log(opts);
process.stdout = new Log(opts);

process.exit = (code = 0) => {
    process.exitCode = code;
    try {
        process.emit('exit', code);
    } catch (err) {
        console.error(err);
    }
    process.stdout.end();
    process.stderr.end();
    logToCache(log);
}
export default process;
