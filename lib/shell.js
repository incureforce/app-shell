const fs = require('fs')
const WSClientHandler = require('./ws-client-handler')
const WSServerHandler = require('./ws-server-handler')

function Shell() {
    let handler = null

    this.startup = function () {
        console.log('startup')

        if (fs.existsSync('app-shell.js')) {
            handler = new WSClientHandler()
        }
        else {
            handler = new WSServerHandler()
        }

        handler.startup()
    }

    this.dispose = function () {
        console.log('dispose')

        handler.dispose()
    }
}

module.exports = Shell;