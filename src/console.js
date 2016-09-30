import { format } from 'util';

export class Console {
    constructor(stdout, stderr = null, opts = { forceString: false }) {
        this._stdout = stdout;
        this._stderr = stderr || stdout;
        this.opts = opts;
    }

    _format(type, args, asString = false) {
        let data = {
            type,
            date: new Date(),
            message: format(...args),
        }

        return asString ? `[${data.date.toISOString()}]\t${data.type}:\t${data.message}\n` : data;
    }

    _write(type, args, stream = this._stdout) {
        stream.write(this._format(type, args, this.opts.forceString || !stream.objectMode));
    }

    log(...args) {
        this._write('info', args);
    }

    info(...args) {
        this._write('info', args);
    }

    error(...args) {
        this._write('error', args, this._stderr);
    }

    warn(...args) {
        this._write('warn', args, this._stderr);
    }
}

const console = new Console(process.stdout, process.stderr);
global.console = console;
export default console;
