/* global angular */
angular.module('qti').directive('assessment', function () {
    return {
        restrict: 'E',
        scope: true,
        transclude: true,
        replace: true,
        templateUrl: 'templates/assessment.html',
        link: function (scope, el, attr) {
            scope.assessment = {
                id: attr.ident,
                title: attr.title
            };
        }
    };
});
