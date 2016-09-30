import test from 'tape';
import { webAccessWrapper } from '../../src/helpers';

test('webAccessWrapper', (t) => {
    let success = () => true;
    let failure = () => false;
    let email = 'test@mail.com';

    global.Session = {
        getActiveUser() {
            return {
                getEmail() {
                    return email;
                }
            }
        }
    }

    global.ContentService = {
        createTextOutput(text) {
            return text;
        }
    }

    t.test('test password', (t) => {
        let password = '123';
        let func = webAccessWrapper({ password })(success, failure);

        let result = func({ parameter: { password } });
        t.equal(result, true);

        result = func({ parameter: { password: 'bad password' } });
        t.equal(result, false);
        t.end();
    });

    t.test('test whitelist success', (t) => {
        let whitelist = [email];
        let func = webAccessWrapper({ whitelist })(success, failure);

        let result = func({ parameter: {} });
        t.equal(result, true);

        t.end();
    });

    t.test('test whitelist failure', (t) => {
        let whitelist = ['failure@mail.com'];
        let func = webAccessWrapper({ whitelist })(success, failure);

        let result = func({ parameter: {} });
        t.equal(result, false);

        t.end();
    });

    t.test('test denyMessage', (t) => {
        let whitelist = ['failure@mail.com'];
        let denyMessage = 'Access denied';
        let func = webAccessWrapper({ whitelist, denyMessage })(success);

        let result = func({ parameter: {} });
        t.equal(result, denyMessage);

        t.end();
    });

    t.test('test pass args to success, failure callbacks', (t) => {
        let password = '123';
        let argsFunc = (...args) => args;
        let func = webAccessWrapper({ password })(argsFunc, argsFunc);

        let successArgs = [{ parameter: { password } }];
        let result = func(...successArgs);
        t.deepLooseEqual(result, successArgs);

        let failureArgs = [{ parameter: { password: 'bad pass' } }];
        result = func(...failureArgs);
        t.deepLooseEqual(result, failureArgs);

        t.end();
    });
});
