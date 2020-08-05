module.exports = {
    url: "http://argus/",

    startup: function (ctx) {
        ctx.notify('services.proxy', function (path, content) {
            console.log('notify', path, content)
        })
    },

    dispose: function (ctx) {
    },
}