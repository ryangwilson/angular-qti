(function(exports, global) {
    global["hb"] = exports;
    var $$cache = {};
    var $$internals = {};
    var $$pending = {};
    var define = function(name) {
        var args = Array.prototype.slice.call(arguments);
        if (typeof args[1] === "function") {
            exports[name] = args[1]();
        } else {
            $$cache[name] = args[2];
            $$cache[name].$inject = args[1];
            $$cache[name].$internal = false;
        }
    };
    var internal = function(name) {
        var args = Array.prototype.slice.call(arguments);
        if (typeof args[1] === "function") {
            $$internals[name] = args[1]();
        } else {
            $$cache[name] = args[2];
            $$cache[name].$inject = args[1];
            $$cache[name].$internal = true;
        }
    };
    var resolve = function(name, fn) {
        $$pending[name] = true;
        var injections = fn.$inject;
        var args = [];
        var injectionName;
        for (var i in injections) {
            injectionName = injections[i];
            if ($$cache[injectionName]) {
                if ($$pending[injectionName]) {
                    throw new Error('Cyclical reference: "' + name + '" referencing "' + injectionName + '"');
                }
                resolve(injectionName, $$cache[injectionName]);
                delete $$cache[injectionName];
            }
        }
        if (!exports[name] && !$$internals[name]) {
            for (var n in injections) {
                injectionName = injections[n];
                args.push(exports[injectionName] || $$internals[injectionName]);
            }
            if (fn.$internal) {
                $$internals[name] = fn.apply(null, args);
            } else {
                exports[name] = fn.apply(null, args);
            }
        }
        delete $$pending[name];
    };
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
    define("dispatcher", function() {
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
    define("extend", [ "toArray" ], function(toArray) {
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
    define("toArray", [ "isArguments", "isArray", "isUndefined" ], function(isArguments, isArray, isUndefined) {
        var toArray = function(value) {
            if (isArguments) {
                return Array.prototype.slice.call(args, 0) || [];
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
    define("isArguments", function() {
        var isArguments = function(value) {
            return value && typeof value == "object" && typeof value.length == "number" && toString.call(value) == argsClass || false;
        };
        return isArguments;
    });
    define("isArray", function() {
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
    define("isUndefined", function() {
        var isUndefined = function(val) {
            return typeof val === "undefined";
        };
        return isUndefined;
    });
    define("resolve", function() {
        function Resolve(data) {
            this.data = data || {};
        }
        var proto = Resolve.prototype;
        proto.get = function(path, delimiter) {
            var arr = path.split(delimiter || "."), space = "", i = 0, len = arr.length;
            var data = this.data;
            while (i < len) {
                space = arr[i];
                data = data[space];
                if (data === undefined) {
                    break;
                }
                i += 1;
            }
            return data;
        };
        proto.set = function(path, value, delimiter) {
            var arr = path.split(delimiter || "."), space = "", i = 0, len = arr.length - 1;
            var data = this.data;
            while (i < len) {
                space = arr[i];
                if (data[space] === undefined) {
                    data = data[space] = {};
                } else {
                    data = data[space];
                }
                i += 1;
            }
            if (arr.length > 1) {
                data[arr.pop()] = value;
            }
            return this.data;
        };
        proto.path = function(path) {
            return this.set(path, {});
        };
        var resolve = function(data) {
            return new Resolve(data);
        };
        return resolve;
    });
    define("fromXML", function() {
        var strToXML = function(str) {
            var parser, xmlDoc;
            if (window.DOMParser) {
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(str, "text/xml");
            } else {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(str);
            }
            return xmlDoc;
        };
        var fromXML = function(node) {
            if (typeof node === "string") {
                node = strToXML(node).firstElementChild;
            }
            var data = {};
            function convertValue(value) {
                if (isNaN(value)) {
                    if (value === "true") {
                        return true;
                    }
                    if (value === "false") {
                        return false;
                    }
                    return value;
                }
                return Number(value);
            }
            function setValue(key, value) {
                if (data[key]) {
                    if (data[key].constructor !== Array) {
                        data[key] = [ data[key] ];
                    }
                    data[key][data[key].length] = convertValue(value);
                } else {
                    data[key] = convertValue(value);
                }
            }
            function setText(key, value) {
                data[key].text = value;
            }
            var c, cn;
            if (node.attributes) {
                for (c = 0; node.attributes[c]; c++) {
                    cn = node.attributes[c];
                    setValue(cn.name, cn.value);
                }
            }
            if (node.childNodes) {
                for (c = 0; node.childNodes[c]; c++) {
                    cn = node.childNodes[c];
                    if (cn.nodeType === 1) {
                        if (cn.childNodes.length === 1 && cn.firstChild.nodeType === 3) {
                            if (cn.attributes.length) {
                                setValue(cn.nodeName, fromXML(cn));
                                setText(cn.nodeName, cn.firstChild.nodeValue);
                            } else {
                                setValue(cn.nodeName, cn.firstChild.nodeValue);
                            }
                        } else {
                            setValue(cn.nodeName, fromXML(cn));
                        }
                    }
                }
            }
            return data;
        };
        return fromXML;
    });
    define("fromJson", function() {
        var fromJson = function(source, jsonObjectFormat) {
            if (typeof jsonObjectFormat === "undefined") {
                jsonObjectFormat = true;
            }
            var object_start = jsonObjectFormat ? "{" : "(";
            var object_end = jsonObjectFormat ? "}" : ")";
            var pair_seperator = jsonObjectFormat ? ":" : "=";
            var at = 0;
            var ch = " ";
            var escapee = {
                '"': '"',
                "\\": "\\",
                "/": "/",
                b: "\b",
                f: "\f",
                n: "\n",
                r: "\r",
                t: "	"
            };
            var text = source;
            var result = readValue();
            skipWhitespace();
            if (ch) {
                raiseError("Syntax error");
            }
            return result;
            function raiseError(m) {
                throw {
                    name: "SyntaxError",
                    message: m,
                    at: at,
                    text: text
                };
            }
            function next(c) {
                if (c && c !== ch) {
                    raiseError("Expected '" + c + "' instead of '" + ch + "'");
                }
                ch = text.charAt(at);
                at += 1;
                return ch;
            }
            function readString() {
                var s = "";
                if (ch === '"') {
                    while (next()) {
                        if (ch === '"') {
                            next();
                            return s;
                        }
                        if (ch === "\\") {
                            next();
                            if (ch === "u") {
                                var uffff = 0;
                                for (var i = 0; i < 4; i += 1) {
                                    var hex = parseInt(next(), 16);
                                    if (!isFinite(hex)) {
                                        break;
                                    }
                                    uffff = uffff * 16 + hex;
                                }
                                s += String.fromCharCode(uffff);
                            } else if (typeof escapee[ch] === "string") {
                                s += escapee[ch];
                            } else {
                                break;
                            }
                        } else {
                            s += ch;
                        }
                    }
                }
                raiseError("Bad string");
            }
            function skipWhitespace() {
                while (ch && ch <= " ") {
                    next();
                }
            }
            function readWord() {
                var s = "";
                while (allowedInWord()) {
                    s += ch;
                    next();
                }
                if (s === "true") {
                    return true;
                }
                if (s === "false") {
                    return false;
                }
                if (s === "null") {
                    return null;
                }
                if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/.test(s)) {
                    return parseFloat(s);
                }
                return s;
            }
            function readArray() {
                var array = [];
                if (ch === "[") {
                    next("[");
                    skipWhitespace();
                    if (ch === "]") {
                        next("]");
                        return array;
                    }
                    while (ch) {
                        array.push(readValue());
                        skipWhitespace();
                        if (ch === "]") {
                            next("]");
                            return array;
                        }
                        next(",");
                        skipWhitespace();
                    }
                }
                raiseError("Bad array");
            }
            function readObject() {
                var o = {};
                if (ch === object_start) {
                    next(object_start);
                    skipWhitespace();
                    if (ch === object_end) {
                        next(object_end);
                        return o;
                    }
                    while (ch) {
                        var key = ch === '"' ? readString() : readWord();
                        if (typeof key !== "string") {
                            raiseError("Bad object key: " + key);
                        }
                        skipWhitespace();
                        next(pair_seperator);
                        if (Object.hasOwnProperty.call(o, key)) {
                            raiseError('Duplicate key: "' + key + '"');
                        }
                        o[key] = readValue();
                        skipWhitespace();
                        if (ch === object_end) {
                            next(object_end);
                            return o;
                        }
                        next(",");
                        skipWhitespace();
                    }
                }
                raiseError("Bad object");
            }
            function readValue() {
                skipWhitespace();
                switch (ch) {
                  case object_start:
                    return readObject();

                  case "[":
                    return readArray();

                  case '"':
                    return readString();

                  default:
                    return readWord();
                }
            }
            function allowedInWord() {
                switch (ch) {
                  case '"':
                  case "\\":
                  case "	":
                  case "\n":
                  case "\r":
                  case ",":
                  case "[":
                  case "]":
                  case object_start:
                  case object_end:
                  case pair_seperator:
                    return false;
                }
                return ch > " ";
            }
        };
        return fromJson;
    });
    define("toXML", function() {
        var toXML = function(str) {
            var parser, xmlDoc;
            if (window.DOMParser) {
                parser = new DOMParser();
                xmlDoc = parser.parseFromString(str, "text/xml");
            } else {
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(str);
            }
            return xmlDoc;
        };
        return toXML;
    });
    for (var name in $$cache) {
        resolve(name, $$cache[name]);
    }
})({}, function() {
    return this;
}());