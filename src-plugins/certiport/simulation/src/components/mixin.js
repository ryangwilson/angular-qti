angular.module('simulation').directive('simMixin', function ($http, $compile) {

    return {
        restrict: 'AE',
        scope: true,
        link: function (scope, el) {
            el.remove();
        },
        controller: function ($scope, $element, $attrs) {

            var url = $element.html();

            $scope.mixins = $scope.mixins || {};
            if (!$scope.mixins[url]) {

                $scope.mixins[url] = true;

                $http.get(url).success(function (html) {

                    html = $scope.parseRegisteredTags(html);

                    var el = angular.element(html);

                    //compile the view into a function.
                    var compiled = $compile(el);

                    //append our view to the element of the directive.
                    $element.append(el);

                    //bind our view to the scope!
                    //(try commenting out this line to see what happens!)
                    compiled($scope);

                });

            }
        }
    };
});