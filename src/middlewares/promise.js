export default function promiseMiddleware(type) {
    return (next) => (event) => {
        let result = next(event);
        if (result instanceof Promise) {
            let value = null;
            let obj = {
                valueOf() {
                    return value;
                }
            }
            result.then((v) => value = v);
            return obj;
        }
        return result;
    }
}
