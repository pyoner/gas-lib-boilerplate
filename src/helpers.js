import { isArray } from 'util';

function checkPassword(password1, password2) {
    return password1 && password1 === password2;
}

function checkWhitelist(whitelist) {
    let email = Session.getActiveUser().getEmail();
    return isArray(whitelist) && (whitelist.indexOf(email) !== -1)
}

export function webAccessWrapper({ whitelist, password, denyMessage = 'Access denied' }) {
    let deny = () => ContentService.createTextOutput(denyMessage);
    return (success, failure = deny) => (...args) => {
        let pass = args[0].parameter.password;
        if (checkPassword(password, pass) || checkWhitelist(whitelist)) {
            return success(...args);
        }
        return failure(...args);
    }
}
