/* global angular */
angular.module('simulation').directive('simImage', function ($compile) {
    return {
        restrict: 'AE',
        scope: true,
        link: function ($scope, $el, $attrs) {

            // declare html
            var html = '<img ng-src="{{src}}" ondragstart="return false" />';

            // create angular element
            var el = angular.element(html);

            //compile the view into a function.
            var compiled = $compile(el);

            //bind our view to the scope!
            compiled($scope);

            //append our view to the element of the directive.
            $el.append(el);

            $scope.watch($attrs.src, function (url) {

                $scope.src = url;
                $scope.incCounter($attrs.src);

                el.bind('load', function () {
                    $scope.decCounter($attrs.src);
                    if (!$scope.$$phase) {
                        $scope.$apply();
                    }
                });
            });
        }
    };
});
