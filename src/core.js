import { comp, into, map, filter } from 'transducers-js';

export const TRIGGER_TYPES = [
    'onOpen',
    'onEdit',
    'onInstall',
    'doGet',
    'doPost',
]

function initMiddlewares(type, middlewares, app) {
    let xf = comp(filter(Boolean), map((m) => m(type, app)));
    return into([], xf, middlewares);
}

export function initApp(app, middlewares = [], g = global) {
    for (let name in app) {
        let obj = app[name];
        if (TRIGGER_TYPES.indexOf(name) != -1) {
            let m = initMiddlewares(name, middlewares, app);
            g[name] = !m.length ? obj : (m.length == 1 ? m[0](obj) : comp(...m)(obj));
        } else {
            g[name] = obj;
        }
    }
}
