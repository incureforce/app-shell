module.exports = {
    url: "http://localhost/",

    startup: function (ctx) {
        ctx.notify('services.proxy', function (path, content) {
            console.log('notify', path, content)
        })
    },

    dispose: function (ctx) {
    },
}