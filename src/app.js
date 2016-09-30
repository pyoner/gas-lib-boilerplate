import pack from '../package.json';

export function doGet(e) {
    return ContentService.createTextOutput(`Ver.: ${pack.version}\nHello, world!`);
}
