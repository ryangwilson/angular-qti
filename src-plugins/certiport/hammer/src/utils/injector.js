(function (exports) {
    function Injector() {
        this._ = {};
    }

    Injector._ = {};

    var p = Injector.prototype;

    p.val = function (key, value) {
        if (value === undefined) {
            return this._[key];
        }
        this._[key] = value;
    };

    p.inspect = function (fn) {
        var str = fn.toString();
        return str.match(/\(.*\)/)[0].match(/([\$\w])+/gm);
    };

    p._prep = function (func, scope, locals) {
        var deps;
        if (typeof func === 'function') {
            deps = this.inspect(func);
        } else {
            deps = func.splice(0, func.length - 1);
            func = func.pop();
        }
        var args = [];
        var d, dep;
        locals = locals || {};
        for (var e in deps) {
            d = deps[e];
            dep = locals[d] || this._[d];
            if (dep) {
                args.push(dep);
            }
        }
        scope = scope || {};

        return {
            func: func,
            scope: scope,
            args: args
        };
    };

    p.invoke = function (func, scope, locals) {
        var r = this._prep(func, scope, locals)
        return r.func.apply(r.scope, r.args);
    };

    p.instantiate = function (func, locals) {
        var r = this._prep(func, {}, locals);

        function F() {
            return func.apply(this, r.args);
        }

        F.prototype = r.func.prototype;
        return new F();
    };

    exports.injector = function (name) {
        var _ = Injector._;
        if (!_[name]) {
            _[name] = new Injector();
        }
        return _[name];
    };
})(this);