const http = require('http');
const WebSocket = require('ws');

const Utils = require('./utils')
const WSClientContext = require('./ws-client-context');
const WSServerContext = require('./ws-server-context');

let WSServerHandler = function () {
    let wss = null;
    let ctx = null;
    let server = null;

    this.startup = function () {
        server = http.createServer(function (res, req) {
            res.write('Hello World!');
            res.end();
        });

        ctx = new WSServerContext();
        wss = new WebSocket.Server({
            server: server,
            path: '/ws/client'
        });

        wss.on('connection', function (ws, req) {
            ws.key = Utils.generateTokenWithTime();

            console.debug(ws.key, 'connection: okay');

            ws.sendInvoke = function (scope) {
                let emit = {
                    type: 'invoke',
                    path: scope.path,
                    content: scope.content
                };

                ws.send(JSON.stringify(emit));
            }

            ws.onmessage = function (message) {
                let emit = JSON.parse(message.data);

                if (emit.type == 'update') {
                    ctx.update(emit.path, ws, emit.content);

                    return;
                }

                if (emit.type == 'notify') {
                    if (emit.callback == 'function') {
                        emit.callback = ws.sendInvoke;
                    }
                    else {
                        delete emit.callback;
                    }

                    ctx.notify(emit.path, ws, emit.callback);

                    return;
                }

                console.warn('unkown message', message)
            };

            ws.onclose = function () {
                console.debug(ws.key, 'connection: down');

                ctx.remove(ws)
            };
        });

        server.listen(80);
    };

    this.dispose = function () {
        server.close();
        wss.close();
    };
};

module.exports = WSServerHandler;
