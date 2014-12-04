/* global angular */
angular.module('simulation').directive('simSlide', function ($http, $compile, $timeout) {
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
            (function init() {
                var url;

                // TODO: IN DEVELOPMENT
                if ($attrs.url) {
                    if ($attrs.url[0] === '\'') { // if the string is in quotes it is a literal
                        url = $attrs.url.replace(/\'/gim, '');
                        $scope.loadSlide({
                            templateUrl: url,
                            targetEl: $element,
                            targetScope: $scope
                        }).then(function(){
                            //$timeout(function () {
                                var targetScope = $scope;
                                var data = targetScope.getMerged('properties');
                                $scope.$broadcast('load', targetScope, data);
                            //}, 100);
                        });
                    } else { // otherwise it is referencing a model
                        var filepath = $attrs.url.match(/([\w\.\/]+)(?=::)/gim);
                        console.warn('SLIDE SUBSCRIBING TO EVENT FOR', filepath.toString());
                        var off = $scope.$on(filepath.toString(), function () {
                            off();
                            console.info('#### SLIDE READY TO LOAD ####', $attrs.url);
                        });
                    }
                }
            })();

        }
    };
});