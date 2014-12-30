/* global angular, hb */
angular.module('certiport').directive('simExec', function ($interpolate, $rootScope) {
    return {
        restrict: 'AE',
        link: function (scope, el, attrs) {

            var content = el.text();
            content = scope.curlify(content);

            scope.registerAction(function (targetScope, data) {

                var exp = $interpolate(content);
                var result = exp(data);
                var parsedData = hb.fromJson(result);

                $rootScope.$broadcast(attrs.command, targetScope, parsedData);

                return parsedData;
            });

            el.empty();
        }
    };
});