/* global angular, events */
angular.module('simulation').directive('simSlide', function ($log) {
    return {
        restrict: 'AE',
        scope: true,
        controller: function ($scope, $element, $attrs) {

            var slideClass = 'slide_' + $scope.$id;
            $element.addClass(slideClass);

            $scope.properties = {};
            $scope.functions = {};

            /**
             * Registers functions on the slide's scope
             * @param name
             * @param fn
             */
            $scope.registerFunction = function (name, fn) {
                //console.log('register', name, fn);
                $scope.functions[name] = fn;
            };

            /**
             * Calls a function on the slide.
             * @param functionName
             */
            $scope.invoke = function (functionName) {
                if (typeof $scope.functions[functionName] === 'function') {

                    var targetScope = $scope;
                    var data = targetScope.getMerged('properties');

                    $scope.functions[functionName](targetScope, data);
                }
            };

            /**
             * Looks for <% %> in content and will try to invoke function in the following order
             * 1. Check if function exists on scope
             * 2. Check if function exists on scope.functions
             * 3. Check if function exists on global scope
             *
             * Supports both relative and explicit definitions. If user defines function as
             * myCallback() then the parser will add "this." to the front => this.myCallback().
             * If user defines with an explicit dot syntax, like so, window.myCallback(),
             * not change will occur.
             * @param content
             */
            $scope.parseFunctions = function (content) {
                content = content || '';
                var funcs = content.match(/(<%=?)((.|\n)*?)(%>)/gim);
                var fn = Function;

                var func;
                var result;
                var regex;

                angular.forEach(funcs, function (funcName) {

                    func = funcName.substring(3, funcName.length - 2).trim();

                    if (!func.match(/\w+\./im)) {
                        func = 'this.' + func;
                    }

                    try {
                        result = (new fn('return (' + func + ');')).apply($scope);
                    } catch (e) {
                        try {
                            result = (new fn('return (' + func + ');')).apply($scope.functions);
                        } catch (e) {
                            try {
                                result = (new fn('return (' + func + ');')).apply(window);
                            } catch (e) {
                                $log.warn('Could not invoke: ' + func);
                            }
                        }
                    }

                    // escape regex
                    funcName = funcName.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
                    // create regex
                    regex = new RegExp(funcName, 'im');
                    // replace first item only
                    content = content.replace(regex, result || '');
                });

                return content;
            };

            /**
             * Traverses the parent chain to get the current state of all the properties
             * @param prop
             * @returns {Object}
             */
            $scope.getMerged = function (prop) {
                var props = [{}];
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


            // :: init ::
            $scope.watch($attrs.url, function (url) {

                // used as a reference to the slide this represents
                $scope.$$url = url;

                $scope.loadSlide({
                    templateUrl: url,
                    targetEl: $element,
                    targetScope: $scope
                }).then(function () {
                    var targetScope = $scope;
                    var data = targetScope.getMerged('properties');
                    window.console.log('%cslide loaded ' + url, 'color: #8e44ad');
                    $scope.$broadcast(events.SLIDE_INIT, targetScope, data);

                    var unwatchReady = $scope.$on(events.APP_READY, function () {
                        unwatchReady();
                        var targetScope = $scope;
                        var data = targetScope.getMerged('properties');
                        //console.log('%cslide ready ' + url, 'color: #8e44ad');
                        window.console.log('%c %s ', 'background: #1abc9c; color: #fff; display:block', 'SLIDE READY', url);
                        $scope.$broadcast(events.SLIDE_READY, targetScope, data);
                    });
                });
            });

        }
    };
});