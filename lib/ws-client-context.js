let WSClientContext = function () {
    let scopes = [];

    this.scopes = scopes;

    this.onnotify = function (scope) { };
    this.onupdate = function (scope) { };

    this.ensure = function (path) {
        return scopes[path] || (scopes[path] = {
            path: path
        });
    }

    this.select = function (path) {
        let scope = this.ensure(path)

        return scope.content;
    }

    this.update = function (path, content) {
        let scope = this.ensure(path);

        if (scope.content == content) {
            return
        }

        if (typeof (content) != 'undefined') {
            scope.content = content;
        }
        else {
            delete scope.content;
        }

        this.onupdate(scope);
    };

    this.notify = function (path, callback) {
        let scope = this.ensure(path);

        if (typeof (callback) == 'function') {
            scope.callback = callback;
        }
        else {
            delete scope.callback;
        }

        this.onnotify(scope);
    };

    this.invoke = function (path, content) {
        let scope = this.ensure(path);

        if (scope.callback) {
            scope.callback(path, content)
        }
    };
};

module.exports = WSClientContext
