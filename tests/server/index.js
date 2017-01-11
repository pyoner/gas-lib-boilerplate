import { getLog } from 'gas-core';
import test from 'tape';

export function doGet(event) {
    test('test 1', (t) => {
        t.equal(1, 1);
        t.end();
    });

    test('test 2', (t) => {
        t.equal(2, 2);
        t.end();
    });

    test('test process beforeExit', (t) => {
        process.once('beforeExit', () => {
            t.equal(3, 3);
            t.end();
        });
    });

    return new Promise((resolve, reject) => {
        test.onFinish(() => resolve(ContentService.createTextOutput(getLog())))
    });
}
