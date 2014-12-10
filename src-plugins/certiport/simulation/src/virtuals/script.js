/* global angular */
angular.module('simulation').directive('simScript', function ($http, $compile) {

    var scripts = {};

    return {
        restrict: 'AE',
        link: function (scope, el) {
            el.remove();
        },
        controller: function($scope, $element, $attrs) {

            if($attrs.src) {
                var url = $attrs.src;

                if (!scripts[url]) {

                    scripts[url] = true;

                    var path = '{val}'.supplant({val: url});
                    //console.log('path', path);
                    $http.get(path).success(function (content) {

                        var fn = Function;
                        (new fn(content)).apply($scope.functions);

                    });

                }
            } else {
                var content = $element.html();
                var fn = Function;
                (new fn(content)).apply($scope.functions);
            }


        }
    };
});