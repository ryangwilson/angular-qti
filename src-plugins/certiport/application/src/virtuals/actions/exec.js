/* global angular */
angular.module('certiport').directive('simExec', function ($interpolate, $rootScope, json) {
    return {
        restrict: 'AE',
        link: function (scope, el, attrs) {

            var content = el.text();
            content = scope.curlify(content);

            scope.registerAction(function (targetScope, data) {

                var exp = $interpolate(content);
                var result = exp(data);
                var parsedData =  json.parse(result);

                $rootScope.$broadcast(attrs.command, targetScope, parsedData);

                return parsedData;
            });

            el.empty();
        }
    };
});