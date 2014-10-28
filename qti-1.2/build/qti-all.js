/*
* qti-1.2-engine 0.1.0
*/
angular.module("pearsonvue", []);

angular.module("pearsonvue").constant("PV_CONFIG", {});

angular.module("pearsonvue").directive("font", function() {
    return {
        restrict: "E",
        scope: true,
        link: function(scope, el, attr) {
            var size = attr.size;
            el[0].removeAttribute("size");
            el.css("fontSize", attr.size + "px");
        }
    };
});

angular.module("pearsonvue").directive("pearsonvueMatExtension", [ "$compile", "helpers", function($compile, helpers) {
    "use strict";
    var css = function(el, prop, value) {
        var styles = el.getAttribute("style") || "";
        styles += ";" + prop + ":" + value;
        el.setAttribute("style", styles);
    };
    var strToValue = function(type, value) {
        switch (type) {
          case "numeric":
            return Number((value + "").replace(/(\D+)/gim, ""));

          case "dictionary-case-insensitive":
            return value;

          case "asciibetical":
            return value;
        }
        return strToAscii(value + "");
    };
    var strToAscii = function(str) {
        var ascii = "";
        for (var i = 0; i < str.length; i++) {
            var asciiChar = str.charCodeAt(i);
            ascii += "&#" + asciiChar + ";";
        }
        return ascii;
    };
    var isNumber = function(n) {
        return n === parseFloat(n, 10);
    };
    return {
        restrict: "E",
        link: function(scope, el, attr) {
            var str, table, tableBorderWidth, i, colgroups, tbody, tds, tr, th, td, node, tableCells, col, row, linkFn, content, borderColor;
            scope.head = {};
            scope.body = [];
            scope.sort = {};
            scope.selectedCls = function(column) {
                if (column === scope.sort.column) {
                    if (scope.sort.reverse) {
                        return "fa fa-chevron-down";
                    } else {
                        return "fa fa-chevron-up";
                    }
                }
            };
            scope.changeSorting = function(column, rule) {
                if (rule) {
                    var sort = scope.sort;
                    if (sort.column === column) {
                        sort.reverse = !sort.reverse;
                    } else {
                        sort.column = column;
                        sort.reverse = false;
                    }
                }
            };
            scope.isEven = function(n) {
                return isNumber(n) && n % 2 === 0;
            };
            scope.isOdd = function(n) {
                return isNumber(n) && Math.abs(n) % 2 === 1;
            };
            str = el[0].innerHTML;
            var nthChild = str.match(/<nth-child(.|\n)*?nth-child>/gim);
            if (nthChild) {
                nthChild = helpers.strToXML(nthChild[0]).firstChild;
            }
            str = str.replace(/<nth-child(.|\n)*?nth-child>/gim, "");
            table = helpers.strToXML(str).firstChild;
            if (table.hasAttribute("border")) {
                tableBorderWidth = table.getAttribute("border") || "1";
            }
            borderColor = table.querySelector("thead tr").getAttribute("bgcolor") || "red";
            if (tableBorderWidth) {
                css(table, "border-width", tableBorderWidth + "px");
                table.removeAttribute("border");
                table.setAttribute("data-border", tableBorderWidth);
            }
            if (table.hasAttribute("cellspacing")) {
                var cellSpacing = (table.getAttribute("cellspacing") || 0) + "px";
                css(table, "border-spacing", cellSpacing);
            }
            if (table.hasAttribute("bgcolor")) {
                var bgColor = table.getAttribute("bgcolor");
                css(table, "background-color", bgColor);
            }
            css(table, "border-color", borderColor);
            colgroups = table.querySelectorAll("colgroup");
            th = table.querySelectorAll("th");
            td = table.querySelectorAll("td");
            tableCells = [];
            for (i = 0; i < td.length; i++) {
                tableCells.push(td[i].textContent);
                col = i % th.length;
                if (col === 0) {
                    row = {};
                    scope.body.push(row);
                }
                row["col_" + col] = {
                    width: colgroups[col].getAttribute("width"),
                    label: td[i].textContent,
                    value: strToValue(colgroups[col].getAttribute("sort_rule"), td[i].textContent),
                    rule: colgroups[col].getAttribute("sort_rule")
                };
            }
            var cellPadding = (table.getAttribute("cellpadding") || 0) + "px";
            for (i = 0; i < th.length; i++) {
                css(th[i], "padding", cellPadding);
                var rule = colgroups[i].getAttribute("sort_rule") || "";
                if (rule) {
                    th[i].setAttribute("ng-click", "changeSorting('col_" + i + ".value', '" + rule + "')");
                    th[i].insertAdjacentHTML("afterBegin", '<span class="sort-indicator" ng-class="selectedCls(\'col_' + i + ".value')\"></span>");
                }
            }
            tbody = table.querySelector("tbody");
            tr = table.querySelector("tbody tr");
            tr.setAttribute("ng-repeat", "row in body | orderBy:sort.column:sort.reverse");
            if (nthChild) {
                var count = nthChild.getAttribute("count");
                var rowColor = nthChild.getAttribute("bgcolor");
                switch (count) {
                  case "odd":
                    tr.setAttribute("ng-style", "{ background: (isOdd($index) && '" + rowColor + "' || 'none') }");
                    break;

                  case "even":
                    tr.setAttribute("ng-style", "{ background: (isEven($index) && '" + rowColor + "' || 'none') }");
                    break;

                  default:
                    tr.setAttribute("ng-style", "{ background: ($index == " + (count - 1) + " && '" + rowColor + "' || 'none') }");
                }
                console.log("nthChild", nthChild.getAttribute("count"));
            }
            tds = table.querySelectorAll("tbody > tr > td");
            for (i = 0; i < th.length; i += 1) {
                css(tds[i], "padding", cellPadding);
                node = tds[i];
                while (node.firstChild) {
                    node = node.firstChild;
                }
                node.nodeValue = "{{row.col_" + i + ".label}}";
            }
            tbody.innerHTML = tr.outerHTML;
            linkFn = $compile(table.outerHTML);
            content = linkFn(scope);
            el.empty();
            el.append(content);
        }
    };
} ]);

angular.module("pearsonvue").directive("pearsonvueObjectivesref", function() {
    return {
        restrict: "E",
        link: function(scope, el, attr) {}
    };
});

angular.module("pearsonvue").directive("pearsonvueScalefactor", function() {
    return {
        restrict: "E",
        link: function(scope, el, attr) {}
    };
});

if (document.getElementById && document.childNodes && document.createElement) {
    if (!(window.MathJax && MathJax.Hub)) {
        if (window.MathJax) {
            window.MathJax = {
                AuthorConfig: window.MathJax
            };
        } else {
            window.MathJax = {};
        }
        MathJax.isPacked = true;
        MathJax.version = "2.4.0";
        MathJax.fileversion = "2.4.0";
        MathJax.cdnVersion = "2.4-beta-2";
        MathJax.cdnFileVersions = {};
        (function(d) {
            var b = window[d];
            if (!b) {
                b = window[d] = {};
            }
            var e = [];
            var c = function(f) {
                var g = f.constructor;
                if (!g) {
                    g = function() {};
                }
                for (var h in f) {
                    if (h !== "constructor" && f.hasOwnProperty(h)) {
                        g[h] = f[h];
                    }
                }
                return g;
            };
            var a = function() {
                return function() {
                    return arguments.callee.Init.call(this, arguments);
                };
            };
            b.Object = c({
                constructor: a(),
                Subclass: function(f, h) {
                    var g = a();
                    g.SUPER = this;
                    g.Init = this.Init;
                    g.Subclass = this.Subclass;
                    g.Augment = this.Augment;
                    g.protoFunction = this.protoFunction;
                    g.can = this.can;
                    g.has = this.has;
                    g.isa = this.isa;
                    g.prototype = new this(e);
                    g.prototype.constructor = g;
                    g.Augment(f, h);
                    return g;
                },
                Init: function(f) {
                    var g = this;
                    if (f.length === 1 && f[0] === e) {
                        return g;
                    }
                    if (!(g instanceof f.callee)) {
                        g = new f.callee(e);
                    }
                    return g.Init.apply(g, f) || g;
                },
                Augment: function(f, g) {
                    var h;
                    if (f != null) {
                        for (h in f) {
                            if (f.hasOwnProperty(h)) {
                                this.protoFunction(h, f[h]);
                            }
                        }
                        if (f.toString !== this.prototype.toString && f.toString !== {}.toString) {
                            this.protoFunction("toString", f.toString);
                        }
                    }
                    if (g != null) {
                        for (h in g) {
                            if (g.hasOwnProperty(h)) {
                                this[h] = g[h];
                            }
                        }
                    }
                    return this;
                },
                protoFunction: function(g, f) {
                    this.prototype[g] = f;
                    if (typeof f === "function") {
                        f.SUPER = this.SUPER.prototype;
                    }
                },
                prototype: {
                    Init: function() {},
                    SUPER: function(f) {
                        return f.callee.SUPER;
                    },
                    can: function(f) {
                        return typeof this[f] === "function";
                    },
                    has: function(f) {
                        return typeof this[f] !== "undefined";
                    },
                    isa: function(f) {
                        return f instanceof Object && this instanceof f;
                    }
                },
                can: function(f) {
                    return this.prototype.can.call(this, f);
                },
                has: function(f) {
                    return this.prototype.has.call(this, f);
                },
                isa: function(g) {
                    var f = this;
                    while (f) {
                        if (f === g) {
                            return true;
                        } else {
                            f = f.SUPER;
                        }
                    }
                    return false;
                },
                SimpleSUPER: c({
                    constructor: function(f) {
                        return this.SimpleSUPER.define(f);
                    },
                    define: function(f) {
                        var h = {};
                        if (f != null) {
                            for (var g in f) {
                                if (f.hasOwnProperty(g)) {
                                    h[g] = this.wrap(g, f[g]);
                                }
                            }
                            if (f.toString !== this.prototype.toString && f.toString !== {}.toString) {
                                h.toString = this.wrap("toString", f.toString);
                            }
                        }
                        return h;
                    },
                    wrap: function(i, h) {
                        if (typeof h !== "function" || !h.toString().match(/\.\s*SUPER\s*\(/)) {
                            return h;
                        }
                        var g = function() {
                            this.SUPER = g.SUPER[i];
                            try {
                                var f = h.apply(this, arguments);
                            } catch (j) {
                                delete this.SUPER;
                                throw j;
                            }
                            delete this.SUPER;
                            return f;
                        };
                        g.toString = function() {
                            return h.toString.apply(h, arguments);
                        };
                        return g;
                    }
                })
            });
        })("MathJax");
        (function(BASENAME) {
            var BASE = window[BASENAME];
            if (!BASE) {
                BASE = window[BASENAME] = {};
            }
            var CALLBACK = function(data) {
                var cb = function() {
                    return arguments.callee.execute.apply(arguments.callee, arguments);
                };
                for (var id in CALLBACK.prototype) {
                    if (CALLBACK.prototype.hasOwnProperty(id)) {
                        if (typeof data[id] !== "undefined") {
                            cb[id] = data[id];
                        } else {
                            cb[id] = CALLBACK.prototype[id];
                        }
                    }
                }
                cb.toString = CALLBACK.prototype.toString;
                return cb;
            };
            CALLBACK.prototype = {
                isCallback: true,
                hook: function() {},
                data: [],
                object: window,
                execute: function() {
                    if (!this.called || this.autoReset) {
                        this.called = !this.autoReset;
                        return this.hook.apply(this.object, this.data.concat([].slice.call(arguments, 0)));
                    }
                },
                reset: function() {
                    delete this.called;
                },
                toString: function() {
                    return this.hook.toString.apply(this.hook, arguments);
                }
            };
            var ISCALLBACK = function(f) {
                return typeof f === "function" && f.isCallback;
            };
            var EVAL = function(code) {
                return eval.call(window, code);
            };
            var TESTEVAL = function() {
                EVAL("var __TeSt_VaR__ = 1");
                if (window.__TeSt_VaR__) {
                    try {
                        delete window.__TeSt_VaR__;
                    } catch (error) {
                        window.__TeSt_VaR__ = null;
                    }
                } else {
                    if (window.execScript) {
                        EVAL = function(code) {
                            BASE.__code = code;
                            code = "try {" + BASENAME + ".__result = eval(" + BASENAME + ".__code)} catch(err) {" + BASENAME + ".__result = err}";
                            window.execScript(code);
                            var result = BASE.__result;
                            delete BASE.__result;
                            delete BASE.__code;
                            if (result instanceof Error) {
                                throw result;
                            }
                            return result;
                        };
                    } else {
                        EVAL = function(code) {
                            BASE.__code = code;
                            code = "try {" + BASENAME + ".__result = eval(" + BASENAME + ".__code)} catch(err) {" + BASENAME + ".__result = err}";
                            var head = document.getElementsByTagName("head")[0];
                            if (!head) {
                                head = document.body;
                            }
                            var script = document.createElement("script");
                            script.appendChild(document.createTextNode(code));
                            head.appendChild(script);
                            head.removeChild(script);
                            var result = BASE.__result;
                            delete BASE.__result;
                            delete BASE.__code;
                            if (result instanceof Error) {
                                throw result;
                            }
                            return result;
                        };
                    }
                }
                TESTEVAL = null;
            };
            var USING = function(args, i) {
                if (arguments.length > 1) {
                    if (arguments.length === 2 && !(typeof arguments[0] === "function") && arguments[0] instanceof Object && typeof arguments[1] === "number") {
                        args = [].slice.call(args, i);
                    } else {
                        args = [].slice.call(arguments, 0);
                    }
                }
                if (args instanceof Array && args.length === 1) {
                    args = args[0];
                }
                if (typeof args === "function") {
                    if (args.execute === CALLBACK.prototype.execute) {
                        return args;
                    }
                    return CALLBACK({
                        hook: args
                    });
                } else {
                    if (args instanceof Array) {
                        if (typeof args[0] === "string" && args[1] instanceof Object && typeof args[1][args[0]] === "function") {
                            return CALLBACK({
                                hook: args[1][args[0]],
                                object: args[1],
                                data: args.slice(2)
                            });
                        } else {
                            if (typeof args[0] === "function") {
                                return CALLBACK({
                                    hook: args[0],
                                    data: args.slice(1)
                                });
                            } else {
                                if (typeof args[1] === "function") {
                                    return CALLBACK({
                                        hook: args[1],
                                        object: args[0],
                                        data: args.slice(2)
                                    });
                                }
                            }
                        }
                    } else {
                        if (typeof args === "string") {
                            if (TESTEVAL) {
                                TESTEVAL();
                            }
                            return CALLBACK({
                                hook: EVAL,
                                data: [ args ]
                            });
                        } else {
                            if (args instanceof Object) {
                                return CALLBACK(args);
                            } else {
                                if (typeof args === "undefined") {
                                    return CALLBACK({});
                                }
                            }
                        }
                    }
                }
                throw Error("Can't make callback from given data");
            };
            var DELAY = function(time, callback) {
                callback = USING(callback);
                callback.timeout = setTimeout(callback, time);
                return callback;
            };
            var WAITFOR = function(callback, signal) {
                callback = USING(callback);
                if (!callback.called) {
                    WAITSIGNAL(callback, signal);
                    signal.pending++;
                }
            };
            var WAITEXECUTE = function() {
                var signals = this.signal;
                delete this.signal;
                this.execute = this.oldExecute;
                delete this.oldExecute;
                var result = this.execute.apply(this, arguments);
                if (ISCALLBACK(result) && !result.called) {
                    WAITSIGNAL(result, signals);
                } else {
                    for (var i = 0, m = signals.length; i < m; i++) {
                        signals[i].pending--;
                        if (signals[i].pending <= 0) {
                            signals[i].call();
                        }
                    }
                }
            };
            var WAITSIGNAL = function(callback, signals) {
                if (!(signals instanceof Array)) {
                    signals = [ signals ];
                }
                if (!callback.signal) {
                    callback.oldExecute = callback.execute;
                    callback.execute = WAITEXECUTE;
                    callback.signal = signals;
                } else {
                    if (signals.length === 1) {
                        callback.signal.push(signals[0]);
                    } else {
                        callback.signal = callback.signal.concat(signals);
                    }
                }
            };
            var AFTER = function(callback) {
                callback = USING(callback);
                callback.pending = 0;
                for (var i = 1, m = arguments.length; i < m; i++) {
                    if (arguments[i]) {
                        WAITFOR(arguments[i], callback);
                    }
                }
                if (callback.pending === 0) {
                    var result = callback();
                    if (ISCALLBACK(result)) {
                        callback = result;
                    }
                }
                return callback;
            };
            var HOOKS = MathJax.Object.Subclass({
                Init: function(reset) {
                    this.hooks = [];
                    this.reset = reset;
                },
                Add: function(hook, priority) {
                    if (priority == null) {
                        priority = 10;
                    }
                    if (!ISCALLBACK(hook)) {
                        hook = USING(hook);
                    }
                    hook.priority = priority;
                    var i = this.hooks.length;
                    while (i > 0 && priority < this.hooks[i - 1].priority) {
                        i--;
                    }
                    this.hooks.splice(i, 0, hook);
                    return hook;
                },
                Remove: function(hook) {
                    for (var i = 0, m = this.hooks.length; i < m; i++) {
                        if (this.hooks[i] === hook) {
                            this.hooks.splice(i, 1);
                            return;
                        }
                    }
                },
                Execute: function() {
                    var callbacks = [ {} ];
                    for (var i = 0, m = this.hooks.length; i < m; i++) {
                        if (this.reset) {
                            this.hooks[i].reset();
                        }
                        var result = this.hooks[i].apply(window, arguments);
                        if (ISCALLBACK(result) && !result.called) {
                            callbacks.push(result);
                        }
                    }
                    if (callbacks.length === 1) {
                        return null;
                    }
                    if (callbacks.length === 2) {
                        return callbacks[1];
                    }
                    return AFTER.apply({}, callbacks);
                }
            });
            var EXECUTEHOOKS = function(hooks, data, reset) {
                if (!hooks) {
                    return null;
                }
                if (!(hooks instanceof Array)) {
                    hooks = [ hooks ];
                }
                if (!(data instanceof Array)) {
                    data = data == null ? [] : [ data ];
                }
                var handler = HOOKS(reset);
                for (var i = 0, m = hooks.length; i < m; i++) {
                    handler.Add(hooks[i]);
                }
                return handler.Execute.apply(handler, data);
            };
            var QUEUE = BASE.Object.Subclass({
                Init: function() {
                    this.pending = 0;
                    this.running = 0;
                    this.queue = [];
                    this.Push.apply(this, arguments);
                },
                Push: function() {
                    var callback;
                    for (var i = 0, m = arguments.length; i < m; i++) {
                        callback = USING(arguments[i]);
                        if (callback === arguments[i] && !callback.called) {
                            callback = USING([ "wait", this, callback ]);
                        }
                        this.queue.push(callback);
                    }
                    if (!this.running && !this.pending) {
                        this.Process();
                    }
                    return callback;
                },
                Process: function(queue) {
                    while (!this.running && !this.pending && this.queue.length) {
                        var callback = this.queue[0];
                        queue = this.queue.slice(1);
                        this.queue = [];
                        this.Suspend();
                        var result = callback();
                        this.Resume();
                        if (queue.length) {
                            this.queue = queue.concat(this.queue);
                        }
                        if (ISCALLBACK(result) && !result.called) {
                            WAITFOR(result, this);
                        }
                    }
                },
                Suspend: function() {
                    this.running++;
                },
                Resume: function() {
                    if (this.running) {
                        this.running--;
                    }
                },
                call: function() {
                    this.Process.apply(this, arguments);
                },
                wait: function(callback) {
                    return callback;
                }
            });
            var SIGNAL = QUEUE.Subclass({
                Init: function(name) {
                    QUEUE.prototype.Init.call(this);
                    this.name = name;
                    this.posted = [];
                    this.listeners = HOOKS(true);
                },
                Post: function(message, callback, forget) {
                    callback = USING(callback);
                    if (this.posting || this.pending) {
                        this.Push([ "Post", this, message, callback, forget ]);
                    } else {
                        this.callback = callback;
                        callback.reset();
                        if (!forget) {
                            this.posted.push(message);
                        }
                        this.Suspend();
                        this.posting = true;
                        var result = this.listeners.Execute(message);
                        if (ISCALLBACK(result) && !result.called) {
                            WAITFOR(result, this);
                        }
                        this.Resume();
                        delete this.posting;
                        if (!this.pending) {
                            this.call();
                        }
                    }
                    return callback;
                },
                Clear: function(callback) {
                    callback = USING(callback);
                    if (this.posting || this.pending) {
                        callback = this.Push([ "Clear", this, callback ]);
                    } else {
                        this.posted = [];
                        callback();
                    }
                    return callback;
                },
                call: function() {
                    this.callback(this);
                    this.Process();
                },
                Interest: function(callback, ignorePast, priority) {
                    callback = USING(callback);
                    this.listeners.Add(callback, priority);
                    if (!ignorePast) {
                        for (var i = 0, m = this.posted.length; i < m; i++) {
                            callback.reset();
                            var result = callback(this.posted[i]);
                            if (ISCALLBACK(result) && i === this.posted.length - 1) {
                                WAITFOR(result, this);
                            }
                        }
                    }
                    return callback;
                },
                NoInterest: function(callback) {
                    this.listeners.Remove(callback);
                },
                MessageHook: function(msg, callback, priority) {
                    callback = USING(callback);
                    if (!this.hooks) {
                        this.hooks = {};
                        this.Interest([ "ExecuteHooks", this ]);
                    }
                    if (!this.hooks[msg]) {
                        this.hooks[msg] = HOOKS(true);
                    }
                    this.hooks[msg].Add(callback, priority);
                    for (var i = 0, m = this.posted.length; i < m; i++) {
                        if (this.posted[i] == msg) {
                            callback.reset();
                            callback(this.posted[i]);
                        }
                    }
                    return callback;
                },
                ExecuteHooks: function(msg) {
                    var type = msg instanceof Array ? msg[0] : msg;
                    if (!this.hooks[type]) {
                        return null;
                    }
                    return this.hooks[type].Execute(msg);
                }
            }, {
                signals: {},
                find: function(name) {
                    if (!SIGNAL.signals[name]) {
                        SIGNAL.signals[name] = new SIGNAL(name);
                    }
                    return SIGNAL.signals[name];
                }
            });
            BASE.Callback = BASE.CallBack = USING;
            BASE.Callback.Delay = DELAY;
            BASE.Callback.After = AFTER;
            BASE.Callback.Queue = QUEUE;
            BASE.Callback.Signal = SIGNAL.find;
            BASE.Callback.Hooks = HOOKS;
            BASE.Callback.ExecuteHooks = EXECUTEHOOKS;
        })("MathJax");
        (function(e) {
            var a = window[e];
            if (!a) {
                a = window[e] = {};
            }
            var d = navigator.vendor === "Apple Computer, Inc." && typeof navigator.vendorSub === "undefined";
            var g = 0;
            var h = function(i) {
                if (document.styleSheets && document.styleSheets.length > g) {
                    g = document.styleSheets.length;
                }
                if (!i) {
                    i = document.getElementsByTagName("head")[0];
                    if (!i) {
                        i = document.body;
                    }
                }
                return i;
            };
            var f = [];
            var c = function() {
                for (var k = 0, j = f.length; k < j; k++) {
                    a.Ajax.head.removeChild(f[k]);
                }
                f = [];
            };
            var b = {};
            b[e] = "";
            a.Ajax = {
                loaded: {},
                loading: {},
                loadHooks: {},
                timeout: 15 * 1e3,
                styleDelay: 1,
                config: {
                    root: "",
                    path: b
                },
                STATUS: {
                    OK: 1,
                    ERROR: -1
                },
                fileURL: function(j) {
                    var i = j.match(/^\[([-._a-z0-9]+)\]/i);
                    if (i && i[1] in b) {
                        j = (b[i[1]] || this.config.root) + j.substr(i[1].length + 2);
                    }
                    return j;
                },
                fileName: function(j) {
                    var i = this.config.root;
                    if (j.substr(0, i.length) === i) {
                        j = "[" + e + "]" + j.substr(i.length);
                    } else {
                        for (var k in b) {
                            if (b.hasOwnProperty(k) && b[k]) {
                                if (j.substr(0, b[k].length) === b[k]) {
                                    j = "[" + k + "]" + j.substr(b[k].length);
                                    break;
                                }
                            }
                        }
                    }
                    return j;
                },
                fileRev: function(j) {
                    var i = a.cdnFileVersions[name] || a.cdnVersion;
                    if (i) {
                        i = "?rev=" + i;
                    }
                    return i;
                },
                urlRev: function(i) {
                    return this.fileURL(i) + this.fileRev(i);
                },
                Require: function(k, n) {
                    n = a.Callback(n);
                    var l;
                    if (k instanceof Object) {
                        for (var j in k) {
                            if (k.hasOwnProperty(j)) {
                                l = j.toUpperCase();
                                k = k[j];
                            }
                        }
                    } else {
                        l = k.split(/\./).pop().toUpperCase();
                    }
                    k = this.fileURL(k);
                    if (this.loaded[k]) {
                        n(this.loaded[k]);
                    } else {
                        var m = {};
                        m[l] = k;
                        this.Load(m, n);
                    }
                    return n;
                },
                Load: function(k, m) {
                    m = a.Callback(m);
                    var l;
                    if (k instanceof Object) {
                        for (var j in k) {
                            if (k.hasOwnProperty(j)) {
                                l = j.toUpperCase();
                                k = k[j];
                            }
                        }
                    } else {
                        l = k.split(/\./).pop().toUpperCase();
                    }
                    k = this.fileURL(k);
                    if (this.loading[k]) {
                        this.addHook(k, m);
                    } else {
                        this.head = h(this.head);
                        if (this.loader[l]) {
                            this.loader[l].call(this, k, m);
                        } else {
                            throw Error("Can't load files of type " + l);
                        }
                    }
                    return m;
                },
                LoadHook: function(l, m, k) {
                    m = a.Callback(m);
                    if (l instanceof Object) {
                        for (var j in l) {
                            if (l.hasOwnProperty(j)) {
                                l = l[j];
                            }
                        }
                    }
                    l = this.fileURL(l);
                    if (this.loaded[l]) {
                        m(this.loaded[l]);
                    } else {
                        this.addHook(l, m, k);
                    }
                    return m;
                },
                addHook: function(j, k, i) {
                    if (!this.loadHooks[j]) {
                        this.loadHooks[j] = MathJax.Callback.Hooks();
                    }
                    this.loadHooks[j].Add(k, i);
                },
                Preloading: function() {
                    for (var l = 0, j = arguments.length; l < j; l++) {
                        var k = this.fileURL(arguments[l]);
                        if (!this.loading[k]) {
                            this.loading[k] = {
                                preloaded: true
                            };
                        }
                    }
                },
                loader: {
                    JS: function(k, m) {
                        var j = this.fileName(k);
                        var i = document.createElement("script");
                        var l = a.Callback([ "loadTimeout", this, k ]);
                        this.loading[k] = {
                            callback: m,
                            timeout: setTimeout(l, this.timeout),
                            status: this.STATUS.OK,
                            script: i
                        };
                        this.loading[k].message = a.Message.File(j);
                        i.onerror = l;
                        i.type = "text/javascript";
                        i.src = k + this.fileRev(j);
                        this.head.appendChild(i);
                    },
                    CSS: function(j, l) {
                        var i = this.fileName(j);
                        var k = document.createElement("link");
                        k.rel = "stylesheet";
                        k.type = "text/css";
                        k.href = j + this.fileRev(i);
                        this.loading[j] = {
                            callback: l,
                            message: a.Message.File(i),
                            status: this.STATUS.OK
                        };
                        this.head.appendChild(k);
                        this.timer.create.call(this, [ this.timer.file, j ], k);
                    }
                },
                timer: {
                    create: function(j, i) {
                        j = a.Callback(j);
                        if (i.nodeName === "STYLE" && i.styleSheet && typeof i.styleSheet.cssText !== "undefined") {
                            j(this.STATUS.OK);
                        } else {
                            if (window.chrome && i.nodeName === "LINK") {
                                j(this.STATUS.OK);
                            } else {
                                if (d) {
                                    this.timer.start(this, [ this.timer.checkSafari2, g++, j ], this.styleDelay);
                                } else {
                                    this.timer.start(this, [ this.timer.checkLength, i, j ], this.styleDelay);
                                }
                            }
                        }
                        return j;
                    },
                    start: function(j, i, k, l) {
                        i = a.Callback(i);
                        i.execute = this.execute;
                        i.time = this.time;
                        i.STATUS = j.STATUS;
                        i.timeout = l || j.timeout;
                        i.delay = i.total = k || 0;
                        if (k) {
                            setTimeout(i, k);
                        } else {
                            i();
                        }
                    },
                    time: function(i) {
                        this.total += this.delay;
                        this.delay = Math.floor(this.delay * 1.05 + 5);
                        if (this.total >= this.timeout) {
                            i(this.STATUS.ERROR);
                            return 1;
                        }
                        return 0;
                    },
                    file: function(j, i) {
                        if (i < 0) {
                            a.Ajax.loadTimeout(j);
                        } else {
                            a.Ajax.loadComplete(j);
                        }
                    },
                    execute: function() {
                        this.hook.call(this.object, this, this.data[0], this.data[1]);
                    },
                    checkSafari2: function(i, j, k) {
                        if (i.time(k)) {
                            return;
                        }
                        if (document.styleSheets.length > j && document.styleSheets[j].cssRules && document.styleSheets[j].cssRules.length) {
                            k(i.STATUS.OK);
                        } else {
                            setTimeout(i, i.delay);
                        }
                    },
                    checkLength: function(i, l, n) {
                        if (i.time(n)) {
                            return;
                        }
                        var m = 0;
                        var j = l.sheet || l.styleSheet;
                        try {
                            if ((j.cssRules || j.rules || []).length > 0) {
                                m = 1;
                            }
                        } catch (k) {
                            if (k.message.match(/protected variable|restricted URI/)) {
                                m = 1;
                            } else {
                                if (k.message.match(/Security error/)) {
                                    m = 1;
                                }
                            }
                        }
                        if (m) {
                            setTimeout(a.Callback([ n, i.STATUS.OK ]), 0);
                        } else {
                            setTimeout(i, i.delay);
                        }
                    }
                },
                loadComplete: function(i) {
                    i = this.fileURL(i);
                    var j = this.loading[i];
                    if (j && !j.preloaded) {
                        a.Message.Clear(j.message);
                        clearTimeout(j.timeout);
                        if (j.script) {
                            if (f.length === 0) {
                                setTimeout(c, 0);
                            }
                            f.push(j.script);
                        }
                        this.loaded[i] = j.status;
                        delete this.loading[i];
                        this.addHook(i, j.callback);
                    } else {
                        if (j) {
                            delete this.loading[i];
                        }
                        this.loaded[i] = this.STATUS.OK;
                        j = {
                            status: this.STATUS.OK
                        };
                    }
                    if (!this.loadHooks[i]) {
                        return null;
                    }
                    return this.loadHooks[i].Execute(j.status);
                },
                loadTimeout: function(i) {
                    if (this.loading[i].timeout) {
                        clearTimeout(this.loading[i].timeout);
                    }
                    this.loading[i].status = this.STATUS.ERROR;
                    this.loadError(i);
                    this.loadComplete(i);
                },
                loadError: function(i) {
                    a.Message.Set([ "LoadFailed", "File failed to load: %1", i ], null, 2e3);
                    a.Hub.signal.Post([ "file load error", i ]);
                },
                Styles: function(k, l) {
                    var i = this.StyleString(k);
                    if (i === "") {
                        l = a.Callback(l);
                        l();
                    } else {
                        var j = document.createElement("style");
                        j.type = "text/css";
                        this.head = h(this.head);
                        this.head.appendChild(j);
                        if (j.styleSheet && typeof j.styleSheet.cssText !== "undefined") {
                            j.styleSheet.cssText = i;
                        } else {
                            j.appendChild(document.createTextNode(i));
                        }
                        l = this.timer.create.call(this, l, j);
                    }
                    return l;
                },
                StyleString: function(n) {
                    if (typeof n === "string") {
                        return n;
                    }
                    var k = "", o, m;
                    for (o in n) {
                        if (n.hasOwnProperty(o)) {
                            if (typeof n[o] === "string") {
                                k += o + " {" + n[o] + "}\n";
                            } else {
                                if (n[o] instanceof Array) {
                                    for (var l = 0; l < n[o].length; l++) {
                                        m = {};
                                        m[o] = n[o][l];
                                        k += this.StyleString(m);
                                    }
                                } else {
                                    if (o.substr(0, 6) === "@media") {
                                        k += o + " {" + this.StyleString(n[o]) + "}\n";
                                    } else {
                                        if (n[o] != null) {
                                            m = [];
                                            for (var j in n[o]) {
                                                if (n[o].hasOwnProperty(j)) {
                                                    if (n[o][j] != null) {
                                                        m[m.length] = j + ": " + n[o][j];
                                                    }
                                                }
                                            }
                                            k += o + " {" + m.join("; ") + "}\n";
                                        }
                                    }
                                }
                            }
                        }
                    }
                    return k;
                }
            };
        })("MathJax");
        MathJax.HTML = {
            Element: function(c, e, d) {
                var f = document.createElement(c);
                if (e) {
                    if (e.style) {
                        var b = e.style;
                        e.style = {};
                        for (var g in b) {
                            if (b.hasOwnProperty(g)) {
                                e.style[g.replace(/-([a-z])/g, this.ucMatch)] = b[g];
                            }
                        }
                    }
                    MathJax.Hub.Insert(f, e);
                }
                if (d) {
                    if (!(d instanceof Array)) {
                        d = [ d ];
                    }
                    for (var a = 0; a < d.length; a++) {
                        if (d[a] instanceof Array) {
                            f.appendChild(this.Element(d[a][0], d[a][1], d[a][2]));
                        } else {
                            if (c === "script") {
                                this.setScript(f, d[a]);
                            } else {
                                f.appendChild(document.createTextNode(d[a]));
                            }
                        }
                    }
                }
                return f;
            },
            ucMatch: function(a, b) {
                return b.toUpperCase();
            },
            addElement: function(b, a, d, c) {
                return b.appendChild(this.Element(a, d, c));
            },
            TextNode: function(a) {
                return document.createTextNode(a);
            },
            addText: function(a, b) {
                return a.appendChild(this.TextNode(b));
            },
            setScript: function(a, b) {
                if (this.setScriptBug) {
                    a.text = b;
                } else {
                    while (a.firstChild) {
                        a.removeChild(a.firstChild);
                    }
                    this.addText(a, b);
                }
            },
            getScript: function(a) {
                var b = a.text === "" ? a.innerHTML : a.text;
                return b.replace(/^\s+/, "").replace(/\s+$/, "");
            },
            Cookie: {
                prefix: "mjx",
                expires: 365,
                Set: function(a, e) {
                    var d = [];
                    if (e) {
                        for (var g in e) {
                            if (e.hasOwnProperty(g)) {
                                d.push(g + ":" + e[g].toString().replace(/&/g, "&&"));
                            }
                        }
                    }
                    var b = this.prefix + "." + a + "=" + escape(d.join("&;"));
                    if (this.expires) {
                        var f = new Date();
                        f.setDate(f.getDate() + this.expires);
                        b += "; expires=" + f.toGMTString();
                    }
                    try {
                        document.cookie = b + "; path=/";
                    } catch (c) {}
                },
                Get: function(a, d) {
                    if (!d) {
                        d = {};
                    }
                    var g = new RegExp("(?:^|;\\s*)" + this.prefix + "\\." + a + "=([^;]*)(?:;|$)");
                    var f;
                    try {
                        f = g.exec(document.cookie);
                    } catch (c) {}
                    if (f && f[1] !== "") {
                        var j = unescape(f[1]).split("&;");
                        for (var e = 0, b = j.length; e < b; e++) {
                            f = j[e].match(/([^:]+):(.*)/);
                            var h = f[2].replace(/&&/g, "&");
                            if (h === "true") {
                                h = true;
                            } else {
                                if (h === "false") {
                                    h = false;
                                } else {
                                    if (h.match(/^-?(\d+(\.\d+)?|\.\d+)$/)) {
                                        h = parseFloat(h);
                                    }
                                }
                            }
                            d[f[1]] = h;
                        }
                    }
                    return d;
                }
            }
        };
        MathJax.Localization = {
            locale: "en",
            directory: "[MathJax]/localization",
            strings: {
                ast: {
                    menuTitle: "asturianu"
                },
                br: {
                    menuTitle: "brezhoneg"
                },
                ca: {
                    menuTitle: "català"
                },
                cdo: {
                    menuTitle: "Mìng-dĕ̤ng-ngṳ̄"
                },
                cs: {
                    menuTitle: "čeština"
                },
                da: {
                    menuTitle: "dansk"
                },
                de: {
                    menuTitle: "Deutsch"
                },
                en: {
                    menuTitle: "English",
                    isLoaded: true
                },
                eo: {
                    menuTitle: "Esperanto"
                },
                es: {
                    menuTitle: "español"
                },
                fa: {
                    menuTitle: "فارسی"
                },
                fi: {
                    menuTitle: "suomi"
                },
                fr: {
                    menuTitle: "français"
                },
                gl: {
                    menuTitle: "galego"
                },
                he: {
                    menuTitle: "עברית"
                },
                ia: {
                    menuTitle: "interlingua"
                },
                it: {
                    menuTitle: "italiano"
                },
                ja: {
                    menuTitle: "日本語"
                },
                kn: {
                    menuTitle: "ಕನ್ನಡ"
                },
                ko: {
                    menuTitle: "한국어"
                },
                lb: {
                    menuTitle: "Lëtzebuergesch"
                },
                mk: {
                    menuTitle: "македонски"
                },
                nl: {
                    menuTitle: "Nederlands"
                },
                oc: {
                    menuTitle: "occitan"
                },
                pl: {
                    menuTitle: "polski"
                },
                pt: {
                    menuTitle: "portugusê"
                },
                "pt-br": {
                    menuTitle: "português do Brasil"
                },
                ru: {
                    menuTitle: "русский"
                },
                sl: {
                    menuTitle: "slovenščina"
                },
                sv: {
                    menuTitle: "svenska"
                },
                tr: {
                    menuTitle: "Türkçe"
                },
                uk: {
                    menuTitle: "українська"
                },
                vi: {
                    menuTitle: "Tiếng Việt"
                },
                "zh-hans": {
                    menuTitle: "中文（简体）"
                }
            },
            pattern: /%(\d+|\{\d+\}|\{[a-z]+:\%\d+(?:\|(?:%\{\d+\}|%.|[^\}])*)+\}|.)/g,
            SPLIT: "axb".split(/(x)/).length === 3 ? function(a, b) {
                return a.split(b);
            } : function(c, e) {
                var a = [], b, d = 0;
                e.lastIndex = 0;
                while (b = e.exec(c)) {
                    a.push(c.substr(d, b.index - d));
                    a.push.apply(a, b.slice(1));
                    d = b.index + b[0].length;
                }
                a.push(c.substr(d));
                return a;
            },
            _: function(b, a) {
                if (a instanceof Array) {
                    return this.processSnippet(b, a);
                }
                return this.processString(this.lookupPhrase(b, a), [].slice.call(arguments, 2));
            },
            processString: function(l, o, g) {
                var j, e;
                for (j = 0, e = o.length; j < e; j++) {
                    if (g && o[j] instanceof Array) {
                        o[j] = this.processSnippet(g, o[j]);
                    }
                }
                var f = this.SPLIT(l, this.pattern);
                for (j = 1, e = f.length; j < e; j += 2) {
                    var p = f[j].charAt(0);
                    if (p >= "0" && p <= "9") {
                        f[j] = o[f[j] - 1];
                        if (typeof f[j] === "number") {
                            f[j] = this.number(f[j]);
                        }
                    } else {
                        if (p === "{") {
                            p = f[j].substr(1);
                            if (p >= "0" && p <= "9") {
                                f[j] = o[f[j].substr(1, f[j].length - 2) - 1];
                                if (typeof f[j] === "number") {
                                    f[j] = this.number(f[j]);
                                }
                            } else {
                                var k = f[j].match(/^\{([a-z]+):%(\d+)\|(.*)\}$/);
                                if (k) {
                                    if (k[1] === "plural") {
                                        var d = o[k[2] - 1];
                                        if (typeof d === "undefined") {
                                            f[j] = "???";
                                        } else {
                                            d = this.plural(d) - 1;
                                            var h = k[3].replace(/(^|[^%])(%%)*%\|/g, "$1$2%").split(/\|/);
                                            if (d >= 0 && d < h.length) {
                                                f[j] = this.processString(h[d].replace(/\uEFEF/g, "|"), o, g);
                                            } else {
                                                f[j] = "???";
                                            }
                                        }
                                    } else {
                                        f[j] = "%" + f[j];
                                    }
                                }
                            }
                        }
                    }
                    if (f[j] == null) {
                        f[j] = "???";
                    }
                }
                if (!g) {
                    return f.join("");
                }
                var a = [], b = "";
                for (j = 0; j < e; j++) {
                    b += f[j];
                    j++;
                    if (j < e) {
                        if (f[j] instanceof Array) {
                            a.push(b);
                            a = a.concat(f[j]);
                            b = "";
                        } else {
                            b += f[j];
                        }
                    }
                }
                if (b !== "") {
                    a.push(b);
                }
                return a;
            },
            processSnippet: function(g, e) {
                var c = [];
                for (var d = 0, b = e.length; d < b; d++) {
                    if (e[d] instanceof Array) {
                        var f = e[d];
                        if (typeof f[1] === "string") {
                            var h = f[0];
                            if (!(h instanceof Array)) {
                                h = [ g, h ];
                            }
                            var a = this.lookupPhrase(h, f[1]);
                            c = c.concat(this.processMarkdown(a, f.slice(2), g));
                        } else {
                            if (f[1] instanceof Array) {
                                c = c.concat(this.processSnippet.apply(this, f));
                            } else {
                                if (f.length >= 3) {
                                    c.push([ f[0], f[1], this.processSnippet(g, f[2]) ]);
                                } else {
                                    c.push(e[d]);
                                }
                            }
                        }
                    } else {
                        c.push(e[d]);
                    }
                }
                return c;
            },
            markdownPattern: /(%.)|(\*{1,3})((?:%.|.)+?)\2|(`+)((?:%.|.)+?)\4|\[((?:%.|.)+?)\]\(([^\s\)]+)\)/,
            processMarkdown: function(b, h, d) {
                var j = [], e;
                var c = b.split(this.markdownPattern);
                var g = c[0];
                for (var f = 1, a = c.length; f < a; f += 8) {
                    if (c[f + 1]) {
                        e = this.processString(c[f + 2], h, d);
                        if (!(e instanceof Array)) {
                            e = [ e ];
                        }
                        e = [ [ "b", "i", "i" ][c[f + 1].length - 1], {}, e ];
                        if (c[f + 1].length === 3) {
                            e = [ "b", {}, e ];
                        }
                    } else {
                        if (c[f + 3]) {
                            e = this.processString(c[f + 4].replace(/^\s/, "").replace(/\s$/, ""), h, d);
                            if (!(e instanceof Array)) {
                                e = [ e ];
                            }
                            e = [ "code", {}, e ];
                        } else {
                            if (c[f + 5]) {
                                e = this.processString(c[f + 5], h, d);
                                if (!(e instanceof Array)) {
                                    e = [ e ];
                                }
                                e = [ "a", {
                                    href: this.processString(c[f + 6], h),
                                    target: "_blank"
                                }, e ];
                            } else {
                                g += c[f];
                                e = null;
                            }
                        }
                    }
                    if (e) {
                        j = this.concatString(j, g, h, d);
                        j.push(e);
                        g = "";
                    }
                    if (c[f + 7] !== "") {
                        g += c[f + 7];
                    }
                }
                j = this.concatString(j, g, h, d);
                return j;
            },
            concatString: function(a, c, b, d) {
                if (c != "") {
                    c = this.processString(c, b, d);
                    if (!(c instanceof Array)) {
                        c = [ c ];
                    }
                    a = a.concat(c);
                }
                return a;
            },
            lookupPhrase: function(f, a, d) {
                if (!d) {
                    d = "_";
                }
                if (f instanceof Array) {
                    d = f[0] || "_";
                    f = f[1] || "";
                }
                var c = this.loadDomain(d);
                if (c) {
                    MathJax.Hub.RestartAfter(c);
                }
                var b = this.strings[this.locale];
                if (b) {
                    if (b.domains && d in b.domains) {
                        var e = b.domains[d];
                        if (e.strings && f in e.strings) {
                            a = e.strings[f];
                        }
                    }
                }
                return a;
            },
            loadFile: function(b, d, e) {
                e = MathJax.Callback(e);
                b = d.file || b;
                if (!b.match(/\.js$/)) {
                    b += ".js";
                }
                if (!b.match(/^([a-z]+:|\[MathJax\])/)) {
                    var a = this.strings[this.locale].directory || this.directory + "/" + this.locale || "[MathJax]/localization/" + this.locale;
                    b = a + "/" + b;
                }
                var c = MathJax.Ajax.Require(b, function() {
                    d.isLoaded = true;
                    return e();
                });
                return c.called ? null : c;
            },
            loadDomain: function(c, e) {
                var b, a = this.strings[this.locale];
                if (a) {
                    if (!a.isLoaded) {
                        b = this.loadFile(this.locale, a);
                        if (b) {
                            return MathJax.Callback.Queue(b, [ "loadDomain", this, c ]).Push(e || {});
                        }
                    }
                    if (a.domains && c in a.domains) {
                        var d = a.domains[c];
                        if (!d.isLoaded) {
                            b = this.loadFile(c, d);
                            if (b) {
                                return MathJax.Callback.Queue(b).Push(e);
                            }
                        }
                    }
                }
                return MathJax.Callback(e)();
            },
            Try: function(a) {
                a = MathJax.Callback(a);
                a.autoReset = true;
                try {
                    a();
                } catch (b) {
                    if (!b.restart) {
                        throw b;
                    }
                    MathJax.Callback.After([ "Try", this, a ], b.restart);
                }
            },
            resetLocale: function(a) {
                if (!a) {
                    return;
                }
                a = a.toLowerCase();
                while (!this.strings[a]) {
                    var c = a.lastIndexOf("-");
                    if (c === -1) {
                        return;
                    }
                    a = a.substring(0, c);
                }
                var b = this.strings[a].remap;
                this.locale = b ? b : a;
            },
            setLocale: function(a) {
                this.resetLocale(a);
                if (MathJax.Menu) {
                    this.loadDomain("MathMenu");
                }
            },
            addTranslation: function(b, e, c) {
                var d = this.strings[b], a = false;
                if (!d) {
                    d = this.strings[b] = {};
                    a = true;
                }
                if (!d.domains) {
                    d.domains = {};
                }
                if (e) {
                    if (!d.domains[e]) {
                        d.domains[e] = {};
                    }
                    d = d.domains[e];
                }
                MathJax.Hub.Insert(d, c);
                if (a && MathJax.Menu.menu) {
                    MathJax.Menu.CreateLocaleMenu();
                }
            },
            setCSS: function(b) {
                var a = this.strings[this.locale];
                if (a) {
                    if (a.fontFamily) {
                        b.style.fontFamily = a.fontFamily;
                    }
                    if (a.fontDirection) {
                        b.style.direction = a.fontDirection;
                        if (a.fontDirection === "rtl") {
                            b.style.textAlign = "right";
                        }
                    }
                }
                return b;
            },
            fontFamily: function() {
                var a = this.strings[this.locale];
                return a ? a.fontFamily : null;
            },
            fontDirection: function() {
                var a = this.strings[this.locale];
                return a ? a.fontDirection : null;
            },
            plural: function(b) {
                var a = this.strings[this.locale];
                if (a && a.plural) {
                    return a.plural(b);
                }
                if (b == 1) {
                    return 1;
                }
                return 2;
            },
            number: function(b) {
                var a = this.strings[this.locale];
                if (a && a.number) {
                    return a.number(b);
                }
                return b;
            }
        };
        MathJax.Message = {
            ready: false,
            log: [ {} ],
            current: null,
            textNodeBug: navigator.vendor === "Apple Computer, Inc." && typeof navigator.vendorSub === "undefined" || window.hasOwnProperty && window.hasOwnProperty("konqueror"),
            styles: {
                "#MathJax_Message": {
                    position: "fixed",
                    left: "1px",
                    bottom: "2px",
                    "background-color": "#E6E6E6",
                    border: "1px solid #959595",
                    margin: "0px",
                    padding: "2px 8px",
                    "z-index": "102",
                    color: "black",
                    "font-size": "80%",
                    width: "auto",
                    "white-space": "nowrap"
                },
                "#MathJax_MSIE_Frame": {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "0px",
                    "z-index": 101,
                    border: "0px",
                    margin: "0px",
                    padding: "0px"
                }
            },
            browsers: {
                MSIE: function(a) {
                    MathJax.Message.msieFixedPositionBug = (document.documentMode || 0) < 7;
                    if (MathJax.Message.msieFixedPositionBug) {
                        MathJax.Hub.config.styles["#MathJax_Message"].position = "absolute";
                    }
                    MathJax.Message.quirks = document.compatMode === "BackCompat";
                },
                Chrome: function(a) {
                    MathJax.Hub.config.styles["#MathJax_Message"].bottom = "1.5em";
                    MathJax.Hub.config.styles["#MathJax_Message"].left = "1em";
                }
            },
            Init: function(a) {
                if (a) {
                    this.ready = true;
                }
                if (!document.body || !this.ready) {
                    return false;
                }
                if (this.div && this.div.parentNode == null) {
                    this.div = document.getElementById("MathJax_Message");
                    if (this.div) {
                        this.text = this.div.firstChild;
                    }
                }
                if (!this.div) {
                    var b = document.body;
                    if (this.msieFixedPositionBug && window.attachEvent) {
                        b = this.frame = this.addDiv(document.body);
                        b.removeAttribute("id");
                        b.style.position = "absolute";
                        b.style.border = b.style.margin = b.style.padding = "0px";
                        b.style.zIndex = "101";
                        b.style.height = "0px";
                        b = this.addDiv(b);
                        b.id = "MathJax_MSIE_Frame";
                        window.attachEvent("onscroll", this.MoveFrame);
                        window.attachEvent("onresize", this.MoveFrame);
                        this.MoveFrame();
                    }
                    this.div = this.addDiv(b);
                    this.div.style.display = "none";
                    this.text = this.div.appendChild(document.createTextNode(""));
                }
                return true;
            },
            addDiv: function(a) {
                var b = document.createElement("div");
                b.id = "MathJax_Message";
                if (a.firstChild) {
                    a.insertBefore(b, a.firstChild);
                } else {
                    a.appendChild(b);
                }
                return b;
            },
            MoveFrame: function() {
                var a = MathJax.Message.quirks ? document.body : document.documentElement;
                var b = MathJax.Message.frame;
                b.style.left = a.scrollLeft + "px";
                b.style.top = a.scrollTop + "px";
                b.style.width = a.clientWidth + "px";
                b = b.firstChild;
                b.style.height = a.clientHeight + "px";
            },
            localize: function(a) {
                return MathJax.Localization._(a, a);
            },
            filterText: function(a, c, b) {
                if (MathJax.Hub.config.messageStyle === "simple") {
                    if (b === "LoadFile") {
                        if (!this.loading) {
                            this.loading = this.localize("Loading") + " ";
                        }
                        a = this.loading;
                        this.loading += ".";
                    } else {
                        if (b === "ProcessMath") {
                            if (!this.processing) {
                                this.processing = this.localize("Processing") + " ";
                            }
                            a = this.processing;
                            this.processing += ".";
                        } else {
                            if (b === "TypesetMath") {
                                if (!this.typesetting) {
                                    this.typesetting = this.localize("Typesetting") + " ";
                                }
                                a = this.typesetting;
                                this.typesetting += ".";
                            }
                        }
                    }
                }
                return a;
            },
            Set: function(c, e, b) {
                if (e == null) {
                    e = this.log.length;
                    this.log[e] = {};
                }
                var d = "";
                if (c instanceof Array) {
                    d = c[0];
                    if (d instanceof Array) {
                        d = d[1];
                    }
                    try {
                        c = MathJax.Localization._.apply(MathJax.Localization, c);
                    } catch (a) {
                        if (!a.restart) {
                            throw a;
                        }
                        if (!a.restart.called) {
                            if (this.log[e].restarted == null) {
                                this.log[e].restarted = 0;
                            }
                            this.log[e].restarted++;
                            delete this.log[e].cleared;
                            MathJax.Callback.After([ "Set", this, c, e, b ], a.restart);
                            return e;
                        }
                    }
                }
                if (this.timer) {
                    clearTimeout(this.timer);
                    delete this.timer;
                }
                this.log[e].text = c;
                this.log[e].filteredText = c = this.filterText(c, e, d);
                if (typeof this.log[e].next === "undefined") {
                    this.log[e].next = this.current;
                    if (this.current != null) {
                        this.log[this.current].prev = e;
                    }
                    this.current = e;
                }
                if (this.current === e && MathJax.Hub.config.messageStyle !== "none") {
                    if (this.Init()) {
                        if (this.textNodeBug) {
                            this.div.innerHTML = c;
                        } else {
                            this.text.nodeValue = c;
                        }
                        this.div.style.display = "";
                        if (this.status) {
                            window.status = "";
                            delete this.status;
                        }
                    } else {
                        window.status = c;
                        this.status = true;
                    }
                }
                if (this.log[e].restarted) {
                    if (this.log[e].cleared) {
                        b = 0;
                    }
                    if (--this.log[e].restarted === 0) {
                        delete this.log[e].cleared;
                    }
                }
                if (b) {
                    setTimeout(MathJax.Callback([ "Clear", this, e ]), b);
                } else {
                    if (b == 0) {
                        this.Clear(e, 0);
                    }
                }
                return e;
            },
            Clear: function(b, a) {
                if (this.log[b].prev != null) {
                    this.log[this.log[b].prev].next = this.log[b].next;
                }
                if (this.log[b].next != null) {
                    this.log[this.log[b].next].prev = this.log[b].prev;
                }
                if (this.current === b) {
                    this.current = this.log[b].next;
                    if (this.text) {
                        if (this.div.parentNode == null) {
                            this.Init();
                        }
                        if (this.current == null) {
                            if (this.timer) {
                                clearTimeout(this.timer);
                                delete this.timer;
                            }
                            if (a == null) {
                                a = 600;
                            }
                            if (a === 0) {
                                this.Remove();
                            } else {
                                this.timer = setTimeout(MathJax.Callback([ "Remove", this ]), a);
                            }
                        } else {
                            if (MathJax.Hub.config.messageStyle !== "none") {
                                if (this.textNodeBug) {
                                    this.div.innerHTML = this.log[this.current].filteredText;
                                } else {
                                    this.text.nodeValue = this.log[this.current].filteredText;
                                }
                            }
                        }
                        if (this.status) {
                            window.status = "";
                            delete this.status;
                        }
                    } else {
                        if (this.status) {
                            window.status = this.current == null ? "" : this.log[this.current].text;
                        }
                    }
                }
                delete this.log[b].next;
                delete this.log[b].prev;
                delete this.log[b].filteredText;
                if (this.log[b].restarted) {
                    this.log[b].cleared = true;
                }
            },
            Remove: function() {
                this.text.nodeValue = "";
                this.div.style.display = "none";
            },
            File: function(a) {
                return this.Set([ "LoadFile", "Loading %1", a ], null, null);
            },
            Log: function() {
                var b = [];
                for (var c = 1, a = this.log.length; c < a; c++) {
                    b[c] = this.log[c].text;
                }
                return b.join("\n");
            }
        };
        MathJax.Hub = {
            config: {
                root: "",
                config: [],
                styleSheets: [],
                styles: {
                    ".MathJax_Preview": {
                        color: "#888"
                    }
                },
                jax: [],
                extensions: [],
                preJax: null,
                postJax: null,
                displayAlign: "center",
                displayIndent: "0",
                preRemoveClass: "MathJax_Preview",
                showProcessingMessages: true,
                messageStyle: "normal",
                delayStartupUntil: "none",
                skipStartupTypeset: false,
                elements: [],
                positionToHash: true,
                showMathMenu: true,
                showMathMenuMSIE: true,
                menuSettings: {
                    zoom: "None",
                    CTRL: false,
                    ALT: false,
                    CMD: false,
                    Shift: false,
                    discoverable: false,
                    zscale: "200%",
                    renderer: "",
                    font: "Auto",
                    context: "MathJax",
                    locale: "en",
                    mpContext: false,
                    mpMouse: false,
                    texHints: true,
                    semantics: false
                },
                errorSettings: {
                    message: [ "[", [ "MathProcessingError", "Math Processing Error" ], "]" ],
                    style: {
                        color: "#CC0000",
                        "font-style": "italic"
                    }
                }
            },
            preProcessors: MathJax.Callback.Hooks(true),
            inputJax: {},
            outputJax: {
                order: {}
            },
            processUpdateTime: 250,
            processUpdateDelay: 10,
            signal: MathJax.Callback.Signal("Hub"),
            Config: function(a) {
                this.Insert(this.config, a);
                if (this.config.Augment) {
                    this.Augment(this.config.Augment);
                }
            },
            CombineConfig: function(c, f) {
                var b = this.config, g, e;
                c = c.split(/\./);
                for (var d = 0, a = c.length; d < a; d++) {
                    g = c[d];
                    if (!b[g]) {
                        b[g] = {};
                    }
                    e = b;
                    b = b[g];
                }
                e[g] = b = this.Insert(f, b);
                return b;
            },
            Register: {
                PreProcessor: function() {
                    MathJax.Hub.preProcessors.Add.apply(MathJax.Hub.preProcessors, arguments);
                },
                MessageHook: function() {
                    return MathJax.Hub.signal.MessageHook.apply(MathJax.Hub.signal, arguments);
                },
                StartupHook: function() {
                    return MathJax.Hub.Startup.signal.MessageHook.apply(MathJax.Hub.Startup.signal, arguments);
                },
                LoadHook: function() {
                    return MathJax.Ajax.LoadHook.apply(MathJax.Ajax, arguments);
                }
            },
            getAllJax: function(e) {
                var c = [], b = this.elementScripts(e);
                for (var d = 0, a = b.length; d < a; d++) {
                    if (b[d].MathJax && b[d].MathJax.elementJax) {
                        c.push(b[d].MathJax.elementJax);
                    }
                }
                return c;
            },
            getJaxByType: function(f, e) {
                var c = [], b = this.elementScripts(e);
                for (var d = 0, a = b.length; d < a; d++) {
                    if (b[d].MathJax && b[d].MathJax.elementJax && b[d].MathJax.elementJax.mimeType === f) {
                        c.push(b[d].MathJax.elementJax);
                    }
                }
                return c;
            },
            getJaxByInputType: function(f, e) {
                var c = [], b = this.elementScripts(e);
                for (var d = 0, a = b.length; d < a; d++) {
                    if (b[d].MathJax && b[d].MathJax.elementJax && b[d].type && b[d].type.replace(/ *;(.|\s)*/, "") === f) {
                        c.push(b[d].MathJax.elementJax);
                    }
                }
                return c;
            },
            getJaxFor: function(a) {
                if (typeof a === "string") {
                    a = document.getElementById(a);
                }
                if (a && a.MathJax) {
                    return a.MathJax.elementJax;
                }
                if (a && a.isMathJax) {
                    while (a && !a.jaxID) {
                        a = a.parentNode;
                    }
                    if (a) {
                        return MathJax.OutputJax[a.jaxID].getJaxFromMath(a);
                    }
                }
                return null;
            },
            isJax: function(a) {
                if (typeof a === "string") {
                    a = document.getElementById(a);
                }
                if (a && a.isMathJax) {
                    return 1;
                }
                if (a && a.tagName != null && a.tagName.toLowerCase() === "script") {
                    if (a.MathJax) {
                        return a.MathJax.state === MathJax.ElementJax.STATE.PROCESSED ? 1 : -1;
                    }
                    if (a.type && this.inputJax[a.type.replace(/ *;(.|\s)*/, "")]) {
                        return -1;
                    }
                }
                return 0;
            },
            setRenderer: function(d, c) {
                if (!d) {
                    return;
                }
                if (!MathJax.OutputJax[d]) {
                    this.config.menuSettings.renderer = "";
                    var b = "[MathJax]/jax/output/" + d + "/config.js";
                    return MathJax.Ajax.Require(b, [ "setRenderer", this, d, c ]);
                } else {
                    this.config.menuSettings.renderer = d;
                    if (c == null) {
                        c = "jax/mml";
                    }
                    var a = this.outputJax;
                    if (a[c] && a[c].length) {
                        if (d !== a[c][0].id) {
                            a[c].unshift(MathJax.OutputJax[d]);
                            return this.signal.Post([ "Renderer Selected", d ]);
                        }
                    }
                    return null;
                }
            },
            Queue: function() {
                return this.queue.Push.apply(this.queue, arguments);
            },
            Typeset: function(e, f) {
                if (!MathJax.isReady) {
                    return null;
                }
                var c = this.elementCallback(e, f);
                var b = MathJax.Callback.Queue();
                for (var d = 0, a = c.elements.length; d < a; d++) {
                    if (c.elements[d]) {
                        b.Push([ "PreProcess", this, c.elements[d] ], [ "Process", this, c.elements[d] ]);
                    }
                }
                return b.Push(c.callback);
            },
            PreProcess: function(e, f) {
                var c = this.elementCallback(e, f);
                var b = MathJax.Callback.Queue();
                for (var d = 0, a = c.elements.length; d < a; d++) {
                    if (c.elements[d]) {
                        b.Push([ "Post", this.signal, [ "Begin PreProcess", c.elements[d] ] ], arguments.callee.disabled ? {} : [ "Execute", this.preProcessors, c.elements[d] ], [ "Post", this.signal, [ "End PreProcess", c.elements[d] ] ]);
                    }
                }
                return b.Push(c.callback);
            },
            Process: function(a, b) {
                return this.takeAction("Process", a, b);
            },
            Update: function(a, b) {
                return this.takeAction("Update", a, b);
            },
            Reprocess: function(a, b) {
                return this.takeAction("Reprocess", a, b);
            },
            Rerender: function(a, b) {
                return this.takeAction("Rerender", a, b);
            },
            takeAction: function(g, e, h) {
                var c = this.elementCallback(e, h);
                var b = MathJax.Callback.Queue([ "Clear", this.signal ]);
                for (var d = 0, a = c.elements.length; d < a; d++) {
                    if (c.elements[d]) {
                        var f = {
                            scripts: [],
                            start: new Date().getTime(),
                            i: 0,
                            j: 0,
                            jax: {},
                            jaxIDs: []
                        };
                        b.Push([ "Post", this.signal, [ "Begin " + g, c.elements[d] ] ], [ "Post", this.signal, [ "Begin Math", c.elements[d], g ] ], [ "prepareScripts", this, g, c.elements[d], f ], [ "Post", this.signal, [ "Begin Math Input", c.elements[d], g ] ], [ "processInput", this, f ], [ "Post", this.signal, [ "End Math Input", c.elements[d], g ] ], [ "prepareOutput", this, f, "preProcess" ], [ "Post", this.signal, [ "Begin Math Output", c.elements[d], g ] ], [ "processOutput", this, f ], [ "Post", this.signal, [ "End Math Output", c.elements[d], g ] ], [ "prepareOutput", this, f, "postProcess" ], [ "Post", this.signal, [ "End Math", c.elements[d], g ] ], [ "Post", this.signal, [ "End " + g, c.elements[d] ] ]);
                    }
                }
                return b.Push(c.callback);
            },
            scriptAction: {
                Process: function(a) {},
                Update: function(b) {
                    var a = b.MathJax.elementJax;
                    if (a && a.needsUpdate()) {
                        a.Remove(true);
                        b.MathJax.state = a.STATE.UPDATE;
                    } else {
                        b.MathJax.state = a.STATE.PROCESSED;
                    }
                },
                Reprocess: function(b) {
                    var a = b.MathJax.elementJax;
                    if (a) {
                        a.Remove(true);
                        b.MathJax.state = a.STATE.UPDATE;
                    }
                },
                Rerender: function(b) {
                    var a = b.MathJax.elementJax;
                    if (a) {
                        a.Remove(true);
                        b.MathJax.state = a.STATE.OUTPUT;
                    }
                }
            },
            prepareScripts: function(h, e, g) {
                if (arguments.callee.disabled) {
                    return;
                }
                var b = this.elementScripts(e);
                var f = MathJax.ElementJax.STATE;
                for (var d = 0, a = b.length; d < a; d++) {
                    var c = b[d];
                    if (c.type && this.inputJax[c.type.replace(/ *;(.|\n)*/, "")]) {
                        if (c.MathJax) {
                            if (c.MathJax.elementJax && c.MathJax.elementJax.hover) {
                                MathJax.Extension.MathEvents.Hover.ClearHover(c.MathJax.elementJax);
                            }
                            if (c.MathJax.state !== f.PENDING) {
                                this.scriptAction[h](c);
                            }
                        }
                        if (!c.MathJax) {
                            c.MathJax = {
                                state: f.PENDING
                            };
                        }
                        if (c.MathJax.state !== f.PROCESSED) {
                            g.scripts.push(c);
                        }
                    }
                }
            },
            checkScriptSiblings: function(a) {
                if (a.MathJax.checked) {
                    return;
                }
                var b = this.config, f = a.previousSibling;
                if (f && f.nodeName === "#text") {
                    var d, e, c = a.nextSibling;
                    if (c && c.nodeName !== "#text") {
                        c = null;
                    }
                    if (b.preJax) {
                        if (typeof b.preJax === "string") {
                            b.preJax = new RegExp(b.preJax + "$");
                        }
                        d = f.nodeValue.match(b.preJax);
                    }
                    if (b.postJax && c) {
                        if (typeof b.postJax === "string") {
                            b.postJax = new RegExp("^" + b.postJax);
                        }
                        e = c.nodeValue.match(b.postJax);
                    }
                    if (d && (!b.postJax || e)) {
                        f.nodeValue = f.nodeValue.replace(b.preJax, d.length > 1 ? d[1] : "");
                        f = null;
                    }
                    if (e && (!b.preJax || d)) {
                        c.nodeValue = c.nodeValue.replace(b.postJax, e.length > 1 ? e[1] : "");
                    }
                    if (f && !f.nodeValue.match(/\S/)) {
                        f = f.previousSibling;
                    }
                }
                if (b.preRemoveClass && f && f.className === b.preRemoveClass) {
                    a.MathJax.preview = f;
                }
                a.MathJax.checked = 1;
            },
            processInput: function(a) {
                var b, i = MathJax.ElementJax.STATE;
                var h, e, d = a.scripts.length;
                try {
                    while (a.i < d) {
                        h = a.scripts[a.i];
                        if (!h) {
                            a.i++;
                            continue;
                        }
                        e = h.previousSibling;
                        if (e && e.className === "MathJax_Error") {
                            e.parentNode.removeChild(e);
                        }
                        if (!h.MathJax || h.MathJax.state === i.PROCESSED) {
                            a.i++;
                            continue;
                        }
                        if (!h.MathJax.elementJax || h.MathJax.state === i.UPDATE) {
                            this.checkScriptSiblings(h);
                            var g = h.type.replace(/ *;(.|\s)*/, "");
                            b = this.inputJax[g].Process(h, a);
                            if (typeof b === "function") {
                                if (b.called) {
                                    continue;
                                }
                                this.RestartAfter(b);
                            }
                            b.Attach(h, this.inputJax[g].id);
                            this.saveScript(b, a, h, i);
                        } else {
                            if (h.MathJax.state === i.OUTPUT) {
                                this.saveScript(h.MathJax.elementJax, a, h, i);
                            }
                        }
                        a.i++;
                        var c = new Date().getTime();
                        if (c - a.start > this.processUpdateTime && a.i < a.scripts.length) {
                            a.start = c;
                            this.RestartAfter(MathJax.Callback.Delay(1));
                        }
                    }
                } catch (f) {
                    return this.processError(f, a, "Input");
                }
                if (a.scripts.length && this.config.showProcessingMessages) {
                    MathJax.Message.Set([ "ProcessMath", "Processing math: %1%%", 100 ], 0);
                }
                a.start = new Date().getTime();
                a.i = a.j = 0;
                return null;
            },
            saveScript: function(a, d, b, c) {
                if (!this.outputJax[a.mimeType]) {
                    b.MathJax.state = c.UPDATE;
                    throw Error("No output jax registered for " + a.mimeType);
                }
                a.outputJax = this.outputJax[a.mimeType][0].id;
                if (!d.jax[a.outputJax]) {
                    if (d.jaxIDs.length === 0) {
                        d.jax[a.outputJax] = d.scripts;
                    } else {
                        if (d.jaxIDs.length === 1) {
                            d.jax[d.jaxIDs[0]] = d.scripts.slice(0, d.i);
                        }
                        d.jax[a.outputJax] = [];
                    }
                    d.jaxIDs.push(a.outputJax);
                }
                if (d.jaxIDs.length > 1) {
                    d.jax[a.outputJax].push(b);
                }
                b.MathJax.state = c.OUTPUT;
            },
            prepareOutput: function(c, f) {
                while (c.j < c.jaxIDs.length) {
                    var e = c.jaxIDs[c.j], d = MathJax.OutputJax[e];
                    if (d[f]) {
                        try {
                            var a = d[f](c);
                            if (typeof a === "function") {
                                if (a.called) {
                                    continue;
                                }
                                this.RestartAfter(a);
                            }
                        } catch (b) {
                            if (!b.restart) {
                                MathJax.Message.Set([ "PrepError", "Error preparing %1 output (%2)", e, f ], null, 600);
                                MathJax.Hub.lastPrepError = b;
                                c.j++;
                            }
                            return MathJax.Callback.After([ "prepareOutput", this, c, f ], b.restart);
                        }
                    }
                    c.j++;
                }
                return null;
            },
            processOutput: function(h) {
                var b, g = MathJax.ElementJax.STATE, d, a = h.scripts.length;
                try {
                    while (h.i < a) {
                        d = h.scripts[h.i];
                        if (!d || !d.MathJax || d.MathJax.error) {
                            h.i++;
                            continue;
                        }
                        var c = d.MathJax.elementJax;
                        if (!c) {
                            h.i++;
                            continue;
                        }
                        b = MathJax.OutputJax[c.outputJax].Process(d, h);
                        d.MathJax.state = g.PROCESSED;
                        h.i++;
                        if (d.MathJax.preview) {
                            d.MathJax.preview.innerHTML = "";
                        }
                        this.signal.Post([ "New Math", c.inputID ]);
                        var e = new Date().getTime();
                        if (e - h.start > this.processUpdateTime && h.i < h.scripts.length) {
                            h.start = e;
                            this.RestartAfter(MathJax.Callback.Delay(this.processUpdateDelay));
                        }
                    }
                } catch (f) {
                    return this.processError(f, h, "Output");
                }
                if (h.scripts.length && this.config.showProcessingMessages) {
                    MathJax.Message.Set([ "TypesetMath", "Typesetting math: %1%%", 100 ], 0);
                    MathJax.Message.Clear(0);
                }
                h.i = h.j = 0;
                return null;
            },
            processMessage: function(d, b) {
                var a = Math.floor(d.i / d.scripts.length * 100);
                var c = b === "Output" ? [ "TypesetMath", "Typesetting math: %1%%" ] : [ "ProcessMath", "Processing math: %1%%" ];
                if (this.config.showProcessingMessages) {
                    MathJax.Message.Set(c.concat(a), 0);
                }
            },
            processError: function(b, c, a) {
                if (!b.restart) {
                    if (!this.config.errorSettings.message) {
                        throw b;
                    }
                    this.formatError(c.scripts[c.i], b);
                    c.i++;
                }
                this.processMessage(c, a);
                return MathJax.Callback.After([ "process" + a, this, c ], b.restart);
            },
            formatError: function(b, e) {
                var d = "Error: " + e.message + "\n";
                if (e.sourceURL) {
                    d += "\nfile: " + e.sourceURL;
                }
                if (e.line) {
                    d += "\nline: " + e.line;
                }
                b.MathJax.error = MathJax.OutputJax.Error.Jax(d, b);
                var f = this.config.errorSettings;
                var a = MathJax.Localization._(f.messageId, f.message);
                var c = MathJax.HTML.Element("span", {
                    className: "MathJax_Error",
                    jaxID: "Error",
                    isMathJax: true
                }, a);
                if (MathJax.Extension.MathEvents) {
                    c.oncontextmenu = MathJax.Extension.MathEvents.Event.Menu;
                    c.onmousedown = MathJax.Extension.MathEvents.Event.Mousedown;
                } else {
                    MathJax.Ajax.Require("[MathJax]/extensions/MathEvents.js", function() {
                        c.oncontextmenu = MathJax.Extension.MathEvents.Event.Menu;
                        c.onmousedown = MathJax.Extension.MathEvents.Event.Mousedown;
                    });
                }
                b.parentNode.insertBefore(c, b);
                if (b.MathJax.preview) {
                    b.MathJax.preview.innerHTML = "";
                }
                this.lastError = e;
                this.signal.Post([ "Math Processing Error", b, e ]);
            },
            RestartAfter: function(a) {
                throw this.Insert(Error("restart"), {
                    restart: MathJax.Callback(a)
                });
            },
            elementCallback: function(c, f) {
                if (f == null && (c instanceof Array || typeof c === "function")) {
                    try {
                        MathJax.Callback(c);
                        f = c;
                        c = null;
                    } catch (d) {}
                }
                if (c == null) {
                    c = this.config.elements || [];
                }
                if (!(c instanceof Array)) {
                    c = [ c ];
                }
                c = [].concat(c);
                for (var b = 0, a = c.length; b < a; b++) {
                    if (typeof c[b] === "string") {
                        c[b] = document.getElementById(c[b]);
                    }
                }
                if (!document.body) {
                    document.body = document.getElementsByTagName("body")[0];
                }
                if (c.length == 0) {
                    c.push(document.body);
                }
                if (!f) {
                    f = {};
                }
                return {
                    elements: c,
                    callback: f
                };
            },
            elementScripts: function(d) {
                if (d instanceof Array) {
                    var b = [];
                    for (var c = 0, a = d.length; c < a; c++) {
                        b.push.apply(b, this.elementScripts(d[c]));
                    }
                    return b;
                }
                if (typeof d === "string") {
                    d = document.getElementById(d);
                }
                if (!document.body) {
                    document.body = document.getElementsByTagName("body")[0];
                }
                if (d == null) {
                    d = document.body;
                }
                if (d.tagName != null && d.tagName.toLowerCase() === "script") {
                    return [ d ];
                }
                return d.getElementsByTagName("script");
            },
            Insert: function(c, a) {
                for (var b in a) {
                    if (a.hasOwnProperty(b)) {
                        if (typeof a[b] === "object" && !(a[b] instanceof Array) && (typeof c[b] === "object" || typeof c[b] === "function")) {
                            this.Insert(c[b], a[b]);
                        } else {
                            c[b] = a[b];
                        }
                    }
                }
                return c;
            },
            SplitList: "trim" in String.prototype ? function(a) {
                return a.trim().split(/\s+/);
            } : function(a) {
                return a.replace(/^\s+/, "").replace(/\s+$/, "").split(/\s+/);
            }
        };
        MathJax.Hub.Insert(MathJax.Hub.config.styles, MathJax.Message.styles);
        MathJax.Hub.Insert(MathJax.Hub.config.styles, {
            ".MathJax_Error": MathJax.Hub.config.errorSettings.style
        });
        MathJax.Extension = {};
        MathJax.Hub.Configured = MathJax.Callback({});
        MathJax.Hub.Startup = {
            script: "",
            queue: MathJax.Callback.Queue(),
            signal: MathJax.Callback.Signal("Startup"),
            params: {},
            Config: function() {
                this.queue.Push([ "Post", this.signal, "Begin Config" ]);
                if (this.params.locale) {
                    MathJax.Localization.resetLocale(this.params.locale);
                    MathJax.Hub.config.menuSettings.locale = this.params.locale;
                }
                if (this.params.config) {
                    var c = this.params.config.split(/,/);
                    for (var b = 0, a = c.length; b < a; b++) {
                        if (!c[b].match(/\.js$/)) {
                            c[b] += ".js";
                        }
                        this.queue.Push([ "Require", MathJax.Ajax, this.URL("config", c[b]) ]);
                    }
                }
                this.queue.Push([ "Config", MathJax.Hub, MathJax.AuthorConfig ]);
                if (this.script.match(/\S/)) {
                    this.queue.Push(this.script + ";\n1;");
                }
                this.queue.Push([ "ConfigDelay", this ], [ "ConfigBlocks", this ], [ function(d) {
                    return d.loadArray(MathJax.Hub.config.config, "config", null, true);
                }, this ], [ "Post", this.signal, "End Config" ]);
            },
            ConfigDelay: function() {
                var a = this.params.delayStartupUntil || MathJax.Hub.config.delayStartupUntil;
                if (a === "onload") {
                    return this.onload;
                }
                if (a === "configured") {
                    return MathJax.Hub.Configured;
                }
                return a;
            },
            ConfigBlocks: function() {
                var c = document.getElementsByTagName("script");
                var f = null, b = MathJax.Callback.Queue();
                for (var d = 0, a = c.length; d < a; d++) {
                    var e = String(c[d].type).replace(/ /g, "");
                    if (e.match(/^text\/x-mathjax-config(;.*)?$/) && !e.match(/;executed=true/)) {
                        c[d].type += ";executed=true";
                        f = b.Push(c[d].innerHTML + ";\n1;");
                    }
                }
                return f;
            },
            Cookie: function() {
                return this.queue.Push([ "Post", this.signal, "Begin Cookie" ], [ "Get", MathJax.HTML.Cookie, "menu", MathJax.Hub.config.menuSettings ], [ function(d) {
                    if (d.menuSettings.locale) {
                        MathJax.Localization.resetLocale(d.menuSettings.locale);
                    }
                    var f = d.menuSettings.renderer, b = d.jax;
                    if (f) {
                        var c = "output/" + f;
                        b.sort();
                        for (var e = 0, a = b.length; e < a; e++) {
                            if (b[e].substr(0, 7) === "output/") {
                                break;
                            }
                        }
                        if (e == a - 1) {
                            b.pop();
                        } else {
                            while (e < a) {
                                if (b[e] === c) {
                                    b.splice(e, 1);
                                    break;
                                }
                                e++;
                            }
                        }
                        b.unshift(c);
                    }
                }, MathJax.Hub.config ], [ "Post", this.signal, "End Cookie" ]);
            },
            Styles: function() {
                return this.queue.Push([ "Post", this.signal, "Begin Styles" ], [ "loadArray", this, MathJax.Hub.config.styleSheets, "config" ], [ "Styles", MathJax.Ajax, MathJax.Hub.config.styles ], [ "Post", this.signal, "End Styles" ]);
            },
            Jax: function() {
                var f = MathJax.Hub.config, c = MathJax.Hub.outputJax;
                for (var g = 0, b = f.jax.length, d = 0; g < b; g++) {
                    var e = f.jax[g].substr(7);
                    if (f.jax[g].substr(0, 7) === "output/" && c.order[e] == null) {
                        c.order[e] = d;
                        d++;
                    }
                }
                var a = MathJax.Callback.Queue();
                return a.Push([ "Post", this.signal, "Begin Jax" ], [ "loadArray", this, f.jax, "jax", "config.js" ], [ "Post", this.signal, "End Jax" ]);
            },
            Extensions: function() {
                var a = MathJax.Callback.Queue();
                return a.Push([ "Post", this.signal, "Begin Extensions" ], [ "loadArray", this, MathJax.Hub.config.extensions, "extensions" ], [ "Post", this.signal, "End Extensions" ]);
            },
            Message: function() {
                MathJax.Message.Init(true);
            },
            Menu: function() {
                var b = MathJax.Hub.config.menuSettings, a = MathJax.Hub.outputJax, d;
                for (var c in a) {
                    if (a.hasOwnProperty(c)) {
                        if (a[c].length) {
                            d = a[c];
                            break;
                        }
                    }
                }
                if (d && d.length) {
                    if (b.renderer && b.renderer !== d[0].id) {
                        d.unshift(MathJax.OutputJax[b.renderer]);
                    }
                    b.renderer = d[0].id;
                }
            },
            Hash: function() {
                if (MathJax.Hub.config.positionToHash && document.location.hash && document.body && document.body.scrollIntoView) {
                    var d = document.location.hash.substr(1);
                    var f = document.getElementById(d);
                    if (!f) {
                        var c = document.getElementsByTagName("a");
                        for (var e = 0, b = c.length; e < b; e++) {
                            if (c[e].name === d) {
                                f = c[e];
                                break;
                            }
                        }
                    }
                    if (f) {
                        while (!f.scrollIntoView) {
                            f = f.parentNode;
                        }
                        f = this.HashCheck(f);
                        if (f && f.scrollIntoView) {
                            setTimeout(function() {
                                f.scrollIntoView(true);
                            }, 1);
                        }
                    }
                }
            },
            HashCheck: function(b) {
                if (b.isMathJax) {
                    var a = MathJax.Hub.getJaxFor(b);
                    if (a && MathJax.OutputJax[a.outputJax].hashCheck) {
                        b = MathJax.OutputJax[a.outputJax].hashCheck(b);
                    }
                }
                return b;
            },
            MenuZoom: function() {
                if (MathJax.Hub.config.showMathMenu) {
                    if (!MathJax.Extension.MathMenu) {
                        setTimeout(function() {
                            MathJax.Callback.Queue([ "Require", MathJax.Ajax, "[MathJax]/extensions/MathMenu.js", {} ], [ "loadDomain", MathJax.Localization, "MathMenu" ]);
                        }, 1e3);
                    } else {
                        setTimeout(MathJax.Callback([ "loadDomain", MathJax.Localization, "MathMenu" ]), 1e3);
                    }
                    if (!MathJax.Extension.MathZoom) {
                        setTimeout(MathJax.Callback([ "Require", MathJax.Ajax, "[MathJax]/extensions/MathZoom.js", {} ]), 2e3);
                    }
                }
            },
            onLoad: function() {
                var a = this.onload = MathJax.Callback(function() {
                    MathJax.Hub.Startup.signal.Post("onLoad");
                });
                if (document.body && document.readyState) {
                    if (MathJax.Hub.Browser.isMSIE) {
                        if (document.readyState === "complete") {
                            return [ a ];
                        }
                    } else {
                        if (document.readyState !== "loading") {
                            return [ a ];
                        }
                    }
                }
                if (window.addEventListener) {
                    window.addEventListener("load", a, false);
                    if (!this.params.noDOMContentEvent) {
                        window.addEventListener("DOMContentLoaded", a, false);
                    }
                } else {
                    if (window.attachEvent) {
                        window.attachEvent("onload", a);
                    } else {
                        window.onload = a;
                    }
                }
                return a;
            },
            Typeset: function(a, b) {
                if (MathJax.Hub.config.skipStartupTypeset) {
                    return function() {};
                }
                return this.queue.Push([ "Post", this.signal, "Begin Typeset" ], [ "Typeset", MathJax.Hub, a, b ], [ "Post", this.signal, "End Typeset" ]);
            },
            URL: function(b, a) {
                if (!a.match(/^([a-z]+:\/\/|\[|\/)/)) {
                    a = "[MathJax]/" + b + "/" + a;
                }
                return a;
            },
            loadArray: function(b, f, c, a) {
                if (b) {
                    if (!(b instanceof Array)) {
                        b = [ b ];
                    }
                    if (b.length) {
                        var h = MathJax.Callback.Queue(), j = {}, e;
                        for (var g = 0, d = b.length; g < d; g++) {
                            e = this.URL(f, b[g]);
                            if (c) {
                                e += "/" + c;
                            }
                            if (a) {
                                h.Push([ "Require", MathJax.Ajax, e, j ]);
                            } else {
                                h.Push(MathJax.Ajax.Require(e, j));
                            }
                        }
                        return h.Push({});
                    }
                }
                return null;
            }
        };
        (function(d) {
            var b = window[d], e = "[" + d + "]";
            var c = b.Hub, a = b.Ajax, f = b.Callback;
            var g = MathJax.Object.Subclass({
                JAXFILE: "jax.js",
                require: null,
                config: {},
                Init: function(i, h) {
                    if (arguments.length === 0) {
                        return this;
                    }
                    return this.constructor.Subclass(i, h)();
                },
                Augment: function(k, j) {
                    var i = this.constructor, h = {};
                    if (k != null) {
                        for (var l in k) {
                            if (k.hasOwnProperty(l)) {
                                if (typeof k[l] === "function") {
                                    i.protoFunction(l, k[l]);
                                } else {
                                    h[l] = k[l];
                                }
                            }
                        }
                        if (k.toString !== i.prototype.toString && k.toString !== {}.toString) {
                            i.protoFunction("toString", k.toString);
                        }
                    }
                    c.Insert(i.prototype, h);
                    i.Augment(null, j);
                    return this;
                },
                Translate: function(h, i) {
                    throw Error(this.directory + "/" + this.JAXFILE + " failed to define the Translate() method");
                },
                Register: function(h) {},
                Config: function() {
                    this.config = c.CombineConfig(this.id, this.config);
                    if (this.config.Augment) {
                        this.Augment(this.config.Augment);
                    }
                },
                Startup: function() {},
                loadComplete: function(i) {
                    if (i === "config.js") {
                        return a.loadComplete(this.directory + "/" + i);
                    } else {
                        var h = f.Queue();
                        h.Push(c.Register.StartupHook("End Config", {}), [ "Post", c.Startup.signal, this.id + " Jax Config" ], [ "Config", this ], [ "Post", c.Startup.signal, this.id + " Jax Require" ], [ function(j) {
                            return MathJax.Hub.Startup.loadArray(j.require, this.directory);
                        }, this ], [ function(j, k) {
                            return MathJax.Hub.Startup.loadArray(j.extensions, "extensions/" + k);
                        }, this.config || {}, this.id ], [ "Post", c.Startup.signal, this.id + " Jax Startup" ], [ "Startup", this ], [ "Post", c.Startup.signal, this.id + " Jax Ready" ]);
                        if (this.copyTranslate) {
                            h.Push([ function(j) {
                                j.preProcess = j.preTranslate;
                                j.Process = j.Translate;
                                j.postProcess = j.postTranslate;
                            }, this.constructor.prototype ]);
                        }
                        return h.Push([ "loadComplete", a, this.directory + "/" + i ]);
                    }
                }
            }, {
                id: "Jax",
                version: "2.4.0",
                directory: e + "/jax",
                extensionDir: e + "/extensions"
            });
            b.InputJax = g.Subclass({
                elementJax: "mml",
                sourceMenuTitle: [ "Original", "Original Form" ],
                copyTranslate: true,
                Process: function(l, q) {
                    var j = f.Queue(), o;
                    var k = this.elementJax;
                    if (!(k instanceof Array)) {
                        k = [ k ];
                    }
                    for (var n = 0, h = k.length; n < h; n++) {
                        o = b.ElementJax.directory + "/" + k[n] + "/" + this.JAXFILE;
                        if (!this.require) {
                            this.require = [];
                        } else {
                            if (!(this.require instanceof Array)) {
                                this.require = [ this.require ];
                            }
                        }
                        this.require.push(o);
                        j.Push(a.Require(o));
                    }
                    o = this.directory + "/" + this.JAXFILE;
                    var p = j.Push(a.Require(o));
                    if (!p.called) {
                        this.constructor.prototype.Process = function() {
                            if (!p.called) {
                                return p;
                            }
                            throw Error(o + " failed to load properly");
                        };
                    }
                    k = c.outputJax["jax/" + k[0]];
                    if (k) {
                        j.Push(a.Require(k[0].directory + "/" + this.JAXFILE));
                    }
                    return j.Push({});
                },
                needsUpdate: function(h) {
                    var i = h.SourceElement();
                    return h.originalText !== b.HTML.getScript(i);
                },
                Register: function(h) {
                    if (!c.inputJax) {
                        c.inputJax = {};
                    }
                    c.inputJax[h] = this;
                }
            }, {
                id: "InputJax",
                version: "2.4.0",
                directory: g.directory + "/input",
                extensionDir: g.extensionDir
            });
            b.OutputJax = g.Subclass({
                copyTranslate: true,
                preProcess: function(j) {
                    var i, h = this.directory + "/" + this.JAXFILE;
                    this.constructor.prototype.preProcess = function(k) {
                        if (!i.called) {
                            return i;
                        }
                        throw Error(h + " failed to load properly");
                    };
                    i = a.Require(h);
                    return i;
                },
                Register: function(i) {
                    var h = c.outputJax;
                    if (!h[i]) {
                        h[i] = [];
                    }
                    if (h[i].length && (this.id === c.config.menuSettings.renderer || (h.order[this.id] || 0) < (h.order[h[i][0].id] || 0))) {
                        h[i].unshift(this);
                    } else {
                        h[i].push(this);
                    }
                    if (!this.require) {
                        this.require = [];
                    } else {
                        if (!(this.require instanceof Array)) {
                            this.require = [ this.require ];
                        }
                    }
                    this.require.push(b.ElementJax.directory + "/" + i.split(/\//)[1] + "/" + this.JAXFILE);
                },
                Remove: function(h) {}
            }, {
                id: "OutputJax",
                version: "2.4.0",
                directory: g.directory + "/output",
                extensionDir: g.extensionDir,
                fontDir: e + (b.isPacked ? "" : "/..") + "/fonts",
                imageDir: e + (b.isPacked ? "" : "/..") + "/images"
            });
            b.ElementJax = g.Subclass({
                Init: function(i, h) {
                    return this.constructor.Subclass(i, h);
                },
                inputJax: null,
                outputJax: null,
                inputID: null,
                originalText: "",
                mimeType: "",
                sourceMenuTitle: [ "MathMLcode", "MathML Code" ],
                Text: function(i, j) {
                    var h = this.SourceElement();
                    b.HTML.setScript(h, i);
                    h.MathJax.state = this.STATE.UPDATE;
                    return c.Update(h, j);
                },
                Reprocess: function(i) {
                    var h = this.SourceElement();
                    h.MathJax.state = this.STATE.UPDATE;
                    return c.Reprocess(h, i);
                },
                Update: function(h) {
                    return this.Rerender(h);
                },
                Rerender: function(i) {
                    var h = this.SourceElement();
                    h.MathJax.state = this.STATE.OUTPUT;
                    return c.Process(h, i);
                },
                Remove: function(h) {
                    if (this.hover) {
                        this.hover.clear(this);
                    }
                    b.OutputJax[this.outputJax].Remove(this);
                    if (!h) {
                        c.signal.Post([ "Remove Math", this.inputID ]);
                        this.Detach();
                    }
                },
                needsUpdate: function() {
                    return b.InputJax[this.inputJax].needsUpdate(this);
                },
                SourceElement: function() {
                    return document.getElementById(this.inputID);
                },
                Attach: function(i, j) {
                    var h = i.MathJax.elementJax;
                    if (i.MathJax.state === this.STATE.UPDATE) {
                        h.Clone(this);
                    } else {
                        h = i.MathJax.elementJax = this;
                        if (i.id) {
                            this.inputID = i.id;
                        } else {
                            i.id = this.inputID = b.ElementJax.GetID();
                            this.newID = 1;
                        }
                    }
                    h.originalText = b.HTML.getScript(i);
                    h.inputJax = j;
                    if (h.root) {
                        h.root.inputID = h.inputID;
                    }
                    return h;
                },
                Detach: function() {
                    var h = this.SourceElement();
                    if (!h) {
                        return;
                    }
                    try {
                        delete h.MathJax;
                    } catch (i) {
                        h.MathJax = null;
                    }
                    if (this.newID) {
                        h.id = "";
                    }
                },
                Clone: function(h) {
                    var i;
                    for (i in this) {
                        if (!this.hasOwnProperty(i)) {
                            continue;
                        }
                        if (typeof h[i] === "undefined" && i !== "newID") {
                            delete this[i];
                        }
                    }
                    for (i in h) {
                        if (!h.hasOwnProperty(i)) {
                            continue;
                        }
                        if (typeof this[i] === "undefined" || this[i] !== h[i] && i !== "inputID") {
                            this[i] = h[i];
                        }
                    }
                }
            }, {
                id: "ElementJax",
                version: "2.4.0",
                directory: g.directory + "/element",
                extensionDir: g.extensionDir,
                ID: 0,
                STATE: {
                    PENDING: 1,
                    PROCESSED: 2,
                    UPDATE: 3,
                    OUTPUT: 4
                },
                GetID: function() {
                    this.ID++;
                    return "MathJax-Element-" + this.ID;
                },
                Subclass: function() {
                    var h = g.Subclass.apply(this, arguments);
                    h.loadComplete = this.prototype.loadComplete;
                    return h;
                }
            });
            b.ElementJax.prototype.STATE = b.ElementJax.STATE;
            b.OutputJax.Error = {
                id: "Error",
                version: "2.4.0",
                config: {},
                ContextMenu: function() {
                    return b.Extension.MathEvents.Event.ContextMenu.apply(b.Extension.MathEvents.Event, arguments);
                },
                Mousedown: function() {
                    return b.Extension.MathEvents.Event.AltContextMenu.apply(b.Extension.MathEvents.Event, arguments);
                },
                getJaxFromMath: function(h) {
                    return (h.nextSibling.MathJax || {}).error;
                },
                Jax: function(j, i) {
                    var h = MathJax.Hub.inputJax[i.type.replace(/ *;(.|\s)*/, "")];
                    return {
                        inputJax: (h || {
                            id: "Error"
                        }).id,
                        outputJax: "Error",
                        sourceMenuTitle: [ "ErrorMessage", "Error Message" ],
                        sourceMenuFormat: "Error",
                        originalText: MathJax.HTML.getScript(i),
                        errorText: j
                    };
                }
            };
            b.InputJax.Error = {
                id: "Error",
                version: "2.4.0",
                config: {},
                sourceMenuTitle: [ "Original", "Original Form" ]
            };
        })("MathJax");
        (function(n) {
            var g = window[n];
            if (!g) {
                g = window[n] = {};
            }
            var c = g.Hub;
            var r = c.Startup;
            var v = c.config;
            var f = document.getElementsByTagName("head")[0];
            if (!f) {
                f = document.childNodes[0];
            }
            var b = (document.documentElement || document).getElementsByTagName("script");
            var e = new RegExp("(^|/)" + n + "\\.js(\\?.*)?$");
            for (var p = b.length - 1; p >= 0; p--) {
                if ((b[p].src || "").match(e)) {
                    r.script = b[p].innerHTML;
                    if (RegExp.$2) {
                        var s = RegExp.$2.substr(1).split(/\&/);
                        for (var o = 0, k = s.length; o < k; o++) {
                            var l = s[o].match(/(.*)=(.*)/);
                            if (l) {
                                r.params[unescape(l[1])] = unescape(l[2]);
                            }
                        }
                    }
                    v.root = b[p].src.replace(/(^|\/)[^\/]*(\?.*)?$/, "").replace(/^(https?:)\/\/[0-9a-f]+(-[0-9a-f]+)?.ssl.cf1.rackcdn.com\//, "$1//cdn.mathjax.org/");
                    g.Ajax.config.root = v.root;
                    break;
                }
            }
            var h = navigator.userAgent;
            var a = {
                isMac: navigator.platform.substr(0, 3) === "Mac",
                isPC: navigator.platform.substr(0, 3) === "Win",
                isMSIE: "ActiveXObject" in window && "clipboardData" in window,
                isFirefox: h.match(/Gecko\//) && !h.match(/like Gecko/),
                isSafari: h.match(/ (Apple)?WebKit\//) != null && (!window.chrome || window.chrome.loadTimes == null),
                isChrome: window.chrome != null && window.chrome.loadTimes != null,
                isOpera: window.opera != null && window.opera.version != null,
                isKonqueror: "konqueror" in window && navigator.vendor == "KDE",
                versionAtLeast: function(x) {
                    var w = this.version.split(".");
                    x = new String(x).split(".");
                    for (var y = 0, j = x.length; y < j; y++) {
                        if (w[y] != x[y]) {
                            return parseInt(w[y] || "0") >= parseInt(x[y]);
                        }
                    }
                    return true;
                },
                Select: function(j) {
                    var i = j[c.Browser];
                    if (i) {
                        return i(c.Browser);
                    }
                    return null;
                }
            };
            var d = h.replace(/^Mozilla\/(\d+\.)+\d+ /, "").replace(/[a-z][-a-z0-9._: ]+\/\d+[^ ]*-[^ ]*\.([a-z][a-z])?\d+ /i, "").replace(/Gentoo |Ubuntu\/(\d+\.)*\d+ (\([^)]*\) )?/, "");
            c.Browser = c.Insert(c.Insert(new String("Unknown"), {
                version: "0.0"
            }), a);
            for (var u in a) {
                if (a.hasOwnProperty(u)) {
                    if (a[u] && u.substr(0, 2) === "is") {
                        u = u.slice(2);
                        if (u === "Mac" || u === "PC") {
                            continue;
                        }
                        c.Browser = c.Insert(new String(u), a);
                        var q = new RegExp(".*(Version/| Trident/.*; rv:)((?:\\d+\\.)+\\d+)|.*(" + u + ")" + (u == "MSIE" ? " " : "/") + "((?:\\d+\\.)*\\d+)|(?:^|\\(| )([a-z][-a-z0-9._: ]+|(?:Apple)?WebKit)/((?:\\d+\\.)+\\d+)");
                        var t = q.exec(d) || [ "", "", "", "unknown", "0.0" ];
                        c.Browser.name = t[1] != "" ? u : t[3] || t[5];
                        c.Browser.version = t[2] || t[4] || t[6];
                        break;
                    }
                }
            }
            c.Browser.Select({
                Safari: function(j) {
                    var i = parseInt(String(j.version).split(".")[0]);
                    if (i > 85) {
                        j.webkit = j.version;
                    }
                    if (i >= 534) {
                        j.version = "5.1";
                    } else {
                        if (i >= 533) {
                            j.version = "5.0";
                        } else {
                            if (i >= 526) {
                                j.version = "4.0";
                            } else {
                                if (i >= 525) {
                                    j.version = "3.1";
                                } else {
                                    if (i > 500) {
                                        j.version = "3.0";
                                    } else {
                                        if (i > 400) {
                                            j.version = "2.0";
                                        } else {
                                            if (i > 85) {
                                                j.version = "1.0";
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    j.isMobile = navigator.appVersion.match(/Mobile/i) != null;
                    j.noContextMenu = j.isMobile;
                },
                Firefox: function(j) {
                    if ((j.version === "0.0" || h.match(/Firefox/) == null) && navigator.product === "Gecko") {
                        var m = h.match(/[\/ ]rv:(\d+\.\d.*?)[\) ]/);
                        if (m) {
                            j.version = m[1];
                        } else {
                            var i = (navigator.buildID || navigator.productSub || "0").substr(0, 8);
                            if (i >= "20111220") {
                                j.version = "9.0";
                            } else {
                                if (i >= "20111120") {
                                    j.version = "8.0";
                                } else {
                                    if (i >= "20110927") {
                                        j.version = "7.0";
                                    } else {
                                        if (i >= "20110816") {
                                            j.version = "6.0";
                                        } else {
                                            if (i >= "20110621") {
                                                j.version = "5.0";
                                            } else {
                                                if (i >= "20110320") {
                                                    j.version = "4.0";
                                                } else {
                                                    if (i >= "20100121") {
                                                        j.version = "3.6";
                                                    } else {
                                                        if (i >= "20090630") {
                                                            j.version = "3.5";
                                                        } else {
                                                            if (i >= "20080617") {
                                                                j.version = "3.0";
                                                            } else {
                                                                if (i >= "20061024") {
                                                                    j.version = "2.0";
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    j.isMobile = navigator.appVersion.match(/Android/i) != null || h.match(/ Fennec\//) != null || h.match(/Mobile/) != null;
                },
                Opera: function(i) {
                    i.version = opera.version();
                },
                MSIE: function(j) {
                    j.isIE9 = !!(document.documentMode && (window.performance || window.msPerformance));
                    MathJax.HTML.setScriptBug = !j.isIE9 || document.documentMode < 9;
                    var w = false;
                    try {
                        new ActiveXObject("MathPlayer.Factory.1");
                        j.hasMathPlayer = w = true;
                    } catch (m) {}
                    try {
                        if (w && !r.params.NoMathPlayer) {
                            var i = document.createElement("object");
                            i.id = "mathplayer";
                            i.classid = "clsid:32F66A20-7614-11D4-BD11-00104BD3F987";
                            document.getElementsByTagName("head")[0].appendChild(i);
                            document.namespaces.add("m", "http://www.w3.org/1998/Math/MathML");
                            j.mpNamespace = true;
                            if (document.readyState && (document.readyState === "loading" || document.readyState === "interactive")) {
                                document.write('<?import namespace="m" implementation="#MathPlayer">');
                                j.mpImported = true;
                            }
                        } else {
                            document.namespaces.add("mjx_IE_fix", "http://www.w3.org/1999/xlink");
                        }
                    } catch (m) {}
                }
            });
            c.Browser.Select(MathJax.Message.browsers);
            if (g.AuthorConfig && typeof g.AuthorConfig.AuthorInit === "function") {
                g.AuthorConfig.AuthorInit();
            }
            c.queue = g.Callback.Queue();
            c.queue.Push([ "Post", r.signal, "Begin" ], [ "Config", r ], [ "Cookie", r ], [ "Styles", r ], [ "Message", r ], function() {
                var i = g.Callback.Queue(r.Jax(), r.Extensions());
                return i.Push({});
            }, [ "Menu", r ], r.onLoad(), function() {
                MathJax.isReady = true;
            }, [ "Typeset", r ], [ "Hash", r ], [ "MenuZoom", r ], [ "Post", r.signal, "End" ]);
        })("MathJax");
    }
}

angular.module("qti", [ "ngSanitize", "pearsonvue", "com.2fdevs.videogular", "com.2fdevs.videogular.plugins.controls", "com.2fdevs.videogular.plugins.overlayplay", "com.2fdevs.videogular.plugins.buffering", "com.2fdevs.videogular.plugins.poster" ]);

angular.module("qti").constant("ATTR_MAP", {
    fontsize: "font-size",
    fontface: "font-family",
    backgroundColor: "background-color",
    width: "width",
    height: "height"
});

angular.module("qti").directive("assessment", function() {
    return {
        restrict: "E",
        scope: true,
        transclude: true,
        templateUrl: "templates/assessment.html",
        link: function(scope, el, attr) {
            scope.assessment = {
                id: attr.ident,
                title: attr.title
            };
        }
    };
});

angular.module("qti").directive("qtiEngine", [ "$http", "$compile", "helpers", function($http, $compile, helpers) {
    function _replaceSpaces(match, group) {
        return match.split(" ").join("__SPACE__");
    }
    function _replaceTabs(match, group) {
        return match.split(" ").join("__TAB__");
    }
    function fixMattext(xmlStr) {
        var xml = helpers.strToXML(xmlStr);
        var mattexts = xml.querySelectorAll("mattext");
        var mattext, childNodes, childNode, str;
        for (var i = 0; i < mattexts.length; i++) {
            mattext = mattexts[i];
            childNodes = mattext.childNodes;
            for (var n = 0; n < childNodes.length; n++) {
                childNode = childNodes[n];
                if (childNode.nodeType === 3) {
                    str = childNode.nodeValue.replace(/\s{2,}/gim, _replaceSpaces);
                    str = str.replace(/\t{2,}/gim, _replaceTabs);
                    childNode.nodeValue = str;
                }
            }
        }
        var oSerializer = new XMLSerializer();
        xmlStr = oSerializer.serializeToString(xml);
        xmlStr = xmlStr.split("__SPACE__").join("&nbsp;&#8203;");
        xmlStr = xmlStr.split("__TAB__").join("&nbsp;&nbsp;&nbsp;&#8203;");
        return xmlStr;
    }
    function stripCDATA(str) {
        return str.split("<![CDATA[").join("").split("]]>").join("");
    }
    function _formatWhitespace(str) {
        return str.replace(/(\w+)(.*?)>([\w\s\.\[\]\d\t]+)<\/(\1)/gim, function(match, r0, r1, r2) {
            return r0 + r1 + ">" + r2.split(" ").join("&nbsp;&#8203;") + "</" + r0;
        });
    }
    function formatWhitespace(str) {
        var matches = str.match(/<mattext([^>]?)+>((.|\n)*?)<\/mattext>/gim);
        var formattedStr;
        var match;
        if (matches) {
            for (var i = 0; i < matches.length; i += 1) {
                match = matches[i];
                formattedStr = _formatWhitespace(match);
                str = str.split(matches[i]).join(formattedStr);
            }
        }
        return str;
    }
    function replaceDyn(str) {
        return str.replace(/<dyn type="text\/groovy">(\s?)+return(\s?)+((.|\n)*?)(;?)<\/dyn>/gim, "{{ $3 }}");
    }
    function replaceShorthand(str) {
        return str.replace(/\${(\s?)+((.|\n)*?)\}/gim, "{{ system.$2 }}");
    }
    return {
        restrict: "E",
        scope: true,
        link: function(scope, el, attr) {
            $http.get(attr.src).then(function(response) {
                var template = response.data;
                var xml = helpers.strToXML(template);
                template = fixMattext(template);
                template = stripCDATA(template);
                template = replaceDyn(template);
                template = replaceShorthand(template);
                var linkFn = $compile(template);
                var content = linkFn(scope);
                el.append(content);
            });
        }
    };
} ]);

angular.module("qti").directive("flowMat", [ "ATTR_MAP", function(ATTR_MAP) {
    return {
        restrict: "E",
        scope: true,
        link: function(scope, el, attr) {
            for (var e in attr) {
                if (ATTR_MAP[e]) {
                    el.css(ATTR_MAP[e], isNaN(attr[e]) ? attr[e] : attr[e] + "px");
                }
            }
        }
    };
} ]);

angular.module("qti").directive("img", function() {
    return {
        restrict: "E",
        scope: true,
        link: function(scope, el, attr) {
            if (attr.hasOwnProperty("align")) {
                el.css("vertical-align", attr.align);
            }
        }
    };
});

angular.module("qti").directive("item", [ "$sce", function($sce) {
    return {
        restrict: "E",
        scope: true,
        link: function(scope, el, attr) {
            scope.item.questionId = attr.ident;
            scope.$broadcast("item::ready");
        },
        controller: [ "$scope", function($scope) {
            $scope.objective = null;
            $scope.item = {};
            $scope.trustHtml = function(html) {
                return $sce.trustAsHtml(html);
            };
        } ]
    };
} ]);

angular.module("qti").directive("matimage", [ "helpers", function(helpers) {
    return {
        restrict: "E",
        scope: true,
        link: function(scope, el, attr) {
            var str, xml;
            xml = helpers.strToXML("<img />").firstChild;
            var valign;
            switch (attr.valign) {
              case "top":
                valign = "top";
                break;

              case "bottom":
                valign = "bottom";
                break;

              default:
                valign = "middle";
                break;
            }
            var style = "vertical-align:" + valign + ";";
            if (attr.hasOwnProperty("width")) {
                style += "width:" + attr.width + "px;";
            }
            if (attr.hasOwnProperty("height")) {
                style += "height:" + attr.height + "px;";
            }
            if (attr.hasOwnProperty("uri")) {
                xml.setAttribute("src", attr.uri);
            } else if (attr.hasOwnProperty("embedded")) {
                str = "data:image/jpg;base64,";
                xml.setAttribute("src", str + el.text());
            }
            if (attr.hasOwnProperty("alt")) {
                xml.setAttribute("alt", attr.alt);
            }
            xml.setAttribute("style", style);
            el.html(xml.outerHTML);
        }
    };
} ]);

angular.module("qti").directive("mattext", [ "$sce", function($sce) {
    return {
        restrict: "E",
        scope: true,
        link: function(scope, el, attr) {
            if (attr.hasOwnProperty("width")) {
                el.css("width", attr.width + "px");
            }
            if (attr.hasOwnProperty("height")) {
                el.css("height", attr.height + "px");
            }
            if (attr.hasOwnProperty("fontface")) {
                el.css("font-family", attr.fontface);
            }
            if (attr.hasOwnProperty("fontsize")) {
                el.css("font-size", attr.fontsize + "px");
            }
        }
    };
} ]);

angular.module("qti").directive("matvideo", [ "$compile", function($compile) {
    return {
        restrict: "E",
        scope: true,
        templateUrl: "templates/video.html",
        controller: [ "$scope", "$sce", function($scope, $sce) {
            $scope.currentTime = 0;
            $scope.totalTime = 0;
            $scope.state = null;
            $scope.volume = 1;
            $scope.isCompleted = false;
            $scope.API = null;
            $scope.onPlayerReady = function(API) {
                $scope.API = API;
            };
            $scope.onCompleteVideo = function() {
                $scope.isCompleted = true;
            };
            $scope.onUpdateState = function(state) {
                $scope.state = state;
            };
            $scope.onUpdateTime = function(currentTime, totalTime) {
                $scope.currentTime = currentTime;
                $scope.totalTime = totalTime;
            };
            $scope.onUpdateVolume = function(newVol) {
                $scope.volume = newVol;
            };
            $scope.onUpdateSize = function(width, height) {
                $scope.config.width = width;
                $scope.config.height = height;
            };
            $scope.audio = [ {
                src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/audios/videogular.mp3") + "",
                type: "audio/mpeg"
            }, {
                src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/audios/videogular.ogg") + "",
                type: "audio/ogg"
            } ];
            $scope.videos = [ {
                sources: [ {
                    src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/videogular.mp4") + "",
                    type: "video/mp4"
                }, {
                    src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/videogular.webm") + "",
                    type: "video/webm"
                }, {
                    src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/videogular.ogg") + "",
                    type: "video/ogg"
                } ],
                tracks: [ {
                    src: "assets/subs/pale-blue-dot.vtt",
                    kind: "subtitles",
                    srclang: "en",
                    label: "English",
                    "default": ""
                } ]
            }, {
                sources: [ {
                    src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/big_buck_bunny_720p_h264.mov") + "",
                    type: "video/mp4"
                }, {
                    src: $sce.trustAsResourceUrl("http://www.videogular.com/assets/videos/big_buck_bunny_720p_stereo.ogg") + "",
                    type: "video/ogg"
                } ]
            } ];
            $scope.config = {
                autoHide: false,
                autoHideTime: 3e3,
                autoPlay: false,
                sources: $scope.videos[0].sources,
                tracks: $scope.videos[0].tracks,
                loop: true,
                preload: "auto",
                transclude: true,
                controls: undefined,
                theme: {
                    url: "styles/themes/default/videogular.css"
                },
                plugins: {
                    poster: {
                        url: "assets/images/videogular.png"
                    }
                }
            };
            $scope.changeSource = function() {
                $scope.config.sources = $scope.videos[1].sources;
                $scope.config.tracks = undefined;
                $scope.config.loop = false;
                $scope.config.preload = true;
            };
        } ]
    };
} ]);

angular.module("qti").directive("objectives", function() {
    return {
        restrict: "E",
        link: function(scope, el, attr) {
            scope.objectives[attr.ident] = el[0].querySelector("mattext").innerHTML;
            el[0].outerHTML = null;
            scope.$on("item::ready", function() {});
        },
        controller: [ "$scope", function($scope) {
            $scope.objectives = $scope.objectives || {};
        } ]
    };
});

angular.module("qti").directive("p", [ "$compile", function($compile) {
    function parseTabStops(attributes) {
        var tabStops = {};
        if (attributes) {
            var props = attributes.split(";");
            var prop, key, value;
            for (var i = 0; i < props.length; i += 1) {
                prop = props[i].split(":");
                key = (prop[0] + "").trim();
                value = (prop[1] + "").trim();
                if (key === "interval") {
                    tabStops[key] = Number(value);
                } else if (key === "tabset") {
                    tabStops[key] = JSON.parse('{"list": [' + value + "]}").list;
                } else if (key === "alignment") {
                    tabStops[key] = value.match(/\w+/gim);
                    if (tabStops[key].length === 1) {
                        tabStops[key] = tabStops[key][0];
                    }
                }
            }
        }
        return tabStops;
    }
    return {
        restrict: "E",
        scope: true,
        link: function(scope, el, attr) {
            var tabStops = parseTabStops(attr.tabStops);
            var html = el.html();
            var linkFn, content;
            html = html.split("	").join('<span style="padding-right:' + tabStops.interval + 'in"></span>');
            html = "<div>" + html + "</div>";
            linkFn = $compile(html);
            content = linkFn(scope);
            el.empty();
            el.append(content);
        }
    };
} ]);

angular.module("qti").directive("presentation", [ "ATTR_MAP", function(ATTR_MAP) {
    return {
        restrict: "E",
        transclude: true,
        templateUrl: "templates/presentation.html",
        link: function(scope, el, attr) {
            var questionStem = el[0].querySelector("mattext");
            if (questionStem) {
                scope.item.question = questionStem.innerHTML;
            }
            for (var e in attr) {
                if (ATTR_MAP[e]) {
                    el.css(ATTR_MAP[e], isNaN(attr[e]) ? attr[e] : attr[e] + "px");
                }
            }
            scope.$on("item::ready", function() {});
        },
        controller: [ "$scope", function($scope) {} ]
    };
} ]);

angular.module("qti").directive("responseLid", function() {
    return {
        restrict: "E",
        scope: true,
        transclude: true,
        templateUrl: "templates/question-type.html",
        link: function(scope, el, attr) {
            scope.item.type = attr.rcardinality;
        },
        controller: [ "$scope", function($scope) {} ]
    };
});

angular.module("qti").filter("type", function() {
    return function(value) {
        switch (value) {
          case "multiple":
            return "Matching";
        }
        return "One Correct Option";
    };
});

angular.module("qti").service("helpers", function() {
    this.strToXML = function(str) {
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
});

"use strict";

angular.module("com.2fdevs.videogular.plugins.buffering", []).directive("vgBuffering", [ "VG_UTILS", function(VG_UTILS) {
    return {
        restrict: "E",
        require: "^videogular",
        template: "<div class='bufferingContainer'>" + "<div ng-class='spinnerClass' class='loadingSpinner'></div>" + "</div>",
        link: function(scope, elem, attr, API) {
            function showSpinner() {
                scope.spinnerClass = {
                    stop: API.isBuffering
                };
                elem.css("display", "block");
            }
            function hideSpinner() {
                scope.spinnerClass = {
                    stop: API.isBuffering
                };
                elem.css("display", "none");
            }
            function setState(isBuffering) {
                if (isBuffering) {
                    showSpinner();
                } else {
                    hideSpinner();
                }
            }
            function onPlayerReady(isReady) {
                if (isReady) {
                    hideSpinner();
                }
            }
            showSpinner();
            if (VG_UTILS.isMobileDevice()) {
                hideSpinner();
            } else {
                scope.$watch(function() {
                    return API.isReady;
                }, function(newVal, oldVal) {
                    if (newVal != oldVal) {
                        onPlayerReady(newVal);
                    }
                });
            }
            scope.$watch(function() {
                return API.isBuffering;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    setState(newVal);
                }
            });
        }
    };
} ]);

"use strict";

angular.module("com.2fdevs.videogular.plugins.controls", []).directive("vgControls", [ "$timeout", "VG_STATES", function($timeout, VG_STATES) {
    return {
        restrict: "E",
        require: "^videogular",
        transclude: true,
        template: '<div id="controls-container" ng-mousemove="onMouseMove()" ng-class="animationClass" ng-transclude></div>',
        scope: {
            autoHide: "=vgAutohide",
            autoHideTime: "=vgAutohideTime"
        },
        link: function(scope, elem, attr, API) {
            var w = 0;
            var h = 0;
            var autoHideTime = 2e3;
            var hideInterval;
            scope.onMouseMove = function onMouseMove() {
                if (scope.autoHide) showControls();
            };
            function hideControls() {
                scope.animationClass = "hide-animation";
            }
            function showControls() {
                scope.animationClass = "show-animation";
                $timeout.cancel(hideInterval);
                if (scope.autoHide) hideInterval = $timeout(hideControls, autoHideTime);
            }
            if (scope.autoHide != undefined) {
                scope.$watch("autoHide", function(value) {
                    if (value) {
                        scope.animationClass = "hide-animation";
                    } else {
                        scope.animationClass = "";
                        $timeout.cancel(hideInterval);
                        showControls();
                    }
                });
            }
            if (scope.autoHideTime != undefined) {
                scope.$watch("autoHideTime", function(value) {
                    autoHideTime = value;
                });
            }
        }
    };
} ]).directive("vgPlayPauseButton", [ "VG_STATES", function(VG_STATES) {
    return {
        restrict: "E",
        require: "^videogular",
        template: "<button class='iconButton' ng-click='onClickPlayPause()' ng-class='playPauseIcon' aria-label='Play/Pause'></button>",
        link: function(scope, elem, attr, API) {
            function setState(newState) {
                switch (newState) {
                  case VG_STATES.PLAY:
                    scope.playPauseIcon = {
                        pause: true
                    };
                    break;

                  case VG_STATES.PAUSE:
                    scope.playPauseIcon = {
                        play: true
                    };
                    break;

                  case VG_STATES.STOP:
                    scope.playPauseIcon = {
                        play: true
                    };
                    break;
                }
            }
            scope.onClickPlayPause = function onClickPlayPause() {
                API.playPause();
            };
            scope.playPauseIcon = {
                play: true
            };
            scope.$watch(function() {
                return API.currentState;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    setState(newVal);
                }
            });
        }
    };
} ]).directive("vgTimedisplay", [ function() {
    return {
        require: "^videogular",
        restrict: "E",
        link: function(scope, elem, attr, API) {
            scope.$watch(function() {
                return API.currentTime;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    scope.currentTime = newVal;
                }
            });
            scope.$watch(function() {
                return API.timeLeft;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    scope.timeLeft = newVal;
                }
            });
            scope.$watch(function() {
                return API.totalTime;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    scope.totalTime = newVal;
                }
            });
        }
    };
} ]).directive("vgScrubbar", [ "VG_STATES", "VG_UTILS", function(VG_STATES, VG_UTILS) {
    return {
        restrict: "AE",
        require: "^videogular",
        transclude: true,
        template: '<div role="slider" aria-valuemax="{{ariaTime(API.totalTime)}}" ' + 'aria-valuenow="{{ariaTime(API.currentTime)}}" ' + 'aria-valuemin="0" aria-label="Time scrub bar" tabindex="0" ' + 'ng-transclude ng-keydown="onScrubBarKeyDown($event)"></div>',
        link: function(scope, elem, attr, API) {
            var isSeeking = false;
            var isPlaying = false;
            var isPlayingWhenSeeking = false;
            var touchStartX = 0;
            var LEFT = 37;
            var RIGHT = 39;
            var NUM_PERCENT = 1;
            scope.API = API;
            scope.ariaTime = function(time) {
                return time === 0 ? "0" : Math.round(time.getTime() / 1e3);
            };
            function onScrubBarTouchStart($event) {
                var event = $event.originalEvent || $event;
                var touches = event.touches;
                var touchX;
                if (VG_UTILS.isiOSDevice()) {
                    touchStartX = (touches[0].clientX - event.layerX) * -1;
                } else {
                    touchStartX = event.layerX;
                }
                touchX = touches[0].clientX + touchStartX - touches[0].target.offsetLeft;
                isSeeking = true;
                if (isPlaying) isPlayingWhenSeeking = true;
                API.pause();
                seekTime(touchX * API.mediaElement[0].duration / elem[0].scrollWidth);
                scope.$apply();
            }
            function onScrubBarTouchMove($event) {
                var event = $event.originalEvent || $event;
                if (isPlayingWhenSeeking) {
                    isPlayingWhenSeeking = false;
                    API.play();
                }
                isSeeking = false;
                scope.$apply();
            }
            function onScrubBarTouchMove($event) {
                var event = $event.originalEvent || $event;
                var touches = event.touches;
                var touchX;
                if (isSeeking) {
                    touchX = touches[0].clientX + touchStartX - touches[0].target.offsetLeft;
                    seekTime(touchX * API.mediaElement[0].duration / elem[0].scrollWidth);
                }
                scope.$apply();
            }
            function onScrubBarTouchLeave(event) {
                isSeeking = false;
                scope.$apply();
            }
            function onScrubBarMouseDown(event) {
                event = VG_UTILS.fixEventOffset(event);
                isSeeking = true;
                if (isPlaying) isPlayingWhenSeeking = true;
                API.pause();
                seekTime(event.offsetX * API.mediaElement[0].duration / elem[0].scrollWidth);
                scope.$apply();
            }
            function onScrubBarMouseUp(event) {
                event = VG_UTILS.fixEventOffset(event);
                if (isPlayingWhenSeeking) {
                    isPlayingWhenSeeking = false;
                    API.play();
                }
                isSeeking = false;
                seekTime(event.offsetX * API.mediaElement[0].duration / elem[0].scrollWidth);
                scope.$apply();
            }
            function onScrubBarMouseMove(event) {
                if (isSeeking) {
                    event = VG_UTILS.fixEventOffset(event);
                    seekTime(event.offsetX * API.mediaElement[0].duration / elem[0].scrollWidth);
                }
                scope.$apply();
            }
            function onScrubBarMouseLeave(event) {
                isSeeking = false;
                scope.$apply();
            }
            scope.onScrubBarKeyDown = function(event) {
                var currentPercent = API.currentTime.getTime() / API.totalTime.getTime() * 100;
                if (event.which === LEFT || event.keyCode === LEFT) {
                    API.seekTime(currentPercent - NUM_PERCENT, true);
                    event.preventDefault();
                } else if (event.which === RIGHT || event.keyCode === RIGHT) {
                    API.seekTime(currentPercent + NUM_PERCENT, true);
                    event.preventDefault();
                }
            };
            function seekTime(time) {
                API.seekTime(time, false);
            }
            function setState(newState) {
                if (!isSeeking) {
                    switch (newState) {
                      case VG_STATES.PLAY:
                        isPlaying = true;
                        break;

                      case VG_STATES.PAUSE:
                        isPlaying = false;
                        break;

                      case VG_STATES.STOP:
                        isPlaying = false;
                        break;
                    }
                }
            }
            scope.$watch(function() {
                return API.currentState;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    setState(newVal);
                }
            });
            if (VG_UTILS.isMobileDevice()) {
                elem.bind("touchstart", onScrubBarTouchStart);
                elem.bind("touchend", onScrubBarTouchEnd);
                elem.bind("touchmove", onScrubBarTouchMove);
                elem.bind("touchleave", onScrubBarTouchLeave);
            } else {
                elem.bind("mousedown", onScrubBarMouseDown);
                elem.bind("mouseup", onScrubBarMouseUp);
                elem.bind("mousemove", onScrubBarMouseMove);
                elem.bind("mouseleave", onScrubBarMouseLeave);
            }
        }
    };
} ]).directive("vgScrubbarcurrenttime", [ function() {
    return {
        restrict: "E",
        require: "^videogular",
        link: function(scope, elem, attr, API) {
            var percentTime = 0;
            function onUpdateTime(newCurrentTime) {
                if (newCurrentTime && API.totalTime) {
                    percentTime = newCurrentTime.getTime() * -1 / 1e3 * 100 / (API.totalTime.getTime() * -1 / 1e3);
                    elem.css("width", percentTime + "%");
                }
            }
            function onComplete() {
                percentTime = 0;
                elem.css("width", percentTime + "%");
            }
            scope.$watch(function() {
                return API.currentTime;
            }, function(newVal, oldVal) {
                onUpdateTime(newVal);
            });
            scope.$watch(function() {
                return API.isCompleted;
            }, function(newVal, oldVal) {
                onComplete(newVal);
            });
        }
    };
} ]).directive("vgVolume", [ "VG_UTILS", function(VG_UTILS) {
    return {
        restrict: "E",
        link: function(scope, elem, attr) {
            function onMouseOverVolume() {
                scope.volumeVisibility = "visible";
                scope.$apply();
            }
            function onMouseLeaveVolume() {
                scope.volumeVisibility = "hidden";
                scope.$apply();
            }
            if (VG_UTILS.isMobileDevice()) {
                elem.css("display", "none");
            } else {
                scope.volumeVisibility = "hidden";
                elem.bind("mouseover", onMouseOverVolume);
                elem.bind("mouseleave", onMouseLeaveVolume);
            }
        }
    };
} ]).directive("vgVolumebar", [ "VG_UTILS", function(VG_UTILS) {
    return {
        restrict: "E",
        require: "^videogular",
        template: "<div class='verticalVolumeBar'>" + "<div class='volumeBackground' ng-click='onClickVolume($event)' ng-mousedown='onMouseDownVolume()' ng-mouseup='onMouseUpVolume()' ng-mousemove='onMouseMoveVolume($event)' ng-mouseleave='onMouseLeaveVolume()'>" + "<div class='volumeValue'></div>" + "<div class='volumeClickArea'></div>" + "</div>" + "</div>",
        link: function(scope, elem, attr, API) {
            var isChangingVolume = false;
            var volumeBackElem = angular.element(elem[0].getElementsByClassName("volumeBackground"));
            var volumeValueElem = angular.element(elem[0].getElementsByClassName("volumeValue"));
            scope.onClickVolume = function onClickVolume(event) {
                event = VG_UTILS.fixEventOffset(event);
                var volumeHeight = parseInt(volumeBackElem.prop("offsetHeight"));
                var value = event.offsetY * 100 / volumeHeight;
                var volValue = 1 - value / 100;
                API.setVolume(volValue);
            };
            scope.onMouseDownVolume = function onMouseDownVolume() {
                isChangingVolume = true;
            };
            scope.onMouseUpVolume = function onMouseUpVolume() {
                isChangingVolume = false;
            };
            scope.onMouseLeaveVolume = function onMouseLeaveVolume() {
                isChangingVolume = false;
            };
            scope.onMouseMoveVolume = function onMouseMoveVolume(event) {
                if (isChangingVolume) {
                    event = VG_UTILS.fixEventOffset(event);
                    var volumeHeight = parseInt(volumeBackElem.prop("offsetHeight"));
                    var value = event.offsetY * 100 / volumeHeight;
                    var volValue = 1 - value / 100;
                    API.setVolume(volValue);
                }
            };
            function updateVolumeView(value) {
                value = value * 100;
                volumeValueElem.css("height", value + "%");
                volumeValueElem.css("top", 100 - value + "%");
            }
            function onChangeVisibility(value) {
                elem.css("visibility", value);
            }
            elem.css("visibility", scope.volumeVisibility);
            scope.$watch("volumeVisibility", onChangeVisibility);
            scope.$watch(function() {
                return API.volume;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    updateVolumeView(newVal);
                }
            });
        }
    };
} ]).directive("vgMutebutton", [ function() {
    return {
        restrict: "E",
        require: "^videogular",
        template: "<button class='iconButton' ng-class='muteIcon'" + " ng-click='onClickMute()' ng-focus='onMuteButtonFocus()' ng-blur='onMuteButtonLoseFocus()' ng-keydown='onMuteButtonKeyDown($event)'" + " aria-label='Mute'></button>",
        link: function(scope, elem, attr, API) {
            var isMuted = false;
            var UP = 38;
            var DOWN = 40;
            var CHANGE_PER_PRESS = .05;
            scope.onClickMute = function onClickMute() {
                if (isMuted) {
                    scope.currentVolume = scope.defaultVolume;
                } else {
                    scope.currentVolume = 0;
                    scope.muteIcon = {
                        mute: true
                    };
                }
                isMuted = !isMuted;
                API.setVolume(scope.currentVolume);
            };
            scope.onMuteButtonFocus = function() {
                scope.volumeVisibility = "visible";
            };
            scope.onMuteButtonLoseFocus = function() {
                scope.volumeVisibility = "hidden";
            };
            scope.onMuteButtonKeyDown = function(event) {
                var currentVolume = API.volume != null ? API.volume : 1;
                if (event.which === UP || event.keyCode === UP) {
                    API.setVolume(currentVolume + CHANGE_PER_PRESS);
                    event.preventDefault();
                } else if (event.which === DOWN || event.keyCode === DOWN) {
                    API.setVolume(currentVolume - CHANGE_PER_PRESS);
                    event.preventDefault();
                }
            };
            function onSetVolume(newVolume) {
                scope.currentVolume = newVolume;
                if (!isMuted) {
                    scope.defaultVolume = newVolume;
                } else {
                    if (newVolume > 0) {
                        scope.defaultVolume = newVolume;
                    }
                }
                var percentValue = Math.round(newVolume * 100);
                if (percentValue == 0) {
                    scope.muteIcon = {
                        mute: true
                    };
                } else if (percentValue > 0 && percentValue < 25) {
                    scope.muteIcon = {
                        level0: true
                    };
                } else if (percentValue >= 25 && percentValue < 50) {
                    scope.muteIcon = {
                        level1: true
                    };
                } else if (percentValue >= 50 && percentValue < 75) {
                    scope.muteIcon = {
                        level2: true
                    };
                } else if (percentValue >= 75) {
                    scope.muteIcon = {
                        level3: true
                    };
                }
            }
            scope.defaultVolume = 1;
            scope.currentVolume = scope.defaultVolume;
            scope.muteIcon = {
                level3: true
            };
            scope.$watch(function() {
                return API.volume;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    onSetVolume(newVal);
                }
            });
        }
    };
} ]).directive("vgFullscreenbutton", [ function() {
    return {
        restrict: "AE",
        require: "^videogular",
        scope: {
            vgEnterFullScreenIcon: "=",
            vgExitFullScreenIcon: "="
        },
        template: "<button class='iconButton' ng-click='onClickFullScreen()' ng-class='fullscreenIcon' aria-label='Toggle full screen'></button>",
        link: function(scope, elem, attr, API) {
            function onChangeFullScreen(isFullScreen) {
                var result = scope.fullscreenIcon = {
                    enter: !isFullScreen,
                    exit: isFullScreen
                };
            }
            scope.onClickFullScreen = function onClickFullScreen() {
                API.toggleFullScreen();
            };
            scope.fullscreenIcon = {
                exit: false
            };
            scope.fullscreenIcon = {
                enter: true
            };
            scope.$watch(function() {
                return API.isFullScreen;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    onChangeFullScreen(newVal);
                }
            });
        }
    };
} ]);

"use strict";

angular.module("com.2fdevs.videogular.plugins.imaads", []).directive("vgImaAds", [ "$window", "VG_STATES", function($window, VG_STATES) {
    return {
        restrict: "E",
        require: "^videogular",
        scope: {
            vgNetwork: "=",
            vgUnitPath: "=",
            vgCompanion: "=",
            vgCompanionSize: "=",
            vgAdTagUrl: "=",
            vgSkipButton: "="
        },
        link: function(scope, elem, attr, API) {
            var adDisplayContainer = new google.ima.AdDisplayContainer(elem[0]);
            var adsLoader = new google.ima.AdsLoader(adDisplayContainer);
            var adsManager = null;
            var adsLoaded = false;
            var w;
            var h;
            var onContentEnded = function() {
                adsLoader.contentComplete();
            };
            var currentAd = 0;
            var skipButton = angular.element(scope.vgSkipButton);
            function onPlayerReady(isReady) {
                if (isReady) {
                    API.mediaElement[0].addEventListener("ended", onContentEnded);
                    w = API.videogularElement[0].offsetWidth;
                    h = API.videogularElement[0].offsetHeight;
                    adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, onAdsManagerLoaded, false, this);
                    adsLoader.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError, false, this);
                    if (scope.vgCompanion) {
                        googletag.cmd.push(function() {
                            googletag.defineSlot("/" + scope.vgNetwork + "/" + scope.vgUnitPath, scope.vgCompanionSize, scope.vgCompanion).addService(googletag.companionAds()).addService(googletag.pubads());
                            googletag.companionAds().setRefreshUnfilledSlots(true);
                            googletag.pubads().enableVideoAds();
                            googletag.enableServices();
                        });
                    }
                }
            }
            function onUpdateState(newState) {
                switch (newState) {
                  case VG_STATES.PLAY:
                    if (!adsLoaded) {
                        API.pause();
                        adDisplayContainer.initialize();
                        requestAds(scope.vgAdTagUrl);
                        adsLoaded = true;
                    }
                    break;

                  case VG_STATES.STOP:
                    adsLoader.contentComplete();
                    break;
                }
            }
            function requestAds(adTagUrl) {
                show();
                var adsRequest = new google.ima.AdsRequest();
                var computedStyle = $window.getComputedStyle(elem[0]);
                adsRequest.adTagUrl = adTagUrl;
                adsRequest.linearAdSlotWidth = parseInt(computedStyle.width, 10);
                adsRequest.linearAdSlotHeight = parseInt(computedStyle.height, 10);
                adsRequest.nonLinearAdSlotWidth = parseInt(computedStyle.width, 10);
                adsRequest.nonLinearAdSlotHeight = parseInt(computedStyle.height, 10);
                adsLoader.requestAds(adsRequest);
            }
            function onAdsManagerLoaded(adsManagerLoadedEvent) {
                show();
                adsManager = adsManagerLoadedEvent.getAdsManager(API.mediaElement[0]);
                processAdsManager(adsManager);
            }
            function processAdsManager(adsManager) {
                adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED, onContentPauseRequested, false, this);
                adsManager.addEventListener(google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED, onContentResumeRequested, false, this);
                adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPABLE_STATE_CHANGED, onSkippableStateChanged, false, this);
                adsManager.addEventListener(google.ima.AdEvent.Type.ALL_ADS_COMPLETED, onAllAdsComplete, false, this);
                adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, onAdComplete, false, this);
                adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError, false, this);
                adsManager.init(w, h, google.ima.ViewMode.NORMAL);
                adsManager.start();
            }
            function onSkippableStateChanged() {
                var isSkippable = adsManager.getAdSkippableState();
                if (isSkippable) {
                    skipButton.css("display", "block");
                } else {
                    skipButton.css("display", "none");
                }
            }
            function onClickSkip() {
                adsManager.skip();
            }
            function onContentPauseRequested() {
                show();
                API.mediaElement[0].removeEventListener("ended", onContentEnded);
                API.pause();
            }
            function onContentResumeRequested() {
                API.mediaElement[0].addEventListener("ended", onContentEnded);
                API.play();
                hide();
            }
            function onAdError() {
                if (adsManager) adsManager.destroy();
                hide();
                API.play();
            }
            function onAllAdsComplete() {
                hide();
            }
            function onAdComplete() {
                currentAd++;
            }
            function show() {
                elem.css("display", "block");
            }
            function hide() {
                elem.css("display", "none");
            }
            skipButton.bind("click", onClickSkip);
            elem.prepend(skipButton);
            angular.element($window).bind("resize", function() {
                w = API.videogularElement[0].offsetWidth;
                h = API.videogularElement[0].offsetHeight;
                if (adsManager) {
                    if (API.isFullScreen) {
                        adsManager.resize(w, h, google.ima.ViewMode.FULLSCREEN);
                    } else {
                        adsManager.resize(w, h, google.ima.ViewMode.NORMAL);
                    }
                }
            });
            scope.$watch(function() {
                return API.isReady;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    onPlayerReady(newVal);
                }
            });
            scope.$watch(function() {
                return API.currentState;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    onUpdateState(newVal);
                }
            });
        }
    };
} ]);

"use strict";

angular.module("com.2fdevs.videogular.plugins.overlayplay", []).directive("vgOverlayPlay", [ "VG_STATES", function(VG_STATES) {
    return {
        restrict: "E",
        require: "^videogular",
        template: "<div class='overlayPlayContainer' ng-click='onClickOverlayPlay()'>" + "<div class='iconButton' ng-class='overlayPlayIcon'></div>" + "</div>",
        link: function(scope, elem, attr, API) {
            function onComplete(target, params) {
                scope.overlayPlayIcon = {
                    play: true
                };
            }
            function onPlay(target, params) {
                scope.overlayPlayIcon = {};
            }
            function onChangeState(newState) {
                switch (newState) {
                  case VG_STATES.PLAY:
                    scope.overlayPlayIcon = {};
                    break;

                  case VG_STATES.PAUSE:
                    scope.overlayPlayIcon = {
                        play: true
                    };
                    break;

                  case VG_STATES.STOP:
                    scope.overlayPlayIcon = {
                        play: true
                    };
                    break;
                }
            }
            scope.onClickOverlayPlay = function onClickOverlayPlay(event) {
                API.playPause();
            };
            scope.overlayPlayIcon = {
                play: true
            };
            scope.$watch(function() {
                return API.currentState;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    onChangeState(newVal);
                }
            });
        }
    };
} ]);

"use strict";

angular.module("com.2fdevs.videogular.plugins.poster", []).directive("vgPosterImage", [ "VG_STATES", function(VG_STATES) {
    return {
        restrict: "E",
        require: "^videogular",
        scope: {
            vgUrl: "="
        },
        template: '<img ng-src="{{vgUrl}}">',
        link: function(scope, elem, attr, API) {
            function onUpdateState(newState) {
                switch (newState) {
                  case VG_STATES.PLAY:
                    elem.css("display", "none");
                    break;

                  case VG_STATES.STOP:
                    elem.css("display", "block");
                    break;
                }
            }
            scope.$watch(function() {
                return API.currentState;
            }, function(newVal, oldVal) {
                if (newVal != oldVal) {
                    onUpdateState(newVal);
                }
            });
        }
    };
} ]);

"use strict";

angular.module("com.2fdevs.videogular", [ "ngSanitize" ]).constant("VG_STATES", {
    PLAY: "play",
    PAUSE: "pause",
    STOP: "stop"
}).service("VG_UTILS", function() {
    this.fixEventOffset = function($event) {
        if (navigator.userAgent.match(/Firefox/i)) {
            var style = $event.currentTarget.currentStyle || window.getComputedStyle($event.target, null);
            var borderLeftWidth = parseInt(style["borderLeftWidth"], 10);
            var borderTopWidth = parseInt(style["borderTopWidth"], 10);
            var rect = $event.currentTarget.getBoundingClientRect();
            var offsetX = $event.clientX - borderLeftWidth - rect.left;
            var offsetY = $event.clientY - borderTopWidth - rect.top;
            $event.offsetX = offsetX;
            $event.offsetY = offsetY;
        }
        return $event;
    };
    this.getZIndex = function() {
        var zIndex = 1;
        angular.element("*").filter(function() {
            return angular.element(this).css("zIndex") !== "auto";
        }).each(function() {
            var thisZIndex = parseInt(angular.element(this).css("zIndex"));
            if (zIndex < thisZIndex) zIndex = thisZIndex + 1;
        });
        return zIndex;
    };
    this.secondsToDate = function(seconds) {
        var result = new Date();
        result.setTime(seconds * 1e3);
        return result;
    };
    this.isMobileDevice = function() {
        return typeof window.orientation !== "undefined" || navigator.userAgent.indexOf("IEMobile") !== -1;
    };
    this.isiOSDevice = function() {
        return navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/iPad/i);
    };
}).run([ "$window", "VG_UTILS", function($window, VG_UTILS) {
    var fullScreenAPI;
    var APIs = {
        w3: {
            enabled: "fullscreenEnabled",
            element: "fullscreenElement",
            request: "requestFullscreen",
            exit: "exitFullscreen",
            onchange: "fullscreenchange",
            onerror: "fullscreenerror"
        },
        newWebkit: {
            enabled: "webkitFullscreenEnabled",
            element: "webkitFullscreenElement",
            request: "webkitRequestFullscreen",
            exit: "webkitExitFullscreen",
            onchange: "webkitfullscreenchange",
            onerror: "webkitfullscreenerror"
        },
        oldWebkit: {
            enabled: "webkitIsFullScreen",
            element: "webkitCurrentFullScreenElement",
            request: "webkitRequestFullScreen",
            exit: "webkitCancelFullScreen",
            onchange: "webkitfullscreenchange",
            onerror: "webkitfullscreenerror"
        },
        moz: {
            enabled: "mozFullScreen",
            element: "mozFullScreenElement",
            request: "mozRequestFullScreen",
            exit: "mozCancelFullScreen",
            onchange: "mozfullscreenchange",
            onerror: "mozfullscreenerror"
        },
        ios: {
            enabled: "webkitFullscreenEnabled",
            element: "webkitFullscreenElement",
            request: "webkitEnterFullscreen",
            exit: "webkitExitFullscreen",
            onchange: "webkitfullscreenchange",
            onerror: "webkitfullscreenerror"
        },
        ms: {
            enabled: "msFullscreenEnabled",
            element: "msFullscreenElement",
            request: "msRequestFullscreen",
            exit: "msExitFullscreen",
            onchange: "msfullscreenchange",
            onerror: "msfullscreenerror"
        }
    };
    for (var browser in APIs) {
        if (APIs[browser].enabled in document) {
            fullScreenAPI = APIs[browser];
            fullScreenAPI.isFullScreen = function() {
                return document[this.element] != null;
            };
            break;
        }
    }
    if (VG_UTILS.isiOSDevice()) {
        fullScreenAPI = APIs.ios;
        fullScreenAPI.isFullScreen = function() {
            return document[this.element] != null;
        };
    }
    angular.element($window)[0].fullScreenAPI = fullScreenAPI;
} ]).directive("videogular", [ "$window", "VG_STATES", "VG_UTILS", function($window, VG_STATES, VG_UTILS) {
    return {
        restrict: "E",
        scope: {
            theme: "=vgTheme",
            autoPlay: "=vgAutoplay",
            vgComplete: "&",
            vgUpdateVolume: "&",
            vgUpdateTime: "&",
            vgUpdateState: "&",
            vgPlayerReady: "&",
            vgChangeSource: "&"
        },
        controller: [ "$scope", "$timeout", function($scope, $timeout) {
            var currentTheme = null;
            var isFullScreenPressed = false;
            var isMetaDataLoaded = false;
            var vgCompleteCallBack = $scope.vgComplete();
            var vgUpdateVolumeCallBack = $scope.vgUpdateVolume();
            var vgUpdateTimeCallBack = $scope.vgUpdateTime();
            var vgUpdateStateCallBack = $scope.vgUpdateState();
            var vgPlayerReadyCallBack = $scope.vgPlayerReady();
            var vgChangeSourceCallBack = $scope.vgChangeSource();
            this.videogularElement = null;
            this.clearMedia = function() {
                $scope.API.mediaElement[0].src = "";
            };
            this.onMobileVideoReady = function(evt, target) {
                this.onVideoReady(evt, target, true);
            };
            this.onVideoReady = function(evt, target, avoidDigest) {
                $scope.API.isReady = true;
                $scope.API.currentState = VG_STATES.STOP;
                if (!avoidDigest) $scope.$apply();
                isMetaDataLoaded = true;
                if ($scope.vgPlayerReady()) {
                    vgPlayerReadyCallBack = $scope.vgPlayerReady();
                    vgPlayerReadyCallBack($scope.API);
                }
                if ($scope.autoPlay && !VG_UTILS.isMobileDevice() || $scope.API.currentState === VG_STATES.PLAY) {
                    $timeout(function() {
                        $scope.API.play();
                    });
                }
            };
            this.onUpdateTime = function(event) {
                $scope.API.currentTime = VG_UTILS.secondsToDate(event.target.currentTime);
                $scope.API.totalTime = VG_UTILS.secondsToDate(event.target.duration);
                $scope.API.timeLeft = VG_UTILS.secondsToDate(event.target.duration - event.target.currentTime);
                if ($scope.vgUpdateTime()) {
                    vgUpdateTimeCallBack = $scope.vgUpdateTime();
                    vgUpdateTimeCallBack(event.target.currentTime, event.target.duration);
                }
                $scope.$apply();
            };
            this.$on = function() {
                $scope.$on.apply($scope, arguments);
            };
            this.seekTime = function(value, byPercent) {
                var second;
                if (byPercent) {
                    second = value * $scope.API.mediaElement[0].duration / 100;
                    $scope.API.mediaElement[0].currentTime = second;
                } else {
                    second = value;
                    $scope.API.mediaElement[0].currentTime = second;
                }
                $scope.API.currentTime = VG_UTILS.secondsToDate(second);
            };
            this.playPause = function() {
                if ($scope.API.mediaElement[0].paused) {
                    this.play();
                } else {
                    this.pause();
                }
            };
            this.setState = function(newState) {
                if (newState && newState != $scope.API.currentState) {
                    if ($scope.vgUpdateState()) {
                        vgUpdateStateCallBack = $scope.vgUpdateState();
                        vgUpdateStateCallBack(newState);
                    }
                    $scope.API.currentState = newState;
                }
                return $scope.API.currentState;
            };
            this.play = function() {
                $scope.API.mediaElement[0].play();
                this.setState(VG_STATES.PLAY);
            };
            this.pause = function() {
                $scope.API.mediaElement[0].pause();
                this.setState(VG_STATES.PAUSE);
            };
            this.stop = function() {
                $scope.API.mediaElement[0].pause();
                $scope.API.mediaElement[0].currentTime = 0;
                this.setState(VG_STATES.STOP);
            };
            this.toggleFullScreen = function() {
                if (!angular.element($window)[0].fullScreenAPI) {
                    if ($scope.API.isFullScreen) {
                        $scope.API.videogularElement.removeClass("fullscreen");
                        $scope.API.videogularElement.css("z-index", 0);
                    } else {
                        $scope.API.videogularElement.addClass("fullscreen");
                        $scope.API.videogularElement.css("z-index", VG_UTILS.getZIndex());
                    }
                    $scope.API.isFullScreen = !$scope.API.isFullScreen;
                } else {
                    if (angular.element($window)[0].fullScreenAPI.isFullScreen()) {
                        if (!VG_UTILS.isMobileDevice()) {
                            document[angular.element($window)[0].fullScreenAPI.exit]();
                        }
                    } else {
                        if (VG_UTILS.isMobileDevice()) {
                            if (VG_UTILS.isiOSDevice()) {
                                if (isMetaDataLoaded) {
                                    this.enterElementInFullScreen($scope.API.mediaElement[0]);
                                } else {
                                    isFullScreenPressed = true;
                                    this.play();
                                }
                            } else {
                                this.enterElementInFullScreen($scope.API.mediaElement[0]);
                            }
                        } else {
                            this.enterElementInFullScreen($scope.API.videogularElement[0]);
                        }
                    }
                }
            };
            this.enterElementInFullScreen = function(element) {
                element[angular.element($window)[0].fullScreenAPI.request]();
            };
            this.changeSource = function(newValue) {
                if ($scope.vgChangeSource()) {
                    vgChangeSourceCallBack = $scope.vgChangeSource();
                    vgChangeSourceCallBack(newValue);
                }
            };
            this.setVolume = function(newVolume) {
                if ($scope.vgUpdateVolume()) {
                    vgUpdateVolumeCallBack = $scope.vgUpdateVolume();
                    vgUpdateVolumeCallBack(newVolume);
                }
                $scope.API.mediaElement[0].volume = newVolume;
                $scope.API.volume = newVolume;
            };
            this.updateTheme = function(value) {
                if (currentTheme) {
                    var links = document.getElementsByTagName("link");
                    for (var i = 0, l = links.length; i < l; i++) {
                        if (links[i].outerHTML.indexOf(currentTheme) >= 0) {
                            links[i].parentNode.removeChild(links[i]);
                        }
                    }
                }
                if (value) {
                    var headElem = angular.element(document).find("head");
                    headElem.append("<link rel='stylesheet' href='" + value + "'>");
                    currentTheme = value;
                }
            };
            this.onStartBuffering = function(event) {
                $scope.API.isBuffering = true;
            };
            this.onStartPlaying = function(event) {
                event.target.width++;
                event.target.width--;
                $scope.API.isBuffering = false;
            };
            this.onComplete = function(event) {
                if ($scope.vgComplete()) {
                    vgCompleteCallBack = $scope.vgComplete();
                    vgCompleteCallBack();
                }
                $scope.API.setState(VG_STATES.STOP);
                $scope.API.isCompleted = true;
                $scope.$apply();
            };
            $scope.API = this;
            $scope.init = function() {
                $scope.API.isReady = false;
                $scope.API.isCompleted = false;
                $scope.API.currentTime = 0;
                $scope.API.totalTime = 0;
                $scope.API.timeLeft = 0;
                $scope.API.updateTheme($scope.theme);
                $scope.addBindings();
                if (angular.element($window)[0].fullScreenAPI) {
                    document.addEventListener(angular.element($window)[0].fullScreenAPI.onchange, $scope.onFullScreenChange);
                }
            };
            $scope.addBindings = function() {
                $scope.$watch("theme", function(newValue, oldValue) {
                    if (newValue != oldValue) {
                        $scope.API.updateTheme(newValue);
                    }
                });
                $scope.$watch("autoPlay", function(newValue, oldValue) {
                    if (newValue != oldValue) {
                        if (newValue) $scope.API.play();
                    }
                });
            };
            $scope.onFullScreenChange = function(event) {
                $scope.API.isFullScreen = angular.element($window)[0].fullScreenAPI.isFullScreen();
                $scope.$apply();
            };
            $scope.$on("$destroy", this.clearMedia);
            $scope.$on("$routeChangeStart", this.clearMedia);
            $scope.init();
        } ],
        link: {
            pre: function(scope, elem, attr, controller) {
                controller.videogularElement = angular.element(elem);
            }
        }
    };
} ]).directive("vgVideo", [ "$compile", "VG_UTILS", function($compile, VG_UTILS) {
    return {
        restrict: "E",
        require: "^videogular",
        scope: {
            vgSrc: "=",
            vgLoop: "=",
            vgPreload: "=",
            vgNativeControls: "=",
            vgTracks: "="
        },
        link: function(scope, elem, attr, API) {
            var videoTagText = '<video vg-source="vgSrc" ';
            videoTagText += "></video>";
            API.mediaElement = angular.element(videoTagText);
            var compiled = $compile(API.mediaElement)(scope);
            API.mediaElement[0].addEventListener("loadedmetadata", API.onVideoReady, false);
            API.mediaElement[0].addEventListener("waiting", API.onStartBuffering, false);
            API.mediaElement[0].addEventListener("ended", API.onComplete, false);
            API.mediaElement[0].addEventListener("playing", API.onStartPlaying, false);
            API.mediaElement[0].addEventListener("timeupdate", API.onUpdateTime, false);
            elem.append(compiled);
            if (VG_UTILS.isMobileDevice()) {
                API.mediaElement[0].removeEventListener("loadedmetadata", API.onVideoReady, false);
                API.onMobileVideoReady();
            }
        }
    };
} ]).directive("vgAudio", [ "$compile", "VG_UTILS", function($compile, VG_UTILS) {
    return {
        restrict: "E",
        require: "^videogular",
        scope: {
            vgSrc: "=",
            vgLoop: "=",
            vgPreload: "=",
            vgNativeControls: "=",
            vgTracks: "="
        },
        link: function(scope, elem, attr, API) {
            var audioTagText = '<audio vg-source="vgSrc" ';
            audioTagText += "></audio>";
            API.mediaElement = angular.element(audioTagText);
            var compiled = $compile(API.mediaElement)(scope);
            API.mediaElement[0].addEventListener("loadedmetadata", API.onVideoReady, false);
            API.mediaElement[0].addEventListener("waiting", API.onStartBuffering, false);
            API.mediaElement[0].addEventListener("ended", API.onComplete, false);
            API.mediaElement[0].addEventListener("playing", API.onStartPlaying, false);
            API.mediaElement[0].addEventListener("timeupdate", API.onUpdateTime, false);
            elem.append(compiled);
            if (VG_UTILS.isMobileDevice()) {
                API.mediaElement[0].removeEventListener("loadedmetadata", API.onVideoReady, false);
                API.onMobileVideoReady();
            }
        }
    };
} ]).directive("vgSource", [ function() {
    return {
        restrict: "A",
        link: {
            pre: function(scope, elem, attr) {
                var sources;
                var canPlay;
                function changeSource() {
                    canPlay = "";
                    if (elem[0].canPlayType) {
                        for (var i = 0, l = sources.length; i < l; i++) {
                            canPlay = elem[0].canPlayType(sources[i].type);
                            if (canPlay == "maybe" || canPlay == "probably") {
                                elem.attr("src", sources[i].src);
                                elem.attr("type", sources[i].type);
                                break;
                            }
                        }
                    } else {
                        elem.attr("src", sources[0].src);
                        elem.attr("type", sources[0].type);
                    }
                    if (canPlay == "") {}
                }
                scope.$watch(attr.vgSource, function(newValue, oldValue) {
                    if ((!sources || newValue != oldValue) && newValue) {
                        sources = newValue;
                        changeSource();
                    }
                });
            }
        }
    };
} ]).directive("vgTracks", [ function() {
    return {
        restrict: "A",
        require: "^videogular",
        link: {
            pre: function(scope, elem, attr, API) {
                var tracks;
                var trackText;
                var i;
                var l;
                function changeSource() {
                    var oldTracks = API.mediaElement.children();
                    for (i = 0, l = oldTracks.length; i < l; i++) {
                        oldTracks[i].remove();
                    }
                    if (tracks) {
                        for (i = 0, l = tracks.length; i < l; i++) {
                            trackText = "";
                            trackText += "<track ";
                            for (var prop in tracks[i]) {
                                trackText += prop + '="' + tracks[i][prop] + '" ';
                            }
                            trackText += "></track>";
                            API.mediaElement.append(trackText, tracks[i].src);
                        }
                    }
                }
                scope.$watch(attr.vgTracks, function(newValue, oldValue) {
                    if (!tracks || newValue != oldValue) {
                        tracks = newValue;
                        API.tracks = tracks;
                        changeSource();
                    }
                });
            }
        }
    };
} ]).directive("vgLoop", [ function() {
    return {
        restrict: "A",
        require: "^videogular",
        link: {
            pre: function(scope, elem, attr, API) {
                var loop;
                scope.$watch(attr.vgLoop, function(newValue, oldValue) {
                    if ((!loop || newValue != oldValue) && newValue) {
                        loop = newValue;
                        API.mediaElement.attr("loop", loop);
                    } else {
                        API.mediaElement.removeAttr("loop");
                    }
                });
            }
        }
    };
} ]).directive("vgPreload", [ function() {
    return {
        restrict: "A",
        require: "^videogular",
        link: {
            pre: function(scope, elem, attr, API) {
                var preload;
                scope.$watch(attr.vgPreload, function(newValue, oldValue) {
                    if ((!preload || newValue != oldValue) && newValue) {
                        preload = newValue;
                        API.mediaElement.attr("preload", preload);
                    } else {
                        API.mediaElement.removeAttr("preload");
                    }
                });
            }
        }
    };
} ]).directive("vgNativeControls", [ function() {
    return {
        restrict: "A",
        require: "^videogular",
        link: {
            pre: function(scope, elem, attr, API) {
                var controls;
                scope.$watch(attr.vgNativeControls, function(newValue, oldValue) {
                    if ((!controls || newValue != oldValue) && newValue) {
                        controls = newValue;
                        API.mediaElement.attr("controls", "");
                    } else {
                        API.mediaElement.removeAttr("controls");
                    }
                });
            }
        }
    };
} ]);

angular.module("qti").run([ "$templateCache", function($templateCache) {
    "use strict";
    $templateCache.put("templates/video.html", "<videogular vg-player-ready=onPlayerReady vg-complete=onCompleteVideo vg-update-time=onUpdateTime vg-update-volume=onUpdateVolume vg-update-state=onUpdateState vg-theme=config.theme.url vg-autoplay=config.autoPlay><vg-video vg-src=config.sources vg-tracks=config.tracks vg-loop=config.loop vg-preload=config.preload vg-native-controls=config.controls></vg-video><vg-controls vg-autohide=config.autoHide vg-autohide-time=config.autoHideTime><vg-play-pause-button></vg-play-pause-button><vg-timedisplay>{{ currentTime | date:'mm:ss' }}</vg-timedisplay><vg-scrubbar><vg-scrubbarcurrenttime></vg-scrubbarcurrenttime></vg-scrubbar><vg-timedisplay>{{ timeLeft | date:'mm:ss' }}</vg-timedisplay><vg-volume><vg-mutebutton></vg-mutebutton><vg-volumebar></vg-volumebar></vg-volume><vg-fullscreenbutton></vg-fullscreenbutton></vg-controls><vg-poster-image vg-url=config.plugins.poster.url></vg-poster-image><vg-buffering></vg-buffering><vg-overlay-play vg-play-icon=config.theme.playIcon></vg-overlay-play></videogular>");
} ]);

angular.module("qti").run([ "$templateCache", function($templateCache) {
    "use strict";
    $templateCache.put("templates/assessment.html", '<div class=qti-assessment><div class=qti-title>{{assessment.title}}</div><div class=qti-content><div ng-transclude=""></div></div></div>');
    $templateCache.put("templates/presentation.html", '<div><div ng-transclude=""></div></div>');
    $templateCache.put("templates/question-header.html", "<div class=qti-question-header>Question Id: {{item.questionId}}</div>");
    $templateCache.put("templates/question-options.html", '<div><div class=qti-title>Options:</div><div ng-transclude=""></div></div>');
    $templateCache.put("templates/question-stem.html", '<div style="border: 1px solid #ecf0f1"><div class=qti-title>Question Stem:</div><div class=qti-content ng-bind-html=trustHtml(item.question)></div></div>');
    $templateCache.put("templates/question-type.html", '<div><div class=qti-title>Type: {{item.type | type}}</div><div ng-transclude=""></div></div>');
    $templateCache.put("templates/radio.html", "<input type=radio>");
} ]);