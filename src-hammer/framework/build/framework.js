(function(exports, global) {
    global["hammer"] = exports;
    var $$ = function(name) {
        if (!$$[name]) {
            $$[name] = {};
        }
        return $$[name];
    };
    var cache = $$("c");
    var internals = $$("i");
    var pending = $$("p");
    exports.$$ = $$;
    var toArray = function(args) {
        return Array.prototype.slice.call(args);
    };
    var _ = function(name) {
        var args = toArray(arguments);
        var val = args[1];
        if (typeof val === "function") {
            this.c[name] = val();
        } else {
            cache[name] = args[2];
            cache[name].$inject = val;
            cache[name].$internal = this.i;
        }
    };
    var define = function() {
        _.apply({
            i: false,
            c: exports
        }, toArray(arguments));
    };
    var internal = function() {
        _.apply({
            i: true,
            c: internals
        }, toArray(arguments));
    };
    var resolve = function(name, fn) {
        pending[name] = true;
        var injections = fn.$inject;
        var args = [];
        var injectionName;
        for (var i in injections) {
            if (injections.hasOwnProperty(i)) {
                injectionName = injections[i];
                if (cache[injectionName]) {
                    if (pending.hasOwnProperty(injectionName)) {
                        throw new Error('Cyclical reference: "' + name + '" referencing "' + injectionName + '"');
                    }
                    resolve(injectionName, cache[injectionName]);
                    delete cache[injectionName];
                }
            }
        }
        if (!exports[name] && !internals[name]) {
            for (var n in injections) {
                injectionName = injections[n];
                args.push(exports[injectionName] || internals[injectionName]);
            }
            if (fn.$internal) {
                internals[name] = fn.apply(null, args) || name;
            } else {
                exports[name] = fn.apply(null, args) || name;
            }
        }
        Object.defineProperty(exports, "$$", {
            enumerable: false,
            writable: false
        });
        delete pending[name];
    };
    //! node_modules/hbjs/src/utils/validators/isArguments.js
    internal("isArguments", function(toString) {
        var isArguments = function(value) {
            var str = String(value);
            var isArguments = str === "[object Arguments]";
            if (!isArguments) {
                isArguments = str !== "[object Array]" && value !== null && typeof value === "object" && typeof value.length === "number" && value.length >= 0 && toString.call(value.callee) === "[object Function]";
            }
            return isArguments;
        };
        return isArguments;
    });
    //! framework/src/framework.js
    //! import framework.plugin
    //! import framework.registry
    //! import framework.config
    define("framework", [ "dispatcher", "toArray" ], function(dispatcher, toArray) {
        console.log("### framework ###");
        var framework = {};
        dispatcher(framework);
        framework.fire = function(eventName, data) {
            var css = "color: blue";
            console.log("%c[event]", css, eventName, data || "");
            framework.dispatch.apply(framework, toArray(arguments));
        };
        return framework;
    });
    //! node_modules/hbjs/src/utils/polyfills/string.supplant.js
    internal("string.supplant", function() {
        if (!String.prototype.supplant) {
            String.prototype.supplant = function(o) {
                return this.replace(/{([^{}]*)}/g, function(a, b) {
                    var r = o[b];
                    return typeof r === "string" || typeof r === "number" ? r : a;
                });
            };
        }
        return true;
    });
    //! node_modules/hbjs/src/utils/parsers/interpolate.js
    internal("interpolate", function() {
        var interpolate = function(scope, src) {
            var fn = Function;
            var result = new fn("return " + src).apply(scope);
            if (result + "" === "NaN") {
                result = "";
            }
            return result;
        };
        return interpolate;
    });
    //! node_modules/hbjs/src/utils/data/extend.js
    internal("extend", [ "toArray" ], function(toArray) {
        var extend = function(target, source) {
            var args = toArray(arguments), i = 1, len = args.length, item, j;
            var options = this || {};
            while (i < len) {
                item = args[i];
                for (j in item) {
                    if (item.hasOwnProperty(j)) {
                        if (target[j] && typeof target[j] === "object" && !item[j] instanceof Array) {
                            target[j] = extend.apply(options, [ target[j], item[j] ]);
                        } else if (item[j] instanceof Array) {
                            target[j] = target[j] || (options && options.arrayAsObject ? {
                                length: item[j].length
                            } : []);
                            if (item[j].length) {
                                target[j] = extend.apply(options, [ target[j], item[j] ]);
                            }
                        } else if (item[j] && typeof item[j] === "object") {
                            if (options.objectsAsArray && typeof item[j].length === "number") {
                                if (!(target[j] instanceof Array)) {
                                    target[j] = [];
                                }
                            }
                            target[j] = extend.apply(options, [ target[j] || {}, item[j] ]);
                        } else {
                            target[j] = item[j];
                        }
                    }
                }
                i += 1;
            }
            return target;
        };
        return extend;
    });
    //! node_modules/hbjs/src/utils/formatters/toArray.js
    internal("toArray", [ "isArguments", "isArray", "isUndefined" ], function(isArguments, isArray, isUndefined) {
        var toArray = function(value) {
            if (isArguments(value)) {
                return Array.prototype.slice.call(value, 0) || [];
            }
            try {
                if (isArray(value)) {
                    return value;
                }
                if (!isUndefined(value)) {
                    return [].concat(value);
                }
            } catch (e) {}
            return [];
        };
        return toArray;
    });
    //! framework/src/utils/plugin.js
    //! import string.supplant
    internal("framework.plugin", [ "framework", "interpolate", "extend", "http" ], function(framework, interpolate, extend, http) {
        var registry, config;
        var views = {};
        var plugins = {};
        var init = function() {
            framework.fire("plugin::init");
            var plugin, count = 0;
            for (var name in plugins) {
                plugin = plugins[name];
                if (plugin.url) {
                    count++;
                    http.get({
                        url: plugin.url,
                        success: function(response) {
                            count--;
                            interpolate(window, response.data);
                            if (count === 0) {
                                console.log("###EXPORTS####", exports);
                                framework.fire("plugin::ready", plugins);
                            }
                        }
                    });
                }
                console.log("plugin", name, plugins[name].url);
            }
        };
        framework.on("registry::ready", function(evt, data) {
            registry = data;
            var view;
            for (var e in data.views) {
                view = data.views[e];
                views[view.name] = view;
            }
            var plugin;
            for (var e in data.plugins) {
                plugin = data.plugins[e];
                plugins[plugin.name] = plugin;
            }
            console.log("HERE WE ARE", views, plugins);
        });
        framework.on("config::ready", function(evt, data) {
            config = data;
            var plugin;
            for (var e in data.plugins) {
                plugin = data.plugins[e];
                plugins[plugin.name] = extend({}, plugins[plugin.name], plugin);
            }
            console.log("HERE WE ARE AGAIN", plugins);
            init();
        });
    });
    //! node_modules/hbjs/src/utils/validators/isArray.js
    internal("isArray", function() {
        Array.prototype.__isArray = true;
        Object.defineProperty(Array.prototype, "__isArray", {
            enumerable: false,
            writable: true
        });
        var isArray = function(val) {
            return val ? !!val.__isArray : false;
        };
        return isArray;
    });
    //! node_modules/hbjs/src/utils/validators/isUndefined.js
    internal("isUndefined", function() {
        var isUndefined = function(val) {
            return typeof val === "undefined";
        };
        return isUndefined;
    });
    //! node_modules/hbjs/src/utils/ajax/http.js
    internal("http", function() {
        var serialize = function(obj) {
            var str = [];
            for (var p in obj) if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
        };
        var win = window, CORSxhr = function() {
            var xhr;
            if (win.XMLHttpRequest && "withCredentials" in new win.XMLHttpRequest()) {
                xhr = win.XMLHttpRequest;
            } else if (win.XDomainRequest) {
                xhr = win.XDomainRequest;
            }
            return xhr;
        }(), methods = [ "head", "get", "post", "put", "delete" ], i, methodsLength = methods.length, result = {};
        function Request(options) {
            this.init(options);
        }
        function getRequestResult(that) {
            var headers = parseResponseHeaders(this.getAllResponseHeaders());
            var response = this.responseText;
            if (headers.contentType && headers.contentType.indexOf("application/json") !== -1) {
                response = response ? JSON.parse(response) : response;
            }
            return {
                data: response,
                request: {
                    method: that.method,
                    url: that.url,
                    data: that.data,
                    headers: that.headers
                },
                headers: headers,
                status: this.status
            };
        }
        Request.prototype.init = function(options) {
            var that = this;
            that.xhr = new CORSxhr();
            that.method = options.method;
            that.url = options.url;
            that.success = options.success;
            that.error = options.error;
            that.data = options.data;
            that.headers = options.headers;
            if (options.credentials === true) {
                that.xhr.withCredentials = true;
            }
            that.send();
            return that;
        };
        Request.prototype.send = function() {
            var that = this;
            if (that.method === "GET" && that.data) {
                var concat = that.url.indexOf("?") > -1 ? "&" : "?";
                that.url += concat + serialize(that.data);
            } else {
                that.data = JSON.stringify(that.data);
            }
            if (that.success !== undefined) {
                that.xhr.onload = function() {
                    var result = getRequestResult.call(this, that);
                    if (this.status >= 200 && this.status < 300) {
                        that.success.call(this, result);
                    } else if (that.error !== undefined) {
                        that.error.call(this, result);
                    }
                };
            }
            if (that.error !== undefined) {
                that.xhr.error = function() {
                    var result = getRequestResult.call(this, that);
                    that.error.call(this, result);
                };
            }
            that.xhr.open(that.method, that.url, true);
            if (that.headers !== undefined) {
                that.setHeaders();
            }
            that.xhr.send(that.data, true);
            return that;
        };
        Request.prototype.setHeaders = function() {
            var that = this, headers = that.headers, key;
            for (key in headers) {
                if (headers.hasOwnProperty(key)) {
                    that.xhr.setRequestHeader(key, headers[key]);
                }
            }
            return that;
        };
        function parseResponseHeaders(str) {
            var list = str.split("\n");
            var headers = {};
            var parts;
            var i = 0, len = list.length;
            while (i < len) {
                parts = list[i].split(": ");
                if (parts[0] && parts[1]) {
                    parts[0] = parts[0].split("-").join("").split("");
                    parts[0][0] = parts[0][0].toLowerCase();
                    headers[parts[0].join("")] = parts[1];
                }
                i += 1;
            }
            return headers;
        }
        function addDefaults(options, defaults) {
            for (var i in defaults) {
                if (defaults.hasOwnProperty(i) && options[i] === undefined) {
                    if (typeof defaults[i] === "object") {
                        options[i] = {};
                        addDefaults(options[i], defaults[i]);
                    } else {
                        options[i] = defaults[i];
                    }
                }
            }
            return options;
        }
        function handleMock(options) {
            return !!(result.mocker && result.mocker.handle(options, Request));
        }
        for (i = 0; i < methodsLength; i += 1) {
            (function() {
                var method = methods[i];
                result[method] = function(url, success, error) {
                    var options = {};
                    if (url === undefined) {
                        throw new Error("CORS: url must be defined");
                    }
                    if (typeof url === "object") {
                        options = url;
                    } else {
                        if (typeof success === "function") {
                            options.success = success;
                        }
                        if (typeof error === "function") {
                            options.error = error;
                        }
                        options.url = url;
                    }
                    options.method = method.toUpperCase();
                    addDefaults(options, result.defaults);
                    if (result.handleMock(options)) {
                        return;
                    }
                    return new Request(options).xhr;
                };
            })();
        }
        result.mocker = null;
        result.handleMock = handleMock;
        result.defaults = {
            headers: {}
        };
        return result;
    });
    //! framework/src/utils/registry.js
    internal("framework.registry", [ "framework", "http" ], function(framework, http) {
        var url = "registry.json";
        var registry;
        framework.fire("registry::init");
        http.get({
            url: url,
            success: function(response) {
                registry = response.data;
                framework.fire("registry::ready", registry);
            }
        });
    });
    //! framework/src/utils/config.js
    internal("framework.config", [ "framework", "http" ], function(framework, http) {
        var url = "config.json";
        var config;
        framework.on("registry::ready", function(evt, registry) {
            framework.fire("config::init");
            http.get({
                url: url,
                success: function(response) {
                    config = response.data;
                    framework.fire("config::ready", config);
                }
            });
        });
    });
    //! node_modules/hbjs/src/utils/async/dispatcher.js
    internal("dispatcher", function() {
        var dispatcher = function(target, scope, map) {
            var listeners = {};
            function off(event, callback) {
                var index, list;
                list = listeners[event];
                if (list) {
                    if (callback) {
                        index = list.indexOf(callback);
                        if (index !== -1) {
                            list.splice(index, 1);
                        }
                    } else {
                        list.length = 0;
                    }
                }
            }
            function on(event, callback) {
                listeners[event] = listeners[event] || [];
                listeners[event].push(callback);
                return function() {
                    off(event, callback);
                };
            }
            function once(event, callback) {
                function fn() {
                    off(event, fn);
                    callback.apply(scope || target, arguments);
                }
                return on(event, fn);
            }
            function getListeners(event) {
                return listeners[event];
            }
            function fire(callback, args) {
                return callback && callback.apply(target, args);
            }
            function dispatch(event) {
                if (listeners[event]) {
                    var i = 0, list = listeners[event], len = list.length;
                    while (i < len) {
                        fire(list[i], arguments);
                        i += 1;
                    }
                }
                if (listeners.all && event !== "all") {
                    dispatch("all");
                }
            }
            if (scope && map) {
                target.on = scope[map.on] && scope[map.on].bind(scope);
                target.off = scope[map.off] && scope[map.off].bind(scope);
                target.once = scope[map.once] && scope[map.once].bind(scope);
                target.dispatch = target.fire = scope[map.dispatch].bind(scope);
            } else {
                target.on = on;
                target.off = off;
                target.once = once;
                target.dispatch = target.fire = dispatch;
            }
            target.getListeners = getListeners;
        };
        return dispatcher;
    });
    for (var name in cache) {
        resolve(name, cache[name]);
    }
})(this["hammer"] || {}, function() {
    return this;
}());