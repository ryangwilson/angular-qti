/*
* platform 0.1.0
*/
(function(exports, global) {
    global["platform"] = exports;
    //! import string.supplant
    var platformConsts = {};
    angular.module("platform", [], [ "$compileProvider", "$controllerProvider", function($compileProvider, $controllerProvider) {
        platformConsts.$compileProvider = $compileProvider;
        platformConsts.$controllerProvider = $controllerProvider;
    } ]);
    var events = {};
    events.PLATFORM_INIT = "platform.events.init";
    events.PLATFORM_READY = "platform.events.ready";
    events.VIEW_INIT = "view.events.init";
    events.VIEW_READY = "view.events.ready";
    events.PLUGIN_INIT = "plugin.events.init";
    events.PLUGIN_READY = "plugin.events.ready";
    (function() {
        var _platforms = {};
        function Platform(name) {
            this.name = name;
            this.config = {};
            this.views = {};
            this.plugins = {
                $$cache: {}
            };
            platty.dispatcher(this);
        }
        Platform.prototype.init = function(config) {
            angular.extend(this.config, config);
            return this;
        };
        Platform.prototype.view = function(name, options) {
            if (typeof options === "undefined") {
                var view = this.views[name];
                if (!view) {
                    throw new Error("View not registered with name: {name}.").supplant({
                        name: name
                    });
                }
                return view;
            }
            this.views[name] = options;
            return this;
        };
        Platform.prototype.registerPlugin = function(name, functionOrUrl) {
            this.plugins[name] = functionOrUrl;
            return this;
        };
        Platform.prototype.getPlugin = function(name, options) {
            if (!this.plugins.$$cache[name]) {
                var pluginFn = this.plugins[name];
                if (!pluginFn) {
                    throw new Error("Plugin not registered with name: {name}.").supplant({
                        name: name
                    });
                }
                this.plugins.$$cache[name] = pluginFn();
            }
            return this.plugins.$$cache[name];
        };
        Platform.prototype.getViewElement = function(name, options) {
            var scope = this;
            var view = scope.view(name);
            options = platty.extend({}, view, options);
            var viewEl = scope.renderElement(view.name, options);
            var plugin, pluginEl;
            angular.forEach(options.plugins, function(pluginData) {
                plugin = scope.getPlugin(pluginData.name, pluginData.options);
                console.warn("THIS IS BEING REFACTORED");
            });
            return viewEl;
        };
        Platform.prototype.renderElement = function(tag_name, options) {
            var template = "<{tag_name}></{tag_name}>";
            var html = template.supplant({
                tag_name: tag_name
            });
            var el = angular.element(html);
            angular.forEach(options.attrs, function(value, name) {
                el.attr(name, value);
            });
            return el;
        };
        window.platform = function(name) {
            if (!_platforms[name]) {
                _platforms[name] = new Platform(name);
            }
            return _platforms[name];
        };
    })();
    var extend = function(target, source) {
        var args = Array.prototype.slice.call(arguments, 0), i = 1, len = args.length, item, j;
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
    angular.module("platform").directive("platform", [ "$http", "$compile", "$controller", function($http, $compile, $controller) {
        return {
            restrict: "AE",
            link: function(scope, el, attrs) {
                var p = platform(attrs.name);
                var init = function() {
                    var plugin;
                    angular.forEach(p.config.plugins, function(pluginInfo) {
                        plugin = p.getPlugin(pluginInfo.name, pluginInfo.options);
                        if (typeof plugin !== "function") {
                            throw new Error("Plugin must return a function to be valid.");
                        }
                        platty.injector("platform").invoke(plugin, {}, {
                            name: pluginInfo.name,
                            options: pluginInfo.options,
                            platform: p,
                            next: function() {
                                console.log("next called!!!");
                            }
                        });
                    });
                    p.fire("platform.events.init", p);
                };
                p.render = function(name, options) {
                    var viewEl = p.getViewElement(name, options);
                    angular.bootstrap(viewEl, [ "certiport" ]);
                    el.append(viewEl);
                    var injector = viewEl.injector();
                    var applicationScope = injector.get("$rootScope");
                    applicationScope.$on("ready", function() {
                        p.fire("platform.events.ready");
                    });
                };
                init();
            }
        };
    } ]);
    exports["platformConsts"] = platformConsts;
    exports["events"] = events;
    exports["extend"] = extend;
})({}, function() {
    return this;
}());