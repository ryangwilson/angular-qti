/* global angular */
angular.module('simulation').directive('simEval', function ($interpolate) {
    return {
        restrict: 'AE',
        link: function (scope, el, attrs) {

            var content = el.text();

            content = scope.curlify(content);

            scope.registerAction(function (targetScope, data) {

                var exp = $interpolate(content);
                var parsedData = exp(data);

                //console.log('parsed', parsedData);
                console.log('whoisscope', scope.functions.uppercase, parsedData);

                var fn = Function;
                var returnVal = (new fn('return (' + parsedData + ');')).apply(scope);
                if(returnVal === undefined) {
                    return returnVal;
                    //el.remove();
                    //el.outerHTML()
                }
            });

        }
    };
});