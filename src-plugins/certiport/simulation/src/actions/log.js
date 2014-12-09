/* global angular, console */
angular.module('simulation').directive('simLog', function ($rootScope, $interpolate) {
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

                parsedData = scope.parseFunctions(parsedData);
                if (attrs.debug) {
                    console.log('%c%s%c %s', 'background: #e67e22; color: #fff; display:block', '[DEBUG::' + scope.$$url + ']', 'background: #fff; color: #000; display:block', parsedData );
                } else {
                    console.info(parsedData);
                }
            });

            el.remove();
        }
    };
});