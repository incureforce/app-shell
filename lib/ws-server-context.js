let WSServerContext = function() {
    let scopes = [];

    this.scopes = scopes;

    this.ensure = function (path) {
        return scopes[path] || (scopes[path] = {
            callbacks: {},
            contents: {},
            path: path
        });
    }

    this.notify = function (path, client, callback) {
        let scope = this.ensure(path);

        if (typeof(callback) == 'function') {
            scope.callbacks[client] = callback;

            let contents = Object.values(scope.contents);

            callback({
                path: path,
                content: contents,
            })
        }
        else {
            delete scope.callbacks[client];
        }
    }

    this.remove = function (ws) {
        for (scope of scopes) {
            if (ws.key in scope.contents) {
                delete scope.contents[ws.key]
            }
            
            if (ws.key in scope.callbacks) {
                delete scope.callbacks[ws.key]
            }
        }
    }

    this.update = function (path, client, content) {
        let scope = this.ensure(path);

        if (scope.contents[client.key] == content) {
            return
        }

        if (typeof (content) != 'undefined') {
            scope.contents[client.key] = content;
        }
        else {
            delete scope.contents[client.key];
        }

        let contents = Object.values(scope.contents);
        let callbacks = Object.values(scope.callbacks);

        for (callback of callbacks) {
            callback({
                path: path,
                content: contents
            });
        }
    }
}

module.exports = WSServerContext;