/*
* application 0.1.0
*/
(function(exports, global) {
    global["application"] = exports;
    //! import string.supplant
    (function() {
        var _applications = {};
        function Application(name) {
            this.name = name;
            this.config = {};
            this.views = {};
            this.plugins = {
                $$cache: {}
            };
            hb.dispatcher(this);
        }
        Application.prototype.init = function(config) {
            hb.extend(this.config, config);
            return this;
        };
        Application.prototype.view = function(name, options) {
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
        Application.prototype.registerPlugin = function(name, functionOrUrl) {
            this.plugins[name] = functionOrUrl;
            return this;
        };
        Application.prototype.getPlugin = function(name, options) {
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
        Application.prototype.getViewElement = function(name, options) {
            var scope = this;
            var view = scope.view(name);
            options = extend({}, view, options);
            var viewEl = scope.renderElement(view.name, options);
            var plugin, pluginEl;
            angular.forEach(options.plugins, function(pluginData) {
                plugin = scope.getPlugin(pluginData.name, pluginData.options);
                console.warn("THIS IS BEING REFACTORED");
            });
            return viewEl;
        };
        Application.prototype.renderElement = function(tag_name, options) {
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
        window.application = function(name) {
            if (!_applications[name]) {
                _applications[name] = new Application(name);
            }
            return _applications[name];
        };
    })();
    angular.module("certiport.plugin", []);
    var application = angular.module("certiport", [ "certiport.plugin" ], [ "$compileProvider", "$controllerProvider", function($compileProvider, $controllerProvider) {
        application.api.consts.$compileProvider = $compileProvider;
        application.api.consts.$controllerProvider = $controllerProvider;
    } ]);
    application.api = {};
    application.api.consts = {};
    application.api.directives = {};
    application.api.directive = function(name, fn) {
        application.api.directives[name] = fn;
    };
    application.api.applyDirectives = function() {
        angular.forEach(application.api.directives, function(fn, name) {
            application.directive(name, fn);
        });
    };
    var events = {};
    events.APP_INIT = "app.events.init";
    events.APP_READY = "app.events.ready";
    events.SLIDE_INIT = "slide.events.init";
    events.SLIDE_READY = "slide.events.ready";
    angular.module("certiport").directive("click", function() {
        return {
            restrict: "A",
            link: function(scope, el, attrs) {
                var handler = function(evt) {
                    evt.stopPropagation();
                    window.event = evt;
                    scope.invoke(attrs.click);
                };
                el.parent().on("click", handler);
                scope.$on("$destroy", function() {
                    el.parent().off("click", handler);
                });
            }
        };
    });
    angular.module("certiport").directive("dblclick", function() {
        return {
            restrict: "A",
            link: function(scope, el, attrs) {
                var handler = function(evt) {
                    evt.stopPropagation();
                    window.event = evt;
                    scope.invoke(attrs.dblclick);
                };
                el.parent().on("dblclick", handler);
                scope.$on("$destroy", function() {
                    el.parent().off("dblclick", handler);
                });
            }
        };
    });
    angular.module("certiport").directive("mousedown", function() {
        return {
            restrict: "A",
            link: function(scope, el, attrs) {
                var handler = function(evt) {
                    evt.stopPropagation();
                    window.event = evt;
                    scope.invoke(attrs.mousedown);
                };
                el.parent().on("mousedown", handler);
                scope.$on("$destroy", function() {
                    el.parent().off("mousedown", handler);
                });
            }
        };
    });
    angular.module("certiport").directive("mouseenter", function() {
        return {
            restrict: "A",
            link: function(scope, el, attrs) {
                var handler = function(evt) {
                    evt.stopPropagation();
                    window.event = evt;
                    scope.invoke(attrs.mouseenter);
                };
                el.parent().on("mouseenter", handler);
                scope.$on("$destroy", function() {
                    el.parent().off("mouseenter", handler);
                });
            }
        };
    });
    angular.module("certiport").directive("mouseleave", function() {
        return {
            restrict: "A",
            link: function(scope, el, attrs) {
                var handler = function(evt) {
                    evt.stopPropagation();
                    window.event = evt;
                    scope.invoke(attrs.mouseleave);
                };
                el.parent().on("mouseleave", handler);
                scope.$on("$destroy", function() {
                    el.parent().off("mouseleave", handler);
                });
            }
        };
    });
    angular.module("certiport").directive("mousemove", function() {
        return {
            restrict: "A",
            link: function(scope, el, attrs) {
                var handler = function(evt) {
                    evt.stopPropagation();
                    window.event = evt;
                    scope.invoke(attrs.mousemove);
                };
                el.parent().on("mousemove", handler);
                scope.$on("$destroy", function() {
                    el.parent().off("mousemove", handler);
                });
            }
        };
    });
    angular.module("certiport").directive("mouseover", function() {
        return {
            restrict: "A",
            link: function(scope, el, attrs) {
                var handler = function(evt) {
                    evt.stopPropagation();
                    window.event = evt;
                    scope.invoke(attrs.mouseover);
                };
                el.parent().on("mouseover", handler);
                scope.$on("$destroy", function() {
                    el.parent().off("mouseover", handler);
                });
            }
        };
    });
    angular.module("certiport").directive("mouseup", function() {
        return {
            restrict: "A",
            link: function(scope, el, attrs) {
                var handler = function(evt) {
                    evt.stopPropagation();
                    window.event = evt;
                    scope.invoke(attrs.mouseup);
                };
                el.parent().on("mouseup", handler);
                scope.$on("$destroy", function() {
                    el.parent().off("mouseup", handler);
                });
            }
        };
    });
    angular.module("certiport").directive("application", [ "$http", "$compile", "$q", "$timeout", function($http, $compile, $q, $timeout) {
        return {
            restrict: "AE",
            scope: true,
            controller: [ "$scope", "$element", "$attrs", function($scope, $element, $attrs) {
                var prefixTag = "sim-";
                var openCurly = "{{";
                var closeCurly = "}}";
                var openBindTag = "{%";
                var closeBindTag = "%}";
                var newline = "\n";
                var counter = 0;
                var regExp, patterns = [];
                var virtuals = {};
                var analytics = {
                    slideCount: 0,
                    virtualCount: 0
                };
                $scope.extension = $attrs.extension;
                $scope.url = $scope.$eval($attrs.url);
                $scope.plugins = $scope.$eval($attrs.plugins);
                $scope.$$data = {};
                var ds = hb.resolve($scope.$$data);
                $scope.$$strings = {};
                var incCounter = function(url) {
                    counter += 1;
                    console.log("%cinc(" + counter + "): " + url, "color: #27ae60");
                };
                var decCounter = function(url) {
                    counter -= 1;
                    console.log("%cdec(" + counter + "): " + url, "color: #c0392b");
                };
                var slideInterceptors = [];
                $scope.addSlideInterceptor = function(interceptor) {
                    slideInterceptors.push(interceptor);
                };
                $scope.set = function(path, value, delimiter) {
                    delimiter = delimiter || "/";
                    if (path.indexOf("::") !== -1) {
                        path = path.split("::").join("|").split(delimiter).join("|");
                        delimiter = "|";
                    }
                    return ds.set(path, value, delimiter);
                };
                $scope.get = function(path, delimiter) {
                    delimiter = delimiter || "/";
                    if (path.indexOf("::") !== -1) {
                        path = path.split("::").join("|").split(delimiter).join("|");
                        delimiter = "|";
                    }
                    return ds.get(path, delimiter);
                };
                $scope.watch = function(path, callback, deepWatch) {
                    if (!$scope.isBindable(path)) {
                        $timeout(function() {
                            callback(path);
                        }, 0);
                        return function() {};
                    }
                    var delimiter = "/";
                    path = path.substring(2, path.length - 2);
                    if (path.indexOf("::") !== -1) {
                        path = '$$data["' + path.split("::").join("|").split(delimiter).join("|").split("|").join('"]["') + '"]';
                    }
                    return $scope.$watch(path, function(val) {
                        if (val) {
                            callback(val);
                        }
                    }, deepWatch);
                };
                var openClosedTags = function(html) {
                    return html.replace(/<([\w|-]+)(\s.*)\/>/gim, "<$1$2></$1>");
                };
                var parseRegisteredTags = function(html) {
                    angular.forEach(patterns, function(pattern) {
                        html = html.replace(pattern, "<$1sim-$2$3");
                    });
                    return html;
                };
                var parseStrings = function(html) {
                    html = html.replace(/\$([\w\.]+)/gim, "{{::@@strings.$1}}");
                    html = html.split("@@").join("$$");
                    return html;
                };
                var parseBindables = function(html) {
                    var $el = angular.element("<div>" + html + "</div>");
                    var childNodes = $el[0].childNodes;
                    var len = childNodes.length;
                    for (var e = 0; e < len; e++) {
                        if (childNodes[e] && childNodes[e].nodeType === 1) {
                            childNodes[e].outerHTML = childNodes[e].outerHTML.split(openCurly).join(openBindTag).split(closeCurly).join(closeBindTag);
                        }
                    }
                    return $el.html();
                };
                var reserveTags = function(tags) {
                    if (typeof tags === "string") {
                        tags = tags.split(" ");
                    }
                    var reservedWords = tags;
                    angular.forEach(reservedWords, function(word) {
                        if (word) {
                            regExp = new RegExp("<(/?)(" + word + ")([\\s>])", "gm");
                            patterns.push(regExp);
                        }
                    });
                };
                var appendCommand = function(path, html) {
                    html = parseRegisteredTags(html);
                    html = html.replace(/name="(\w+)"/gim, 'name="' + path + '::$1"');
                    var el = angular.element(html);
                    var compiled = $compile(el);
                    compiled($scope);
                    $element.append(el);
                };
                $scope.isBindable = function(val) {
                    val += "";
                    return val.indexOf(openBindTag) !== -1;
                };
                $scope.curlify = function(content) {
                    return content.split(openBindTag).join(openCurly).split(closeBindTag).join(closeCurly);
                };
                $scope.loadSlide = function(options) {
                    console.log("%cloading slide " + options.templateUrl + " ", "color: #bdc3c7");
                    incCounter(options.templateUrl);
                    analytics.slideCount += 1;
                    var deferred = $q.defer();
                    var path = "{val}.{ext}".supplant({
                        val: options.templateUrl,
                        ext: $scope.extension || "xml"
                    });
                    $http.get(path).success(function(html) {
                        html = openClosedTags(html);
                        angular.forEach(slideInterceptors, function(interceptor) {
                            html = interceptor(html);
                        });
                        html = parseRegisteredTags(html);
                        html = parseBindables(html);
                        html = parseStrings(html);
                        html = "<!-- " + options.templateUrl + " -->" + newline + html;
                        var el = angular.element(html);
                        var compiled = $compile(el);
                        compiled(options.targetScope);
                        options.targetEl.append(el);
                        $scope.loadVirtuals(html, path).then(function() {
                            console.log("%cvirtuals loaded for " + options.templateUrl, "color: #3498db");
                            deferred.resolve();
                        });
                        decCounter(options.templateUrl);
                    });
                    return deferred.promise;
                };
                $scope.loadVirtuals = function(content, url) {
                    var deferred = $q.defer();
                    var cleanHtml = content.replace(/<!--[\s\S]*?-->/g, "");
                    var files = cleanHtml.match(/([\w\.\/]+)(?=::)/gim);
                    if (files) {
                        var virtualCount = 0;
                        angular.forEach(files, function(url) {
                            if (!virtuals[url]) {
                                virtualCount += 1;
                                incCounter(url);
                                analytics.virtualCount += 1;
                                virtuals[url] = true;
                                var ext = ".xml";
                                $http.get(url + ext).success(function(html) {
                                    var xmlns = html.match(/xmlns\="(.*?)(?=")/gim);
                                    if (!xmlns) {
                                        throw new Error('missing require "xmlns" attribute');
                                    }
                                    var type = xmlns[0].split("/").pop();
                                    switch (type) {
                                      case "model":
                                        var json = hb.fromXML(html);
                                        $scope.set(url, json);
                                        break;

                                      case "commands":
                                        appendCommand(url, html);
                                        break;
                                    }
                                    $scope.loadVirtuals(html, url).then(function() {
                                        deferred.resolve();
                                    });
                                    decCounter(url);
                                });
                            }
                            if (virtualCount === 0) {
                                deferred.resolve();
                            }
                        });
                    } else {
                        deferred.resolve();
                    }
                    return deferred.promise;
                };
                $scope.parseRegisteredTags = parseRegisteredTags;
                $scope.incCounter = incCounter;
                $scope.decCounter = decCounter;
                $element.addClass(prefixTag + "cloak");
                reserveTags([ "exec", "log", "events", "event", "commands", "command", "functions", "function", "properties", "listeners", "button", "slide", "mixins", "mixin", "view", "eval", "virtual", "script", "style", "link", "listener", "image", "strings" ]);
                $scope.$watch("url", function(url) {
                    if (url) {
                        analytics.startTime = Date.now();
                        console.log("%c APPLICATION START ", "background: #2980b9; color: #fff");
                        $scope.$broadcast(events.APP_INIT);
                        $scope.loadSlide({
                            templateUrl: url,
                            targetScope: $scope,
                            targetEl: $element
                        }).then(function($el) {});
                        var timer;
                        var unwatch = $scope.$watch(function() {
                            $timeout.cancel(timer);
                            timer = $timeout(function() {
                                if (counter < 1) {
                                    unwatch();
                                    console.log("%c %s ", "background: #1abc9c; color: #fff; display:block; width: 200px", "SLIDE READY", url);
                                    $scope.$broadcast(events.APP_READY);
                                    $element.removeClass(prefixTag + "cloak");
                                    analytics.endTime = Date.now();
                                    analytics.totalTime = analytics.endTime - analytics.startTime;
                                    console.log("%c APPLICATION READY ", "background: #27ae60; color: #fff; display:block;");
                                    console.log("");
                                    console.log("%cAPPLICATION REPORT", "border-bottom: 1px solid #34495e; color: #666; display:block;");
                                    console.log("%ctime: " + analytics.totalTime, "color: #34495e; display:block");
                                    console.log("%cslide count: " + analytics.slideCount, "color: #34495e; display:block");
                                    console.log("%cvirtual count: " + analytics.virtualCount, "color: #34495e; display:block");
                                    console.log("");
                                    $scope.$root.$emit("ready");
                                }
                            }, 0);
                        });
                    }
                });
            } ]
        };
    } ]);
    angular.module("certiport").directive("simButton", function() {
        return {
            restrict: "AE",
            link: function(scope, el, attrs) {
                el.text(attrs.label);
            }
        };
    });
    angular.module("certiport").directive("simImage", [ "$compile", function($compile) {
        return {
            restrict: "AE",
            scope: true,
            link: function($scope, $el, $attrs) {
                var html = '<img ng-src="{{src}}" ondragstart="return false" />';
                var el = angular.element(html);
                var compiled = $compile(el);
                compiled($scope);
                $el.append(el);
                $scope.watch($attrs.src, function(url) {
                    $scope.src = url;
                    $scope.incCounter($attrs.src);
                    el.bind("load", function() {
                        $scope.decCounter($attrs.src);
                        if (!$scope.$$phase) {
                            $scope.$apply();
                        }
                    });
                });
            }
        };
    } ]);
    angular.module("certiport").directive("simSlide", [ "$log", function($log) {
        return {
            restrict: "AE",
            scope: true,
            controller: [ "$scope", "$element", "$attrs", function($scope, $element, $attrs) {
                var slideClass = "slide_" + $scope.$id;
                $element.addClass(slideClass);
                $scope.properties = {};
                $scope.functions = {};
                $scope.registerFunction = function(name, fn) {
                    $scope.functions[name] = fn;
                };
                $scope.invoke = function(functionName) {
                    if (typeof $scope.functions[functionName] === "function") {
                        var targetScope = $scope;
                        var data = targetScope.getMerged("properties");
                        $scope.functions[functionName](targetScope, data);
                    }
                };
                $scope.parseFunctions = function(content) {
                    content = content || "";
                    var funcs = content.match(/(<%=?)((.|\n)*?)(%>)/gim);
                    var fn = Function;
                    var func;
                    var result;
                    var regex;
                    angular.forEach(funcs, function(funcName) {
                        func = funcName.substring(3, funcName.length - 2).trim();
                        if (!func.match(/\w+\./im)) {
                            func = "this." + func;
                        }
                        try {
                            result = new fn("return (" + func + ");").apply($scope);
                        } catch (e) {
                            try {
                                result = new fn("return (" + func + ");").apply($scope.functions);
                            } catch (e) {
                                try {
                                    result = new fn("return (" + func + ");").apply(window);
                                } catch (e) {
                                    $log.warn("Could not invoke: " + func);
                                }
                            }
                        }
                        funcName = funcName.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
                        regex = new RegExp(funcName, "im");
                        content = content.replace(regex, result || "");
                    });
                    return content;
                };
                $scope.getMerged = function(prop) {
                    var props = [ {} ];
                    var currentScope = $scope;
                    while (currentScope.$parent) {
                        currentScope = currentScope.$parent;
                        if (!currentScope[prop]) {
                            break;
                        }
                        props.push(currentScope[prop]);
                    }
                    props.push($scope[prop]);
                    return angular.extend.apply(null, props);
                };
                $scope.watch($attrs.url, function(url) {
                    $scope.$$url = url;
                    $scope.loadSlide({
                        templateUrl: url,
                        targetEl: $element,
                        targetScope: $scope
                    }).then(function() {
                        var targetScope = $scope;
                        var data = targetScope.getMerged("properties");
                        window.console.log("%cslide loaded " + url, "color: #8e44ad");
                        $scope.$broadcast(events.SLIDE_INIT, targetScope, data);
                        var unwatchReady = $scope.$on(events.APP_READY, function() {
                            unwatchReady();
                            var targetScope = $scope;
                            var data = targetScope.getMerged("properties");
                            window.console.log("%c %s ", "background: #1abc9c; color: #fff; display:block", "SLIDE READY", url);
                            $scope.$broadcast(events.SLIDE_READY, targetScope, data);
                        });
                    });
                });
            } ]
        };
    } ]);
    angular.module("certiport").directive("simEval", [ "$interpolate", function($interpolate) {
        return {
            restrict: "AE",
            link: function(scope, el, attrs) {
                var content = el.text();
                content = scope.curlify(content);
                scope.registerAction(function(targetScope, data) {
                    var exp = $interpolate(content);
                    var parsedData = exp(data);
                    console.log("whoisscope", scope.functions.uppercase, parsedData);
                    var fn = Function;
                    var returnVal = new fn("return (" + parsedData + ");").apply(scope);
                    if (returnVal === undefined) {
                        return returnVal;
                    }
                });
            }
        };
    } ]);
    angular.module("certiport").directive("simExec", [ "$interpolate", "$rootScope", function($interpolate, $rootScope) {
        return {
            restrict: "AE",
            link: function(scope, el, attrs) {
                var content = el.text();
                content = scope.curlify(content);
                scope.registerAction(function(targetScope, data) {
                    var exp = $interpolate(content);
                    var result = exp(data);
                    var parsedData = hb.fromJson(result);
                    $rootScope.$broadcast(attrs.command, targetScope, parsedData);
                    return parsedData;
                });
                el.empty();
            }
        };
    } ]);
    angular.module("certiport").directive("simLog", [ "$rootScope", "$interpolate", function($rootScope, $interpolate) {
        return {
            restrict: "AE",
            link: function(scope, el, attrs) {
                var content = el.text();
                content = scope.curlify(content);
                scope.registerAction(function(targetScope, data) {
                    var exp = $interpolate(content);
                    var parsedData = exp(data);
                    parsedData = targetScope.parseFunctions(parsedData);
                    if (attrs.debug) {
                        console.log("%c%s%c %s", "background: #e67e22; color: #fff; display:block", "[DEBUG::" + targetScope.$$url + "]", "background: #fff; color: #000; display:block", parsedData);
                    } else {
                        console.info(parsedData);
                    }
                });
                el.remove();
            }
        };
    } ]);
    angular.module("certiport").directive("simCommand", [ "$rootScope", "$log", function($rootScope, $log) {
        var commands = {};
        return {
            restrict: "AE",
            scope: true,
            link: function(scope, el) {
                el.remove();
            },
            controller: [ "$scope", "$attrs", function($scope, $attrs) {
                var returnVal;
                $log.log("%ccommand added: " + $attrs.name, "color: #8e44ad");
                $scope.actions = [];
                $scope.registerAction = function(fn) {
                    $scope.actions.push(fn);
                };
                if (!commands[$attrs.name]) {
                    commands[$attrs.name] = true;
                    $rootScope.$on($attrs.name, function(evt, targetScope, data) {
                        angular.forEach($scope.actions, function(action) {
                            if (typeof action === "function") {
                                returnVal = action(targetScope, data);
                                if (typeof returnVal !== "undefined") {
                                    data = returnVal;
                                }
                            }
                        });
                    });
                }
            } ]
        };
    } ]);
    angular.module("certiport").directive("simFunction", function() {
        return {
            restrict: "AE",
            scope: true,
            link: function(scope, el) {
                el.remove();
            },
            controller: [ "$scope", "$attrs", function($scope, $attrs) {
                var returnVal;
                $scope.actions = [];
                $scope.registerFunction($attrs.name, function(targetScope, data) {
                    angular.forEach($scope.actions, function(action) {
                        if (typeof action === "function") {
                            returnVal = action(targetScope, data);
                            if (typeof returnVal !== "undefined") {
                                data = returnVal;
                            }
                        }
                    });
                });
                $scope.registerAction = function(fn) {
                    $scope.actions.push(fn);
                };
            } ]
        };
    });
    angular.module("certiport").directive("simLink", [ "$http", function($http) {
        var scripts = {};
        return {
            restrict: "AE",
            controller: [ "$scope", "$element", "$attrs", function($scope, $element, $attrs) {
                var slideClass = ".slide_" + $scope.$id;
                if ($attrs.href) {
                    var url = $attrs.href;
                    if (!scripts[url]) {
                        scripts[url] = true;
                        var path = "{val}".supplant({
                            val: url
                        });
                        $http.get(path).success(function(content) {
                            content = content.replace(/([\#\.\D]{1}[A-Za-z]{1}[\w\.\s]+)(,|\{)/g, function(match, p1, p2) {
                                return (slideClass + " " + p1.trim() + p2).trim();
                            });
                            $element[0].outerHTML = "<style>" + content + "</style>";
                        });
                    }
                }
            } ]
        };
    } ]);
    angular.module("certiport").directive("simListener", [ "$interpolate", function($interpolate) {
        return {
            restrict: "AE",
            link: function(scope, el) {
                el.remove();
            },
            controller: [ "$scope", "$attrs", function($scope, $attrs) {
                $scope.$on($attrs.on, function(evt, targetScope, data) {
                    var handler = $attrs.handler;
                    var fnName = handler.match(/^\w+/im)[0];
                    if ($scope.functions[fnName]) {
                        var openParenIndex = handler.indexOf("(");
                        var closeParenIndex = handler.lastIndexOf(")");
                        if (openParenIndex === -1) {
                            handler += "(this)";
                        } else {
                            var str1 = handler.substr(0, openParenIndex + 1);
                            var str2 = handler.substr(openParenIndex + 1);
                            if (handler.substr(openParenIndex, closeParenIndex).match(/\w+/im)) {
                                handler = str1 + "this, " + str2;
                            } else {
                                handler = str1 + "this" + str2;
                            }
                        }
                        handler = "functions." + handler;
                        handler = $scope.curlify(handler);
                        var exp = $interpolate(handler);
                        var interpolatedHandler = exp(data);
                        $scope.$eval(interpolatedHandler);
                    }
                });
            } ]
        };
    } ]);
    angular.module("certiport").directive("simMixin", [ "$http", "$compile", function($http, $compile) {
        var mixins = {};
        return {
            restrict: "AE",
            scope: true,
            link: function(scope, el) {
                el.remove();
            },
            controller: [ "$scope", "$element", "$attrs", function($scope, $element, $attrs) {
                var url = $element.html();
                if (!mixins[url]) {
                    mixins[url] = true;
                    var path = "{val}.{ext}".supplant({
                        val: url,
                        ext: "xml"
                    });
                    $http.get(path).success(function(html) {
                        html = $scope.parseRegisteredTags(html);
                        var el = angular.element(html);
                        var compiled = $compile(el);
                        $element.append(el);
                        compiled($scope);
                    });
                }
            } ]
        };
    } ]);
    angular.module("certiport").directive("bottom", function() {
        return {
            restrict: "A",
            link: function($scope, $el, $attrs) {
                var value = String($attrs.bottom).match(/\d+/);
                var unit = String($attrs.bottom).match(/\D+/) || "px";
                $el.css("position", "absolute");
                $el.css("bottom", value + unit);
            }
        };
    });
    angular.module("certiport").directive("height", function() {
        return {
            restrict: "A",
            link: function($scope, $el, $attrs) {
                var value = String($attrs.height).match(/\d+/);
                var unit = String($attrs.height).match(/\D+/) || "px";
                $el.css("height", value + unit);
            }
        };
    });
    angular.module("certiport").directive("left", function() {
        return {
            restrict: "A",
            link: function($scope, $el, $attrs) {
                var value = String($attrs.left).match(/\d+/);
                var unit = String($attrs.left).match(/\D+/) || "px";
                $el.css("position", "absolute");
                $el.css("left", value + unit);
            }
        };
    });
    angular.module("certiport").directive("right", function() {
        return {
            restrict: "A",
            link: function($scope, $el, $attrs) {
                var value = String($attrs.right).match(/\d+/);
                var unit = String($attrs.right).match(/\D+/) || "px";
                $el.css("position", "absolute");
                $el.css("right", value + unit);
            }
        };
    });
    angular.module("certiport").directive("top", function() {
        return {
            restrict: "A",
            link: function($scope, $el, $attrs) {
                var value = String($attrs.top).match(/\d+/);
                var unit = String($attrs.top).match(/\D+/) || "px";
                $el.css("position", "absolute");
                $el.css("top", value + unit);
            }
        };
    });
    angular.module("certiport").directive("width", function() {
        return {
            restrict: "A",
            link: function($scope, $el, $attrs) {
                var value = String($attrs.width).match(/\d+/);
                var unit = String($attrs.width).match(/\D+/) || "px";
                $el.css("width", value + unit);
            }
        };
    });
    angular.module("certiport").directive("x", function() {
        return {
            restrict: "A",
            link: function($scope, $el, $attrs) {
                var value = String($attrs.x).match(/\d+/);
                var unit = String($attrs.x).match(/\D+/) || "px";
                $el.css("position", "absolute");
                $el.css("left", value + unit);
            }
        };
    });
    angular.module("certiport").directive("y", function() {
        return {
            restrict: "A",
            link: function($scope, $el, $attrs) {
                var value = String($attrs.y).match(/\d+/);
                var unit = String($attrs.y).match(/\D+/) || "px";
                $el.css("position", "absolute");
                $el.css("top", value + unit);
            }
        };
    });
    angular.module("certiport").directive("simProperties", function() {
        return {
            restrict: "AE",
            link: function(scope, el, attrs) {
                var content = "<props>" + el.html() + "</props>";
                var xml = hb.toXML(content);
                var json = hb.fromXML(xml);
                angular.extend(scope.properties, json.props);
                el.remove();
            }
        };
    });
    angular.module("certiport").directive("simScript", [ "$http", "$compile", function($http, $compile) {
        var scripts = {};
        return {
            restrict: "AE",
            link: function(scope, el) {
                el.remove();
            },
            controller: [ "$scope", "$element", "$attrs", function($scope, $element, $attrs) {
                if ($attrs.src) {
                    var url = $attrs.src;
                    if (!scripts[url]) {
                        scripts[url] = true;
                        var path = "{val}".supplant({
                            val: url
                        });
                        $http.get(path).success(function(content) {
                            var fn = Function;
                            new fn(content).apply($scope.functions);
                        });
                    }
                } else {
                    var content = $element.html();
                    var fn = Function;
                    new fn(content).apply($scope.functions);
                }
            } ]
        };
    } ]);
    angular.module("certiport").directive("simStrings", [ "$http", function($http) {
        return {
            restrict: "AE",
            link: function(scope, el, attrs) {
                scope.incCounter(attrs.url);
                var ext = ".xml";
                $http.get(attrs.url + ext).success(function(html) {
                    var json = hb.fromXML(html);
                    angular.extend(scope.$$strings, json);
                    scope.loadVirtuals(html).then(function() {
                        scope.decCounter(attrs.url);
                    });
                });
                el.remove();
            }
        };
    } ]);
    angular.module("certiport").directive("simStyle", function() {
        return {
            restrict: "AE",
            controller: [ "$scope", "$element", "$attrs", function($scope, $element, $attrs) {
                var slideClass = ".slide_" + $scope.$id;
                var content = $element.html();
                content = content.replace(/([\#\.\D]{1}[A-Za-z]{1}[\w\.\s]+)(,|\{)/g, function(match, p1, p2) {
                    return (slideClass + " " + p1.trim() + p2).trim();
                });
                $element[0].outerHTML = "<style>" + content + "</style>";
            } ]
        };
    });
    angular.module("certiport").directive("backgroundColor", function() {
        return {
            restrict: "A",
            link: function($scope, $el, $attrs) {
                $el.css("backgroundColor", $attrs.backgroundColor);
            }
        };
    });
    angular.module("certiport").directive("simVirtual", function() {
        return {
            restrict: "AE",
            link: function(scope, el) {
                el.remove();
            }
        };
    });
    exports["application"] = application;
    exports["events"] = events;
})({}, function() {
    return this;
}());