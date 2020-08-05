const fs = require('fs');
const WebSocket = require('ws');

const Utils = require('./utils')
const WSClientContext = require('./ws-client-context')

let WSClientHandler = function (url) {
    let ws = null;
    let ctx = null;
    let config = null;

    this.startup = function () {
        config = require(process.cwd() + '/app-shell.js');

        let uri = new URL(config.url);

        uri.pathname = '/ws/client';
        uri.searchParams
            .set("token", Utils.generateTokenWithTime());

        ctx = new WSClientContext()
        ws = new WebSocket(uri.toString());

        ws.sendUpdate = function (scope) {
            let emit = {
                type: 'update',
                path: scope.path,
                content: scope.content
            }

            ws.send(JSON.stringify(emit))
        }

        ws.sendNotify = function (scope) {
            let emit = {
                type: 'notify',
                path: scope.path,
                callback: typeof(scope.callback),
            }

            ws.send(JSON.stringify(emit))
        }

        ws.on('open', function () {
            console.debug('connection: okay');

            ctx.onupdate = ws.sendUpdate
            ctx.onnotify = ws.sendNotify

            for (scope of Object.values(ctx.scopes)) {
                if (scope.content) {
                    ws.sendUpdate(scope)
                }
                if (scope.callback) {
                    ws.sendNotify(scope)
                }
            }

            ws.onmessage = function (message) {
                let emit = JSON.parse(message.data);

                if (emit.type == 'invoke') {
                    ctx.invoke(emit.path, emit.content);
                    
                    return;
                }

                console.warn('unkown message', message)
            };

            ws.onclose = function () {
                console.debug('connection: down');
            };
        });

        config.startup(ctx)
    };

    this.dispose = function () {
        config.dispose(ctx)

        ws.close();
    };
};

module.exports = WSClientHandler;
