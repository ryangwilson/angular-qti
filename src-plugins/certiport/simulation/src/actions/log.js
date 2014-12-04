angular.module('simulation').directive('simLog', function ($rootScope, $interpolate, $log) {
    return {
        restrict: 'AE',
        link: function (scope, el, attrs) {

            var content = el.text();

            // [sim v2.1] backwards compatible
            content = content.split('event.data.').join('');
            content = scope.bindable(content);

            scope.registerAction(function (targetScope, data) {
                var exp = $interpolate(content);
                var parsedData = exp(data);
                $log.log(parsedData);
            });

            el.remove();
        }
    };
});