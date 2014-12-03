angular.module('simulation').directive('simMixin', function ($http, $compile) {

    var mixins = {};

    return {
        restrict: 'AE',
        scope: true,
        link: function (scope, el) {
            el.remove();
        },
        controller: function ($scope, $element, $attrs) {

            var url = $element.html();

            if (!mixins[url]) {

                mixins[url] = true;

                var path = '{val}.{ext}'.supplant({val: url, ext: $scope.extension || 'xml'});
                $http.get(path).success(function (html) {

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