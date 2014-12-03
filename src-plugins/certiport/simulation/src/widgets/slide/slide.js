/* global angular */
angular.module('simulation').directive('simSlide', function ($http, $compile, $timeout) {
    return {
        restrict: 'AE',
        scope: true,
        controller: function ($scope, $element, $attrs) {

            var newline = '\n';

            var slideClass = 'slide_' + $scope.$id;
            $element.addClass(slideClass);

            $scope.properties = {};
            $scope.functions = {};

            var load = function (val) {
                if (val !== undefined) {

                    //console.log('slide url:', val);

                    var path = '{val}.{ext}'.supplant({val: val, ext: $scope.extension || 'xml'});
                    $http.get(path).success(function (html) {

                        html = $scope.openClosedTags(html);

                        var htmlEl = angular.element(html);
                        html = htmlEl.html();

                        html = $scope.parseRegisteredTags(html);
                        html = $scope.parseBindables(html);
                        html = '<!-- ' + val + ' -->' + newline + html;


                        var el = angular.element(html);

                        //console.log('success:', el.html());

                        //compile the view into a function.
                        var compiled = $compile(el);

                        //append our view to the element of the directive.
                        $element.append(el);

                        //bind our view to the scope!
                        //(try commenting out this line to see what happens!)
                        compiled($scope);

                    });

                    $timeout(function () {
                        var targetScope = $scope;
                        var data = targetScope.getMerged('properties');
                        $scope.$broadcast('load', targetScope, data);
                    }, 100);
                }
            };

            var registerFunction = function (name, fn) {
                //console.log('register', name, fn);
                $scope.functions[name] = fn;
            };

            var invoke = function (functionName) {
                if (typeof $scope.functions[functionName] === 'function') {

                    var targetScope = $scope;
                    var data = targetScope.getMerged('properties');

                    $scope.functions[functionName](targetScope, data);
                }
            };

            var getMerged = function (prop) {
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

            $scope.registerFunction = registerFunction;
            $scope.invoke = invoke;
            $scope.getMerged = getMerged;

            // :: init ::
            (function init() {
                var url;
                if ($attrs.url) {
                    if ($attrs.url[0] === '\'') {
                        url = $attrs.url.replace(/\'/gim, '');
                        load(url);
                    } else {
                        console.log('THIS HAS NOT BEEN DONE');
                    }
                }
            })();

        }
    };
});