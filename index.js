const inspector = require('inspector')

const Shell = require("./lib/shell")

let shell = new Shell()

process.on('SIGINT', function () {
    console.info()

    shell.dispose()
})

process.on('SIGTERM', function () {
    shell.dispose()
})

shell.startup()