const crypto = require('crypto')

let Utils = function() {

}

Utils.Timer = function (start = true) {
    this.ticks = 0
    this.begin = Date.now()

    this.reset = function () {
        this.ticks = 0
    }

    this.start = function () {
        this.begin = Date.now()
    }

    this.pause = function () {
        this.ticks = this.ticks + Date.now() - this.begin
    }

    if (start) {
        this.start()
    }
}

const hex = '0123456789ABCDEF'

Utils.padLeft = function (value, pattern) {
    let code = pattern + value

    return code.slice(code.length - pattern.length)
}

Utils.random = function() {
    let buffer = crypto.randomBytes(4)

    let number = 0x0

    for (let i = 0; i < 4; ++i) {
        number |= buffer[0] << (i * 8)
    }

    number &= 0x7FFFFFFF
    number /= 0x7FFFFFFF

    return number
}

Utils.formatUUID = function (buffer) {
    let segments = []

    for (let i = 0; i < 16; ++i) {
        segments.push(hex[(buffer[i] >> 4 & 0xF)])
        segments.push(hex[(buffer[i] >> 0 & 0xF)])

        if (i == 3 || i == 5 || i == 7 || i == 9) {
            segments.push('-')
        }
    }

    return segments.join('')
}

Utils.generateTokenWithTime = function () {
    let date = Date.now()
    let buffer = crypto.randomBytes(16)

    buffer[0] = (date >> 24) & 0xFF
    buffer[1] = (date >> 16) & 0xFF
    buffer[2] = (date >> 08) & 0xFF
    buffer[3] = (date >> 00) & 0xFF

    buffer[6] = 0x40 | (buffer[6] & 0xF)
    buffer[8] = 0x80 | (buffer[8] & 0xF)

    return Utils.formatUUID(buffer)
}

Utils.generateToken = function() {
    let buffer = crypto.randomBytes(16)

    buffer[6] = 0x40 | (buffer[6] & 0xF)
    buffer[8] = 0x80 | (buffer[8] & 0xF)

    return Utils.formatUUID(buffer)
}

Utils.Scope = function() {
    let parts = Array.from(arguments)

    return parts.join('.')
}

Utils.timer = function (start = true) {
    return new Utils.Timer(start)
}

Utils.dispatcher = function () {
    let callbacks = [];

    let fn = function () {
        let args = Array.from(arguments)

        for (callback of callbacks) {
            callback.call(null, args);
        }
    };

    fn.attach = function (callback) {
        let index = callbacks.indexOf(callback);
        if (index < 0) {
            callbacks.push(callback);
        }
        else {
            return;
        }
    };

    fn.detach = function (callback) {
        let index = callbacks.indexOf(callback);
        if (index < 0) {
            return;
        }
        else {
            callbacks.splice(index, 0, callback);
        }
    };

    return fn;
};

module.exports = Utils