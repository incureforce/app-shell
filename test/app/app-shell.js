const os = require('os')

module.exports = {
    url: "http://localhost/",

    startup: function (ctx) {
        ctx.update('services.proxy', {
            hostname: os.hostname()
        })
    },

    dispose: function (ctx) {
        ctx.update('services.proxy')
    },
}