/* global angular */
angular.module('simulation').directive('simEval', function ($interpolate, $window) {
    return {
        restrict: 'AE',
        link: function (scope, el, attrs) {

            var content = el.text();

            // [sim v2.1] backwards compatible
            content = content.split('event.data.').join('');

            content = scope.curlify(content);

            scope.registerAction(function (targetScope, data) {

                var exp = $interpolate(content);
                var parsedData = exp(data);

                //console.log('parsed', parsedData);

                var fn = Function;
                var result = (new fn('var result = (' + parsedData + ');')).apply(scope);

                //console.log('result', result);

            });

            el.remove();
        }
    };
});