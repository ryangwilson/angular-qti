/* global angular */
angular.module('simulation').directive('simStrings', function ($http, XMLService) {
    return {
        restrict: 'AE',
        link: function (scope, el, attrs) {

            // first thing we do is increment
            scope.incCounter(attrs.url);

            var ext = '.xml';// TODO: Check if extension exists, default to XML
            $http.get(attrs.url + ext).success(function (html) {

                var json = XMLService.toJson(html);

                angular.extend(scope.$$strings, json);

                scope.loadVirtuals(html).then(function () {
                    // last thing we do is decrement counter
                    scope.decCounter(attrs.url);
                });

            });

            el.remove();
        }
    };
});